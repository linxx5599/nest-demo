import { Request, Response, NextFunction } from 'express';
export const befoerEachRoute = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next();
};
