const { promises } = require("nodemailer/lib/xoauth2");
// const jimp = require("jimp");
const Tour = require("./../Modal/tourmodal");
const AppError = require("./../utils/appError");
const Factory = require("./handlerFactory");

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not a image file..!", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImage = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.resizeTourImage = catchAsync(async (req, res, next) => {
  console.log(req.files);
  if (!req.files.imageCover || !req.files.images) return next();

  req.body.imageCover = `Tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // await new jimp(req.files.imageCover[0].buffer)
  //   .resize(2000, 1333)
  //   .quality(100)
  //   .write(`public/img/tours/${req.boy.imageCover}`);

  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const imageFileName = `Tour-${req.params.id}-${Date.now()}-${1 + i}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 100 })
        .toFile(`public/img/tours/${imageFileName}`);

      // await new jimp(file.buffer)
      //   .quality(100)
      //   .resize(2000, 1333)
      //   .write(`public/img/tours/${imageFileName}`);

      req.body.images.push(imageFileName);
    })
  );
  next();
});

exports.aliasTopTour = (req, res, next) => {
  // Log the original request query parameters to the console
  console.log(req.query);

  // Modify the request query parameters
  req.query.limit = "5";
  req.query.sort = "ratingsAverage, price";
  req.query.fields = "name, price, ratingsAverage, difficulty, summary";

  // Call the next middleware or route handler
  next();
};

exports.getAllTours = Factory.getAll(Tour);

exports.getTour = Factory.getOne(Tour, { path: "reviews" });

exports.createTour = Factory.createOne(Tour);

exports.updateTour = Factory.updateOne(Tour);

exports.deleteTour = Factory.deleteOne(Tour);

//===================================================================================>

exports.getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;

  const [lat, lng] = latlng.split(",");

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(new AppError("you must have to provide a latitude and longitude..!"));
  }
  const tour = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({ status: "success", result: tour.length, data: tour });
});

//==================================================================================>
exports.getDistance = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;

  const [lat, lng] = latlng.split(",");

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(new AppError("you must have to provide a latitude and longitude..!"));
  }

  const distance = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({ status: "success", data: { data: distance } });
});
//==================================================================================>

exports.getTourStat = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gt: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        ratingsAverage: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  if (!stats) return next(new AppError("Unable to get Statics..!", 404));

  res.status(200).json({
    status: "Success",
    data: { stats },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
