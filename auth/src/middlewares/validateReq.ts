import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ReqValidationError } from "../errors/reqValidationError";

export const validateReq = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) throw new ReqValidationError(errors.array());

    next();
};