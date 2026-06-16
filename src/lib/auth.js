import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function verifyAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'tapizcenter-super-secret-key-12345'
    );

    if (decoded && decoded.role === 'admin') {
      return decoded;
    }
    return null;
  } catch (error) {
    return null;
  }
}
