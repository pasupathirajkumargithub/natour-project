const Tour = require("../Modal/tourmodal");
const User = require("../Modal/usermodel");
const Bookings = require("../Modal/bookingModal");
const AppError = require("../utils/appError");
const Booking = require("../Modal/bookingModal");
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render("overview", { title: "All Tours", tours });
});

exports.getOneTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.tourSlug }).populate({
    path: "reviews",
    feilds: "review rating user",
  });
  if (!tour) {
    return next(new AppError("There is no tour with that name", 404));
  }
  res
    .status(200)
    .set(
      "Content-Security-Policy",
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render("tour", {
      title: `${tour.name}`,
      tour,
    });
});
// res.status(200).render('tour', { title: `${tour.name} Tour`, tour });
// });

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render("login", { title: "Login" });
});

exports.getSignupForm = catchAsync(async (req, res) => {
  res.status(200).render("signup", { title: "sign in" });
});

exports.getAccount = (req, res) => {
  res.status(200).render("account", { title: "Your Account" });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  const booking = await Booking.find({ user: req.user.id });
  const tourIDs = booking.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  console.log(tours);
  if (!tours) return next();

  res.status(200).render("overview", { title: "My bookings", tours });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      mail: req.body.mail,
    },
    { new: true, runValidator: true }
  );
  res
    .status(200)
    .render("account", { title: "Your Account", user: updateUser });
});
