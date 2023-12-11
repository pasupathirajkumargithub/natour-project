const express = require("express");
const bookingController = require("./../controller/bookingController");
const authControll = require("./../controller/authControll");
const {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controller/bookingController");
const router = express.Router();

router.use(authControll.protect);
router.get("/checkout-session/:tourID", bookingController.getCheckoutSession);

router.use(authControll.ristricTo("admin", "lead-guide"));
router.route("/").get(getAllBookings).post(createBooking);
router.route("/:id").get(getBooking).patch(updateBooking).delete(deleteBooking);
module.exports = router;
