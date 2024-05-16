import { Message } from '../models/messageSchema.js';

export const sendMessage = async (req, res) => {
  const { firstName, lastName, email, phone, message } = req;

  if (!firstName || !lastName || !email || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please Fill Form Fields ',
    });
  }
  await Message.create(firstName, lastName, email, phone, message);
  return res.status(200).json({
    success: true,
    message: 'Form Fields successfully',
  });
};
