const Tour = require("./../Modal/tourmodal");
const Booking = require("./../Modal/bookingModal");
const AppError = require("./../utils/appError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Factory = require("./handlerFactory");

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourID);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: tour.price * 100, // Amount in cents
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
    payment_method_types: ["card"],
    mode: "payment",

    success_url: `${req.protocol}://${req.get("host")}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.mail,
    client_reference_id: req.params.tourId,
  });

  res.status(200).json({ status: "success", session });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!user && !tour && !price) return next();
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split("?")[0]);

  next();
});

exports.getAllBookings = Factory.getAll(Booking);

exports.getBooking = Factory.getOne(Booking);

exports.createBooking = Factory.createOne(Booking);

exports.updateBooking = Factory.updateOne(Booking);

exports.deleteBooking = Factory.deleteOne(Booking);
