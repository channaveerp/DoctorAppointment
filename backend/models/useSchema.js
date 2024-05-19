import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [1, 'Firstname must be contain minimum 3 length'],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [1, 'Laststname must be contain minimum 3 length'],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please enter a valid email!',
    },
  },
  phone: {
    type: String,
    required: true,
    minLength: [10, 'Phone Number must be contain minimum 10 digits'],
    maxLength: [10, 'Phone Number must be contain minimum 10 digits'],
  },
  nic: {
    type: String,
    required: true,
    minLength: [12, 'NIC Number must be contain minimum 10 digits'],
    maxLength: [12, 'NIC Number must be contain minimum 10 digits'],
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female'],
  },
  dob: {
    type: String,
    required: [true, 'DOB is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [5, 'Password must be at least 5 characters!'],
    // maxLength: [10, 'Password must be at least'],
    select: false,
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Patient', 'Doctor'],
  },
  doctorDepartment: {
    type: String,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
});
// to hash user password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// to compare hash passwrds

userSchema.methods.comparePassword = async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password);
};

// jwt token creation method
userSchema.methods.generateJsonToken = async function () {
  return jwt.sign(
    ({ id: this._id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES,
    })
  );
};

// creating model
export const User = mongoose.model('users', userSchema);
