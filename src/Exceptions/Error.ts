/*
 class Error {
    public message: string
    public status: string
    public code: number
    public description: string

    constructor(message: any) {
        this.message=message

    }
}
*/

class CustomError extends Error {

    constructor(message) {
        super(message);
        this.message=message
    }
}

export class ValidationError extends CustomError {
    public statusCode: number

    constructor(message: string | object) {
        super(message)
        //this.statusCode = 400
    }
}
export class DuplicateDeviceError extends CustomError {
    public statusCode: number

    constructor(message: string) {
        super(message)
        //this.statusCode = 400
    }
}

export class UnauthorizedError extends CustomError {
    public statusCode: number

    constructor(message: string) {
        super(message)
        //this.statusCode=401
    }
}

export class ResourceNotFoundError extends CustomError {
    public statusCode: number

    constructor(message: any) {
        super(message)
        //this.statusCode=404
    }
}


export class RequestEntityTooLargeError extends CustomError {
    public statusCode: number

    constructor(message: any) {
        super(message)
        //this.statusCode=413
    }
}

export class ServerError extends CustomError {
    public statusCode: number

    constructor(message: any) {
        super(message)
        //this.statusCode=500
    }
}

export class InternalServerError extends CustomError {
    public statusCode: number

    constructor(message: any) {
        super(message)
        //this.statusCode=500
    }
}
export class GatewayTimeoutError extends CustomError {
    public statusCode: number

    constructor(message: any) {
        super(message)
        //this.statusCode=504
    }
}
export class SubscriptionExpiredError extends CustomError {
    public statusCode: number
    constructor(message: any) {
        super(message)
    }
}
export class AssetDeviceNotExist extends CustomError {
    public statusCode: number
    constructor(message: any) {
        super(message)
    }
}
export class TDMGAPIBadRequest extends CustomError {
    public statusCode: number

    constructor(message: string) {
        super(message)
    }
}

export class APIBadRequest extends CustomError {
    public statusCode: number

    constructor(message: string) {
        super(message)
        //this.statusCode = 400
    }

}

export class DuplicateAssetDeviceMapping extends CustomError {
    public statusCode: number
    constructor(message: string) {
        super(message)
    }
}

export class DeviceNotDispatched extends CustomError {
    public statusCode: number
    constructor(message: string) {
        super(message)
    }
}

export class AssetDeviceMappingExist extends CustomError {
    public statusCode: number
    constructor(message: string) {
        super(message)
    }
}
export class AssetDeviceORSubscriptionNotFound extends CustomError {
    public statusCode: number

    constructor(message: string) {
        super(message)
    }
}
