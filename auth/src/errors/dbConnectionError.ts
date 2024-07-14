import { CustomError } from "./customError";

export class DbConnectionError extends CustomError {
    statusCode = 500;
    reason = 'Error connecting to database';

    constructor() {
        super('Error connecting to DB');

        Object.setPrototypeOf(this, DbConnectionError.prototype);
    }

    serializeErrors() {
        return [
            { message: this.reason }
        ];
    }
}