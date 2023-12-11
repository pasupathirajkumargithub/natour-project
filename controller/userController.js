const AppError = require("../utils/appError");
const User = require("../Modal/usermodel");
const Factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

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
exports.UplodeUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  console.log(req.file);
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (Obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(Obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = Obj[el];
  });

  return newObj;
};

//

//=================================================================================================>

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "this router is not for password updates. Please use /updateMyPassword ."
      ),
      400
    );
  }
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: "Success", data: { user: updatedUser } });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(202).json({ status: "Success", data: null });
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUser = Factory.getAll(User);

exports.getUser = Factory.getOne(User);

exports.createUser = Factory.createOne(User);

exports.updateUser = Factory.updateOne(User);

exports.deleteUser = Factory.deleteOne(User);
