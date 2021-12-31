const AppError = require('../utils/appError');
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
}

const sendErrorForDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    })
  }

  console.error('ERROR ', err);

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message
  });

}

const sendErrorProd = (err,req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })
    }
    // Log error
    console.error('ERROR ', err);

    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });

  }
  // FOR RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message
    });
  }

  console.error('ERROR ', err);

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later'
  });
}

const handleDuplicateFieldsDB = (err, res) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another value!`

  return new AppError(message, 400);
}

const handleValidationErrorDB = (err, res) => {
  const errors = Object.values(err.errors).map(error => error.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid Token. Please login again!', 401);

const handleExpiredTokenError = () => new AppError('Your token is expired', 401);


module.exports = ((err,req,res,next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err,req,res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err, message: err.message};

    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error._message === 'Validation failed') error = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    if (error.name === 'TokenExpiredError') error = handleExpiredTokenError();

    sendErrorProd(error,req, res);
  }
})
