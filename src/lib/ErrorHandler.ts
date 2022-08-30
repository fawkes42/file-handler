import { NextFunction, Request, Response } from 'express';

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
    console.error('----------------------- ERRO -----------------------');
    console.log('Mensagem:');
    console.error(message);
    console.log('----------------------- FIM DO ERRO -----------------------');
    return message;
};

export class BaseError extends Error {
    public readonly statusCode: number;

    public readonly name: string;

    constructor(name: string, description: string, statusCode: number) {
        // Passando a mensagem do erro para a super classe Error
        super(description);

        // Setando o prototype da classe para a classe BaseError
        Object.setPrototypeOf(this, new.target.prototype);

        // Setando as propriedades da classe
        this.name = name;
        this.statusCode = statusCode;

        // Capturando o stacktrace do erro
        Error.captureStackTrace(this);
    }
}

export const logError = async (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    let err = error;
    if (!(err instanceof BaseError)) {
        err = new BaseError(
            'InternalServerError',
            'An unexpected error occurred.',
            500,
        );
    }
    next(err);
};

export const returnError = (
    error: BaseError,
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    response.status(error.statusCode || 500).json({
        message: error.message,
    });
};
