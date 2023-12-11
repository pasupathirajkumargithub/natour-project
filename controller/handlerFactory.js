const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
const APIFeatures = require("./../utils/apiFeaturs");

const AppError = require("../utils/appError");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });

    if (!doc) {
      return next(new AppError("No document found in this ID..!", 404));
    }

    res.status(204).json({
      status: "Success",
      data: null,
    });
  });

exports.updateOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });
    console.log(doc);
    if (!doc) {
      return next(new AppError("No document found in this ID..!", 404));
    }

    res.status(201).json({
      status: "Success",
      data: doc,
    });
  });

exports.createOne = (model) =>
  catchAsync(async (req, res, next) => {
    const newData = await model.create(req.body);

    res.status(201).json({
      status: "Success",
      data: { Data: newData },
    });
  });

exports.getOne = (model, popOption) =>
  catchAsync(async (req, res, next) => {
    let query = model.findById(req.params.id);

    if (popOption) query = query.populate(popOption);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found in this ID..!", 404));
    }

    res.status(200).json({ status: "Success", data: doc });
  });

exports.getAll = (model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const Features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .fields()
      .pagenation();

    // const tour = await Features.query.explain();
    const tour = await Features.query;

    res
      .status(200)
      .json({ status: "Success", results: tour.length, data: tour });
  });
