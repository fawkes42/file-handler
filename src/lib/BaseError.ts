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
