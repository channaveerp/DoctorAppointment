import { catchAsyncErrors } from '../middelware/catchAsyncErrors.js';
import { ErrorHandler } from '../middelware/errorsMiddleware.js';
import { Appointment } from '../models/appointmentSchema.js';
import { User } from '../models/userSchema.js';

export const postappointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstname,
    doctor_lastname,
    hasVisited,
    address,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstname ||
    !doctor_lastname ||
    !address
  ) {
    return next(new ErrorHandler('Please fill all fields', 400));
  }

  const isConflict = await User.find({
    firstName: doctor_firstname,
    lastName: doctor_lastname,
    role: 'Doctor',
    doctorDepartment: department,
  });

  console.log('isConflict', isConflict);

  if (isConflict.length === 0) {
    return next(new ErrorHandler('Doctors not found !', 400));
  }
  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        'Doctors conflict please contatct though email or phone!',
        400
      )
    );
  }

  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;

  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstname,
      lastName: doctor_lastname,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });
  res.status(200).json({
    success: true,
    message: 'Appointment created successfully',
    appointment: appointment,
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointment = await Appointment.find();

  if (!appointment) {
    return next(new ErrorHandler('No appointment found', 400));
  } else {
    res.status(200).json({
      success: true,
      message: 'Appointment found successfully',
      appointment: appointment,
    });
  }
});

export const updateAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler('No appointment found', 404));
  }
  appointment = await Appointment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: 'Appointment updated successfully',
    appointment: appointment,
  });
});

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return next(new ErrorHandler('No appointment found', 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Appointment deleted successfully',
  });
});
