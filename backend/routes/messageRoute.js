import express from 'express';
import { sendMessage } from '../controlers/messageController.js';

export const messageRouter = express.Router();

messageRouter.post('/send', sendMessage);
