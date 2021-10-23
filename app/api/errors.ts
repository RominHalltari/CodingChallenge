/* tslint:disable:max-classes-per-file */

/* Error codes */

export const API_ERROR = "api.API_ERROR";
export const API_REQUEST_ERROR = "api.API_REQUEST_ERROR";
export const BAD_REQUEST = "api.BAD_REQUEST";
export const CONNECTION_ERROR = "api.CONNECTION_ERROR";
export const DECODE_ERROR = "api.DECODE_ERROR";
export const INVALID_RESPONSE = "api.INVALID_RESPONSE";
export const NOT_FOUND = "api.NOT_FOUND";
export const PERMISSION_DENIED = "api.PERMISSION_DENIED";
export const UNAUTHORIZED = "api.UNAUTHORIZED";
export const UNKNOWN_ERROR = "api.UNKNOWN_ERROR";

/* Error classes */

export class ApiError {
    // We cannot extend Error because that will break the prototype chain
    // E.g. `new ApiError() instanceof ApiError` will be false.

    public readonly message: string;
    public readonly code: string = API_ERROR;
    public readonly error: Error;

    constructor(message: string = "Generic API error") {
        this.message = message;
        this.error = new Error(message);
        return this;
    }

    public toString() {
        return this.message;
    }

    public getError() {
        return this.error;
    }
}

//
// Response error
//

export class InvalidResponse extends ApiError {
    public readonly code = INVALID_RESPONSE;
    public readonly data: object;

    constructor(
        data: object,
        message: string = "The response object contains errors.",
    ) {
        super(message);
        this.data = data;
    }

    public toString() {
        return (
            `Invalid response:\n`
            + JSON.stringify(this.data, undefined, 2)
        );
    }
}

//
// Request errors
//

export class ApiRequestError extends ApiError {
    public readonly url: string;

    public readonly code: string = API_REQUEST_ERROR;

    constructor(
        url: string,
        message: string = "generic ApiRequestError",
    ) {
        super(message);
        this.url = url;
    }

    public toString() {
        return `Error when connecting to ${this.url}: ${super.toString()}`;
    }

}

export class ConnectionError extends ApiRequestError {
    public readonly code = CONNECTION_ERROR;
    public readonly message = "Failed to establish a new connection.";
}

export class UnknownError extends ApiRequestError {
    public readonly code = UNKNOWN_ERROR;
    public readonly message = "An unknown error occurred.";
}

export class DecodeError extends ApiRequestError {
    public readonly code = DECODE_ERROR;
    public readonly message = "Failed to parse response.";
}

export class BadRequest extends ApiRequestError {
    public readonly code = BAD_REQUEST;
    public readonly data: object | null;

    constructor(
        url: string,
        data: object | null = null,
        message: string = "Bad request",
    ) {
        super(url, message);
        this.data = data;
    }

    public toString() {
        return (
            `Bad request error when connecting to ${this.url}:\n`
            + JSON.stringify(this.data, undefined, 2)
        );
    }

}

export class Unauthorized extends ApiRequestError {
    public readonly code = UNAUTHORIZED;
    public readonly message = "Incorrect credentials.";
}

export class PermissionDenied extends ApiRequestError {
    public readonly code = PERMISSION_DENIED;
    public readonly message = "Permission denied.";
}

export class NotFound extends ApiRequestError {
    public readonly code = NOT_FOUND;
    public readonly message = "The requested object was not found.";
}

