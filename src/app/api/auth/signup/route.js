// src/app/api/auth/signup/route.js

import dbConnect from "@/app/utils/dbConnect";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

// Load environment variables
const { CREATE_ADMIN_VERIFY } = process.env;

export async function POST(req) {
  await dbConnect();

  try {
    const { username, email, password, displayName, faculty, gender, studentId, role, verifyCode } = await req.json();

    // Check if the required fields are provided for both user and admin
    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({ message: "Please fill all the required fields." }),
        { status: 400 }
      );
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "Username or Email already exists." }),
        { status: 400 }
      );
    }

    // For admin registration, verify the code
    if (role === "admin") {
      if (!verifyCode || verifyCode !== CREATE_ADMIN_VERIFY) {
        return new Response(
          JSON.stringify({ message: "Invalid verification code for admin account." }),
          { status: 403 }
        );
      }
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user or admin
    const newUser = new User({
      username,
      email, // Email is always required for both user and admin
      password: hashedPassword,
      displayName,
      faculty,
      gender,
      studentId: studentId || null,
      role: role === "admin" ? "admin" : "user", // Assign the correct role
    });

    await newUser.save();

    return new Response(
      JSON.stringify({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully.` }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(JSON.stringify({ message: "Server error." }), {
      status: 500,
    });
  }
}
