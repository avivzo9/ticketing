import { CustomError } from "./customError";

export class BadReqError extends CustomError {
    statusCode = 400;

    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, BadReqError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    };
}