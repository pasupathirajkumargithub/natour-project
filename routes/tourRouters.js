const express = require("express");
const authControll = require("./../controller/authControll");
const reviewController = require("./../controller/reviewController");
const reviewRouter = require("../routes/reviewRouter");
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTour,
  getTourStat,
  getMonthlyPlan,
  getTourWithin,
  getDistance,
  uploadTourImage,
  resizeTourImage,
} = require("../controller/tourController");

//======================================================================================================>

// Define routes for the '/api/v1/tours' path
const router = express.Router();
router.use("/:tourId/review", reviewRouter);

router
  .route("/tour-within/:distance/center/:latlng/unit/:unit")
  .get(getTourWithin);
router.route("/distance/:latlng/unit/:unit").get(getDistance);
router
  .route("/")
  .get(getAllTours)
  .post(
    authControll.protect,
    authControll.ristricTo("admin", "Lead-guid"),
    createTour
  );

router.route("/getStat").get(getTourStat);

router
  .route("/get-monthly-plan/:year")
  .get(
    authControll.protect,
    authControll.ristricTo("admin", "lead-guid", "guide"),
    getMonthlyPlan
  );

router.route("/top5tours").get(aliasTopTour, getAllTours);

router
  .route("/:id")
  .get(getTour)
  .patch(
    authControll.protect,
    authControll.ristricTo("admin", "lead-guid"),
    uploadTourImage,
    resizeTourImage,
    updateTour
  )
  .delete(
    authControll.protect,
    authControll.ristricTo("admin", "Lead-guid"),
    deleteTour
  );
module.exports = router;
