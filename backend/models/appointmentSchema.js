import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

const appointmentSchema = new Schema({
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
    minLength: [12, 'NIC Number must be contain minimum 12 digits'],
    maxLength: [12, 'NIC Number must be contain minimum 12 digits'],
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
  appointment_date: {
    type: String,
    required: true,
  },
  doctor: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  hasVisited: {
    type: Boolean,
    default: false,
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);
