"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseConnectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_middleware_1 = require("./logger-middleware");
const mongooseConnectDB = async () => {
    mongoose_1.default.set('strictQuery', true);
    const connectionString = process.env.MONGO_DB_CONNECTION ?? '';
    await mongoose_1.default
        .connect(connectionString)
        .then(() => {
        logger_middleware_1.Logger.info('Mongoose connected!');
    })
        .catch((err) => {
        logger_middleware_1.Logger.error('Error connecting to mongoose', err);
    });
};
exports.mongooseConnectDB = mongooseConnectDB;
