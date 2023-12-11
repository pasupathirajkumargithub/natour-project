const AppError = require('./../utils/appError');

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
}

function handleDupilicateDB(err) {
  // const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const value = Object.values(err.keyValue)[0];
  const message = `Dupilicate value field : ${value}. Please use another value. `;
  return new AppError(message, 400);
}

function handleValidationDB(err) {
  const value = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data :${value.join('. ')}`;
  return new AppError(message, 400);
}

function handleJsonWwebTokenDB(err) {
  return new AppError('Invalid log in Token..!', 401);
}

function handleJTokenExpired(err) {
  return new AppError('Expired log in Token..!', 401);
}

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      Error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res
      .status(err.statusCode)
      .render('error', { title: 'something went wrong..!', msg: err.message });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res
        .status(err.statusCode)
        .json({ status: err.status, message: err.message });
    }
    return res
      .status(500)
      .json({ status: 'error', message: 'something went wrong..!' });
  }
  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .render('error', { title: 'something went wrong..!', msg: err.message });
  }

  return res.status(err.statusCode).render('error', {
    title: 'something went wrong..!',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };

    if (err.code === 11000) err = handleDupilicateDB(err);
    else if (err.name === 'CastError') err = handleCastErrorDB(err);
    else if (err.name === 'ValidationError') err = handleValidationDB(err);
    else if (err.name === 'JsonWebTokenError') err = handleJsonWwebTokenDB(err);
    else if (err.name === 'TokenExpiredError') err = handleJTokenExpired(err);

    sendErrorProd(err, req, res);
  }
};
