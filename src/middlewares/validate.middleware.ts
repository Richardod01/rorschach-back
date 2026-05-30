import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validateSchema = (schema: ZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Error de validación de datos",
          errors: error.issues.map((err: any) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      } else {
        next(error);
      }
    }
  };
};
