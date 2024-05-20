import express from 'express';
import {
  AddAdmin,
  login,
  patientContorller,
} from '../controlers/userController.js';
import { isadminAuthenticated } from '../middelware/auth.js';

export const patientRouter = express.Router();
patientRouter.post('/patient/register', patientContorller);
patientRouter.post('/patient/login', login);
patientRouter.post('/admin/register', isadminAuthenticated, AddAdmin);
