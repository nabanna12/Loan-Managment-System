import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';

export interface AuthRequest extends Request {
  user?: { _id: string; email: string; role: UserRole; name: string; };
}
interface JWTPayload { id: string; email: string; role: UserRole; name: string; }

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Access denied. No token provided.' }); return;
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    const user = await User.findById(decoded.id).select('-password');
    if (!user) { res.status(401).json({ success: false, message: 'Token invalid. User not found.' }); return; }
    req.user = { _id: user._id.toString(), email: user.email, role: user.role, name: user.name };
    next();
  } catch { res.status(401).json({ success: false, message: 'Token invalid or expired.' }); }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) { res.status(401).json({ success: false, message: 'Not authenticated.' }); return; }
    if (req.user.role === 'admin') { next(); return; }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: `Access forbidden. Role '${req.user.role}' is not authorized.` }); return;
    }
    next();
  };
};
