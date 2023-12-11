const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mong0Sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalError = require("./controller/ErrorController");

const tourRouter = require("./routes/tourRouters");
const userRouter = require("./routes/userRouters");
const reviewRouter = require("./routes/reviewRouter");
const bookingRouter = require("./routes/bookingRouter");
const viewsRouter = require("./routes/viewsRouter");

const App = express();

App.set("view engine", "pug");
App.set("views", path.join(__dirname, "views"));

App.use(express.static(path.join(__dirname, "public")));
App.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "data:", "blob:"],

      baseUri: ["'self'"],

      fontSrc: ["'self'", "https:", "data:"],

      scriptSrc: ["'self'", "https://*.cloudflare.com"],

      scriptSrc: ["'self'", "https://*.stripe.com"],

      scriptSrc: ["'self'", "http:", "https://*.mapbox.com", "data:"],

      frameSrc: ["'self'", "https://*.stripe.com"],

      objectSrc: ["'none'"],

      styleSrc: ["'self'", "https:", "unsafe-inline"],

      workerSrc: ["'self'", "data:", "blob:"],

      childSrc: ["'self'", "blob:"],

      imgSrc: ["'self'", "data:", "blob:"],

      connectSrc: ["'self'", "blob:", "https://*.mapbox.com"],

      upgradeInsecureRequests: [],
    },
  })
);

if (process.env.NODE_ENV === "development") {
  // App.use(morgan("tiny"));
}
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: "Too many request in this IP. After try again in a hour",
});

App.use("/api", limiter);

App.use(express.json({ limit: "10kb" }));
App.use(express.urlencoded({ extended: true, limit: "10kb" }));
App.use(cookieParser());

App.use(mong0Sanitize());

App.use(xss());

App.use(
  hpp({
    whitelist: [
      "duration",
      "maxGroupSize",
      "difficulty",
      "ratingsAverage",
      "ratingsQuantity",
      "price",
    ],
  })
);

// middle ware function
App.use((req, res, next) => {
  req.requsetTime = new Date().toISOString();
  next();
});
//=================================================================================================>

App.use("/", viewsRouter);
App.use("/api/v1/tours", tourRouter);
App.use("/api/v1/user", userRouter);
App.use("/api/v1/review", reviewRouter);
App.use("/api/v1/booking", bookingRouter);

App.all("*", (req, res, next) => {
  next(new AppError("Cannot find your URL in the server...!"));
});

App.use(globalError);

module.exports = App;
