import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Check the Authorization header
    const authHeader = req.headers.get('Authorization');

    let userRole = 'user'; // Default role is 'user'

    // Simulating authentication by checking the token.
    if (authHeader === 'Bearer admin-token') {
      userRole = 'admin'; // If the token matches, assume the user is admin
    }

    // Return the user role
    return NextResponse.json({ role: userRole }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to authenticate', error }, { status: 500 });
  }
}
