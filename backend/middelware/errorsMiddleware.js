export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// export const errorMiddleware = (err, req, res, next) => {
//   if ((err.message = err.message || 'Internale server Error')) {
//     err.statusCode = err.statusCode || 5000;
//   }

//   if (err.statusCode === 11000) {
//     const message = `Duplicate ${Object.keys(err.keyValues)} Entered`;
//     err = new ErrorHandler(message, 400);
//   }
//   if (err.name === 'JsonWebTokenError') {
//     const message = 'Json web token Invalid try again!';
//     err = new ErrorHandler(message, 400);
//   }
//   if (err.name === 'TokenExpiredError') {
//     const message = 'Json web Token expired try again!';
//     err = new ErrorHandler(message, 400);
//   }
//   //    when type is different from defined type
//   if (err.name === 'CastError') {
//     const message = `Invalid ${err.path}`;
//     err = new ErrorHandler(message, 400);
//   }
//   return res.status(err.statusCode).json({
//     success: false,
//     message: err.message,
//   });
// };

export const errorMiddleware = (err, req, res, next) => {
  if (!err.message) {
    err.message = 'Internal Server Error';
  }

  if (!err.statusCode) {
    err.statusCode = 500;
  }

  if (err.statusCode === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValues)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === 'JsonWebTokenError') {
    const message = 'Json web token Invalid try again!';
    err = new ErrorHandler(message, 400);
  }
  if (err.name === 'TokenExpiredError') {
    const message = 'Json web Token expired try again!';
    err = new ErrorHandler(message, 400);
  }
  //    when type is different from defined type
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(' ')
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};
