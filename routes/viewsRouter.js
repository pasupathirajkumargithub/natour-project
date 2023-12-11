const express = require("express");
const authControll = require("../controller/authControll");
const router = express.Router();
const viewControll = require("./../controller/viewControll");
const bookingControler = require("../controller/bookingController");

router.get(
  "/",
  bookingControler.createBookingCheckout,
  authControll.isLoggedIn,
  viewControll.getOverview
);
router.get("/tour/:tourSlug", authControll.isLoggedIn, viewControll.getOneTour);
router.get("/login", authControll.isLoggedIn, viewControll.getLoginForm);
router.get("/signup", viewControll.getSignupForm);
router.get("/me", authControll.protect, viewControll.getAccount);
router.get("/my-tours", authControll.protect, viewControll.getMyTours);
router.post(
  "/submit-user-data",
  authControll.protect,
  viewControll.updateUserData
);

module.exports = router;
