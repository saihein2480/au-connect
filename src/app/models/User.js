// src/app/models/User.js

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  displayName: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  faculty: { type: String },
  gender: { type: String },
  studentId: { type: String, default: null },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
