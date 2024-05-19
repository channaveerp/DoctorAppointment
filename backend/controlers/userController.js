import { catchAsyncErrors } from '../middelware/catchAsyncErrors.js';
import { ErrorHandler } from '../middelware/errorsMiddleware.js';
import { User } from '../models/useSchema.js';

export const patientContorller = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    phone,
    email,
    nic,
    gender,
    dob,
    password,
    role,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !phone ||
    !email ||
    !nic ||
    !gender ||
    !dob ||
    !password ||
    !role
  ) {
    return next(new ErrorHandler('Please Fill data', 400));
  }
  const uniquePatient = await User.findOne({ email });
  if (uniquePatient) {
    return next(new ErrorHandler('user already exists', 400));
  }

  const data = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    gender,
    dob,
    nic,
    phone,
  });
  console.log('PatientData', data);
  return res.status(200).json({
    success: true,
    message: 'User created successfully',
  });
});
