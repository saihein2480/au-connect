import jwt from 'jsonwebtoken';

export async function verifyToken(req) {
  // Use req.headers.get() for header retrieval in Next.js
  const authHeader = req.headers.get('authorization'); 
  
  // Check if the Authorization header is present and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { status: 400, message: 'Authorization header is missing or malformed' };
  }

  const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { status: 200, userData: decoded }; // Return user data (like userId, role, etc.)
  } catch (err) {
    return { status: 401, message: 'Failed to authenticate token: ' + err.message };
  }
}
