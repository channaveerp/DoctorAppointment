import express from 'express';
import {
  AddAdmin,
  adminlogout,
  getAlldoctors,
  getusersDetails,
  login,
  patientContorller,
  patientLogout,
} from '../controlers/userController.js';
import {
  isPatientAuthenticated,
  isadminAuthenticated,
} from '../middelware/auth.js';

export const router = express.Router();
router.post('/register', patientContorller);
router.post('/login', login);
router.post('/admin/register', isadminAuthenticated, AddAdmin);
router.get('/doctors', getAlldoctors);
router.get('/admin/me', isadminAuthenticated, getusersDetails);
router.get('/patient/me', isPatientAuthenticated, getusersDetails);
router.get('/admin/logout', isadminAuthenticated, adminlogout);
router.get('/patient/logout', isPatientAuthenticated, patientLogout);
