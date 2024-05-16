import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

const messageSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [1, 'Firstname must be contain minimum 3 length'],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [1, 'Laststname must be contain minimum 3 length'],
  },
  email: {
    type: String,
    required: true,
    validator: [validator.isEmail, 'Please enter a valid email!'],
  },
  phone: {
    type: String,
    required: true,
    minLength: [10, 'Phone Number must be contain minimum 10 digits'],
    maxLength: [10, 'Phone Number must be contain minimum 10 digits'],
  },
  message: {
    type: Number,
    required: true,
    minLength: [10, 'Message must be contain minimum 10 characters'],
  },
});

// creating model
export const Message = mongoose.model('Message', messageSchema);
