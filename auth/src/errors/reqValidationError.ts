import { ValidationError } from "express-validator";
import { CustomError } from "./customError";

export class ReqValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters');

        // extending a built in class
        Object.setPrototypeOf(this, ReqValidationError.prototype);
    }

    serializeErrors() {
        const formattedErrors = this.errors.map(e => {
            if (e.type === 'field') return { message: e.msg, field: e.path };

            return null;
        });

        return formattedErrors?.filter(x => !!x) || [{ message: 'ReqValidationError unknown error' }];
    }
}