import { Request, Response, NextFunction } from "express";

import ErrorResponse from "./interfaces/ErrorResponse";
import RequestValidators from "./interfaces/RequestValidators";
import { ZodError } from "zod";

export function validateRequest(validators: RequestValidators) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params);
      }

      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }

      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query);
      }
      next();
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(422);
      }
      next(error);
    }
  };
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
