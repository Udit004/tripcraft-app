import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'this-is-a-tripcraft-default-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

console.log('JWT_SECRET loaded:', JWT_SECRET ? '✓ Set' : '✗ Not set (using default)');

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    console.log('Verifying token. Length:', token.length, 'First 50 chars:', token.substring(0, 50));
    console.log('Using JWT_SECRET:', JWT_SECRET ? 'Set' : 'Default');
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log('Token verified successfully:', decoded);
    return decoded;
  } catch (error: any) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
};

export const extractTokenFromHeader = (authHeader: string | null): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
