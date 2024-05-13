import mongoose from 'mongoose';

export const dbconnection = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then((res) => {
      console.log('db connection established successfully');
    })
    .catch((err) => {
      console.log('db connection error', err);
    });
};
