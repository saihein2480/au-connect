// src/app/api/auth/login/route.js
import dbConnect from "@/app/utils/dbConnect";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Import JWT library

export async function POST(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const { username, password } = await req.json();

    // Find the user by username
    const user = await User.findOne({ username });

    // If user exists and password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate a JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET // Use your secret key from environment variables
      );

      // Return success response with JWT token
      return new Response(
        JSON.stringify({
          success: true,
          message: "Login successful",
          token, // Send the JWT token to the client
          role: user.role,
          userId: user._id,
        }),
        { status: 200 }
      );
    } else {
      // Return invalid credentials error
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid credentials",
        }),
        { status: 401 }
      );
    }
  } catch (error) {
    // Handle any errors that occur during login process
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred during login",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
