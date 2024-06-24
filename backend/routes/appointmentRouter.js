import express from 'express';
import {
  deleteAppointment,
  getAllAppointments,
  postappointment,
  updateAppointment,
} from '../controlers/appointmentController.js';
import {
  isPatientAuthenticated,
  isadminAuthenticated,
} from '../middelware/auth.js';

export const appointmentRouter = express.Router();
appointmentRouter.post('/post', isPatientAuthenticated, postappointment);

appointmentRouter.get('/getAll', isadminAuthenticated, getAllAppointments);
appointmentRouter.put('/update/:id', isadminAuthenticated, updateAppointment);
appointmentRouter.delete(
  '/delete/:id',
  isadminAuthenticated,
  deleteAppointment
);
