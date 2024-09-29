// src/app/models/Announcement.js
import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String }, // Optional field
}, { timestamps: true });

export default mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
