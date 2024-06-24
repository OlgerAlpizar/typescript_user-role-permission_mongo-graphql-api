"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidationErrors = void 0;
const logger_middleware_1 = require("../configurations/logger-middleware");
const getValidationErrors = (errors) => {
    const json = JSON.parse(JSON.stringify(errors)); // since cannot access to path on ValidationError, then play with dnamic json object
    logger_middleware_1.Logger.error(JSON.stringify(errors));
    return `Validation errors: ${json.map((x) => `[${x.path}|${x.msg}]`)}`;
};
exports.getValidationErrors = getValidationErrors;
