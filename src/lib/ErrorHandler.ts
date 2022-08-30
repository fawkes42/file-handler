import { NextFunction, Request, Response } from 'express';
import { BaseError } from './BaseError';

type ErrorWithMessage = {
    message: string;
};

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    );
};

const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
    if (isErrorWithMessage(maybeError)) return maybeError;

    try {
        return new Error(JSON.stringify(maybeError));
    } catch {
        // fallback in case there's an error stringifying the maybeError
        // like with circular references for example.
        return new Error(String(maybeError));
    }
};

export const getErrorMessage = (error: unknown): string => {
    const { message } = toErrorWithMessage(error);
    return message;
};

export const returnError = (
    error: BaseError,
    _: Request,
    response: Response,
    __: NextFunction,
): any => {
    let err = error;
    if (!(err instanceof BaseError)) {
        err = new BaseError(
            'InternalServerError',
            'An unexpected error occurred.',
            500,
        );
    }
    response.status(err.statusCode || 500).json({
        message: error.message,
    });
};
