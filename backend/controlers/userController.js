import { catchAsyncErrors } from '../middelware/catchAsyncErrors.js';
import { ErrorHandler } from '../middelware/errorsMiddleware.js';
import { User } from '../models/userSchema.js';
import { jwtTokengenerator } from '../utils/jwtTokengenerator.js';
// import cloudinaryres from 'cloudinary';

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    return next(new ErrorHandler('Doctor avatar is required', 400));
  }

  const { docAvatar } = req.files;
  const allowedFormats = ['image/png', 'image/jpeg', 'image/webp'];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler('File format not supported', 400));
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
    !doctorDepartment
  ) {
    return next(new ErrorHandler('Please provide all required fields', 400));
  }

  const isDoctorRegistered = await User.findOne({ email });
  if (isDoctorRegistered) {
    return next(
      new ErrorHandler(
        `${isDoctorRegistered.role} already registered with this email`,
        400
      )
    );
  }

  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(
      docAvatar.tempFilePath
    ); // Ensure docAvatar has the correct path
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        cloudinaryResponse.error || 'Error uploading to Cloudinary'
      );
      return next(new ErrorHandler('Error uploading to Cloudinary', 500));
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
      doctorDepartment,
      docAvatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: 'New doctor was added successfully',
      doctor,
    });
  } catch (error) {
    return next(new ErrorHandler('Error uploading to Cloudinary', 500));
  }
});
