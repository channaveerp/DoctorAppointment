import express from 'express';

import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { dbconnection } from './database/dbconnections.js';
import { config } from 'dotenv';
import { messageRouter } from './routes/messageRoute.js';
import { errorMiddleware } from './middelware/errorsMiddleware.js';
import { patientRouter } from './routes/usersRouter.js';

config();

export const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/temp/',
  })
);
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/user', patientRouter);

dbconnection();
app.use(errorMiddleware);
