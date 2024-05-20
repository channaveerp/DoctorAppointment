import { User } from '../models/userSchema.js';
import { catchAsyncErrors } from './catchAsyncErrors.js';
import { ErrorHandler } from './errorsMiddleware.js';
import jwt from 'jsonwebtoken';

// to verify admin
export const isadminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // get token which saved
  const token = req.cookies.adminToken;
  if (!token) {
    return next(new ErrorHandler('Admin Not Authenticated!', 400));
  }

  //   if token availbale veryfy it

  const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decodeToken.id);

  if (req.user.role !== 'Admin') {
    return next(
      new ErrorHandler(
        `${req.user.role} is not autherizes for this resources`,
        403
      )
    );
  }
  next();
});

// export const isPatientAuthenticated = catchAsyncErrors(
//   async (req, res, next) => {
//     // get token which saved
//     const token = req.cookies.patientToken;
//     if (!token) {
//       return next(new ErrorHandler('Patient Not Authenticated!', 403));
//     }
//     //   if token availbale veryfy it
//     const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     req.user = await User.findById(decodeToken.id);

//     if (req.user.role !== 'Patient') {
//       return next(
//         new ErrorHandler(
//           `${req.user.role} is not autherizes for this resources`,
//           403
//         )
//       );
//     }
//     next();
//   }
// );
