import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { dbconnection } from './database/dbconnections.js';
import { config } from 'dotenv';
import { messageRouter } from './routes/messageRoute.js';
import { errorMiddleware } from './middelware/errorsMiddleware.js';
import { router } from './routes/usersRouter.js';
import { appointmentRouter } from './routes/appointmentRouter.js';

config();

export const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: [process.env.ADMIN_URL, process.env.FRONT_END_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    Credential: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/temp/',
  })
);
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/user', router);
app.use('/api/v1/appointment', appointmentRouter);

dbconnection();
app.use(errorMiddleware);
