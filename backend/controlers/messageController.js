import { catchAsyncErrors } from '../middelware/catchAsyncErrors.js';
import { ErrorHandler } from '../middelware/errorsMiddleware.js';
import { Message } from '../models/messageSchema.js';

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  console.log('helloo post man hitting');
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler('Please Fill Form !', 400));
  }

  try {
    await Message.create({ firstName, lastName, email, phone, message });
    return res.status(200).json({
      success: true,
      message: 'message send successfully',
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});
