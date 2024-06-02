import { catchAsyncErrors } from '../middelware/catchAsyncErrors.js';
import { ErrorHandler } from '../middelware/errorsMiddleware.js';
import { User } from '../models/userSchema.js';
import { jwtTokengenerator } from '../utils/jwtTokengenerator.js';
import cloudinaryres from 'cloudinary';

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
    return next(new ErrorHandler('Please Fill all data', 400));
  }

  // Check if user already exists with the provided email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler('User already exists', 400));
  }

  const newUser = await User.create({
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

  // Check if user was created successfully
  if (!newUser) {
    return next(new ErrorHandler('Failed to create user', 500));
  }

  jwtTokengenerator(newUser, 'patient Registered In successfully', 200, res);
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

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorHandler('User not found', 400));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler('Invalid Password or Email', 400));
  }
  if (role !== user.role) {
    return next(new ErrorHandler('User with this role is not found!', 400));
  }

  jwtTokengenerator(user, 'User Logged In successfully!', 200, res);
});

export const AddAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, phone, email, nic, gender, dob, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !phone ||
    !email ||
    !nic ||
    !gender ||
    !dob ||
    !password
  ) {
    return next(new ErrorHandler('Please Fill all data', 400));
  }
  const isAlreadyRegistered = await User.findOne({ email });
  if (isAlreadyRegistered) {
    return next(
      new ErrorHandler(
        `${isAlreadyRegistered.role} with this email Already Exist!`,
        400
      )
    );
  }
  const admin = await User.create({
    firstName,
    lastName,
    phone,
    email,
    nic,
    gender,
    dob,
    password,
    role: 'Admin',
  });

  jwtTokengenerator(admin, 'Admin Registered  successfully', 200, res);
});

// getAll doctors
export const getAlldoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: 'Doctor' });
  if (doctors) {
    return res.status(200).json({
      success: true,
      doctors,
    });
  }
});

// get users details based on roe
export const getusersDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  if (user) {
    return res.status(200).json({
      success: true,
      user,
    });
  }
});
// adminlogout
export const adminlogout = catchAsyncErrors(async (req, res, next) => {
  return res
    .status(200)
    .cookie('adminToken', null, {
      httOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: 'admin logged out successfully ',
    });
});

export const patientLogout = catchAsyncErrors(async (req, res, next) => {
  return res
    .status(200)
    .cookie('patientToken', null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: 'patient logged out successfully ',
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  // profile picture
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler('doctor avatar require ', 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ['image/png', 'image/jpeg', 'image/webp'];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler('files formate not supported', 400));
  }

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
    doctorDepartment,
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
    !role ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler('Please provide required fields', 400));
  }
  const isDoctroRegistered = await User.findOne({ email });
  if (isDoctroRegistered) {
    return next(
      new ErrorHandler(
        `${isDoctroRegistered.role}  already registered with this email`,
        400
      )
    );
  }
  const cloudinaryResponse = await cloudinaryres.uploader.upload(docAvatar);
  console.log('cloudinaryResponse', cloudinaryResponse);
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    // return next(new ErrorHandler(`${cloudinaryResponse.erorr} || `, 400));
    console.error(cloudinaryResponse.error || 'Error uploading');
  }

  const doctor = await User.create({
    firstName,
    lastName,
    phone,
    email,
    nic,
    gender,
    dob,
    password,
    role: 'Doctor',
    doctorDepartment: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: 'New doctor was added successfully',
    doctor,
  });
});
