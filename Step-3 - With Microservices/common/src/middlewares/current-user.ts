import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.session = {};
  req.session.jwt =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NmQ0MjJkNmJlYTQzYzA1YzAxOTVlNSIsImVtYWlsIjoieWFzaHNtMDFAZ21haWwuY29tIiwiaWF0IjoxNzM1MjE1ODU2fQ.49eybsEC6jj3iRtVNq6Kv5OT1jtDRp9-wYslZ43bpGU";
  if (!req.session.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
};
