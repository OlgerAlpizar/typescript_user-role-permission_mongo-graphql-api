"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
const logger_middleware_1 = require("./logger-middleware");
class HttpError extends Error {
    code;
    details;
    constructor(message, details, code) {
        super(message);
        this.code = code;
        this.details = details;
    }
}
exports.HttpError = HttpError;
const errorHandler = (error, _req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) => {
    logger_middleware_1.Logger.error(`${error.message} - ${error.details}. code: ${error.code}`);
    res.status(error.code || 500).send({
        message: `${error.message || 'Something went wrong'}`,
        details: `${error.details || ''}`,
        statusCode: error.code || 500
    });
};
exports.default = errorHandler;
