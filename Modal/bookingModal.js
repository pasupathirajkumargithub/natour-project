const mongoose = require("mongoose");

const bookingScheme = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "For booking Tour is required..!"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "For booking User is required..!"],
  },

  price: {
    type: Number,
    required: [true, "For booking Price is required..!"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  paid: { type: Boolean, default: true },
});

bookingScheme.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });
  next();
});

const Booking = mongoose.model("Booking", bookingScheme);

module.exports = Booking;
