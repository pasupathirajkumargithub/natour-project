const Review = require('./../Modal/reviewModal');
const Factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.setTourUserIDs = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = Factory.getAll(Review);
exports.getOneReview = Factory.getOne(Review);
exports.createReview = Factory.createOne(Review);
exports.updateReview = Factory.updateOne(Review);
exports.deleteReview = Factory.deleteOne(Review);
