// src/app/models/Contact.js

import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: String,
  faculty: String,
  role: String,
  department: String,
  email: String,
  phone: String,
  facebook: String,
  line: String,
  gender: String,
  profilePicture: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // Keep as ObjectId
    required: true,
    ref: 'User', // Reference the User model (or admin model if separate)
  },
});



const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

export default Contact;
