import express from 'express';
import {
  getAllmessages,
  sendMessage,
} from '../controlers/messageController.js';
import { isadminAuthenticated } from '../middelware/auth.js';

export const messageRouter = express.Router();
messageRouter.post('/send', sendMessage);
messageRouter.get('/getallmessages', isadminAuthenticated, getAllmessages);
