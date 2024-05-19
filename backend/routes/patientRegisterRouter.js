import express from 'express';
import { patientContorller } from '../controlers/userController.js';

export const patientRouter = express.Router();
patientRouter.post('/patient/register', patientContorller);
