import express from 'express';
import { login, patientContorller } from '../controlers/userController.js';

export const patientRouter = express.Router();
patientRouter.post('/patient/register', patientContorller);
patientRouter.post('/patient/login', login);
