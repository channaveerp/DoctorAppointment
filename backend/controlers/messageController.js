import { catchAsyncErrors } from '../middelware/catchAsyncErrors.js';
import { ErrorHandler } from '../middelware/errorsMiddleware.js';
import { Message } from '../models/messageSchema.js';

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  console.log('helloo post man hitting');
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler('Please Fill Form !', 400));
  }
  // const uniqueEmail = await Message.findOne({ email });
  // if (uniqueEmail) {
  //   return next(new ErrorHandler('Email is Already exists!', 400));
  // }

  await Message.create({ firstName, lastName, email, phone, message });

  return res.status(200).json({
    success: true,
    message: 'message send successfully',
  });
});
