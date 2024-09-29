// src/app/models/Contact.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  faculty: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String },
  email: { type: String },
  phone: { type: String },
  facebook: { type: String },
  line: { type: String },
  profilePicture: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Admin who created
});

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);
