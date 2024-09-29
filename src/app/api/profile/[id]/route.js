// src/app/api/profile/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/app/utils/dbConnect';
import User from '@/app/models/User';
import bcrypt from 'bcrypt'; // To hash passwords

// GET: Fetch a specific user's profile
export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params; // Get user ID from dynamic route

  try {
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch user', error: error.message }, { status: 500 });
  }
}

// PUT: Edit a user's profile
export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = params; // Get user ID from dynamic route
  if (!id) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json(); // Since the frontend is sending JSON data

    const { displayName, username, email, password, faculty, gender, studentId, role } = body;

    // Validate required fields (username, email, and role should always be required)
    if (!username || !email || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Prepare update object
    const updateFields = {
      displayName,
      username,
      email,
      faculty,
      gender,
      studentId,
      role,
    };

    // If password is provided, hash it
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateFields.password = hashedPassword;
    }

    // Find the user and update
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation
    });

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Failed to update user', error: error.message }, { status: 500 });
  }
}


// DELETE: Delete a user's profile
export async function DELETE(req, { params }) {
  await dbConnect();

  const { id } = params; // Get user ID from dynamic route

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete user', error: error.message }, { status: 500 });
  }
}
