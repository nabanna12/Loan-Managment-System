import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

export const generateToken = (id: string, email: string, role: UserRole, name: string): string => {
  return jwt.sign({ id, email, role, name }, process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions);
};
