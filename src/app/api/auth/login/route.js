import dbConnect from "@/app/utils/dbConnect";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

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
      // Return success response with user details (without sensitive data)
      return new Response(
        JSON.stringify({
          success: true,
          message: "Login successful",
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
