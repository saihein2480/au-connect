// src/app/api/profile/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/app/utils/dbConnect';
import User from '@/app/models/User';
import bcrypt from 'bcrypt'; // To hash passwords

// GET: Fetch all users
export async function GET() {
  await dbConnect();
  
  try {
    const users = await User.find(); // Fetch all users
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Failed to fetch users', error }, { status: 500 });
  }
}

// POST: Add a new user
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json(); // Parse JSON data sent from the frontend
    const { displayName, username, email, password, faculty, gender, studentId, role } = body;

    // Validate required fields
    if (!username || !email || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      displayName,
      username,
      email,
      password: hashedPassword, // Save the hashed password
      faculty,
      gender,
      studentId,
      role,
    });

    await newUser.save(); // Save the user to the database

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Failed to create user', error }, { status: 500 });
  }
}
