import express from 'express';

import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { dbconnection } from './database/dbconnections.js';
import { config } from 'dotenv';

config();

export const app = express();
dbconnection();

app.use(cookieParser);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/temp/',
  })
);
