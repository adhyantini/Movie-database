import express, { Request, Response, NextFunction } from "express";
import { INVALID_METHOD_ERROR_MESSAGE, GET } from "../constants";

/**
 * Middleware function to restrict HTTP methods to only allow GET requests.
 * If the request method is not GET, responds with a 405 status and an error message.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The next middleware function in the Express stack.
 */
export const onlyAllowGet: express.RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
     // Check if the method is not GET
  if (req.method !== GET) {
    res.status(405).json({ message: INVALID_METHOD_ERROR_MESSAGE });
    return;
  }
  next();
};
