import { catchAsyncErrors } from '../middelware/catchAsyncErrors.js';
import { ErrorHandler } from '../middelware/errorsMiddleware.js';
import { User } from '../models/useSchema.js';
import { jwtTokengenerator } from '../utils/jwtTokengenerator.js';

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
  //   return res.status(200).json({
  //     success: true,
  //     message: 'User created successfully',
  //   });
  jwtTokengenerator(uniquePatient, 'patient logged In successfully', 200, res);
});

// login user
export const login = catchAsyncErrors(async (req, res, next) => {
  // take user data
  const { email, password, confirmPassword, role } = req.body;

  if (!email || !password || !confirmPassword) {
    return next(new ErrorHandler('Please Enter Details!'));
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler('Password & Confirm Password Must Be Match!'));
  }
  // user user exist or not

  const isuserExist = await User.findOne({ email }).select('+password');
  if (!isuserExist) {
    return next(new ErrorHandler('User not found', 400));
  }
  const isPasswordMatch = await isuserExist.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler('Invalid Password or Email', 400));
  }
  if (role !== isuserExist.role) {
    return next(new ErrorHandler('User with this role is not found!', 400));
  }

  //   return res.status(200).json({
  //     success: true,
  //     message: 'User Logged In successfully!',
  //   });
  jwtTokengenerator(isuserExist, 'patient Loggen In successfully', 200, res);
});
