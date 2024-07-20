import { CustomError } from "./customError";

export class NotAutherizedError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Not authorized');

        Object.setPrototypeOf(this, NotAutherizedError.prototype);
    }

    serializeErrors() {
        return [{ message: 'Not authorized' }];
    }
};