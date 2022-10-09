import {CustomError} from "./CustomError"

export class InternalServerError extends CustomError {
    public statusCode: number

    constructor(message: any) {
        super(message)
        // this.statusCode=500
    }
}
