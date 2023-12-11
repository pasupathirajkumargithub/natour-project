const express = require('express');
const reviewController = require('./../controller/reviewController');
const authControll = require('./../controller/authControll');

const router = express.Router({ mergeParams: true });

router.use(authControll.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authControll.ristricTo('user'),
    reviewController.setTourUserIDs,
    reviewController.createReview,
  );
router
  .route('/:id')
  .get(reviewController.getOneReview)
  .patch(authControll.ristricTo('user'), reviewController.updateReview)
  .delete(
    authControll.protect,
    authControll.ristricTo('admin', 'user'),
    reviewController.deleteReview,
  );
module.exports = router;
