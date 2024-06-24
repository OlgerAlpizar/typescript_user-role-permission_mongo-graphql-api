"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConnString = exports.whiteListUrls = exports.serverPort = exports.environment = void 0;
const environment = () => process.env.NODE_ENV || 'development';
exports.environment = environment;
const serverPort = () => Number(process.env.PORT) || 3010;
exports.serverPort = serverPort;
const whiteListUrls = () => process.env.WHITE_LIST_URLS;
exports.whiteListUrls = whiteListUrls;
const mongoConnString = () => 'mongodb://localhost:27017/mydatabase';
exports.mongoConnString = mongoConnString;
`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URI}/?retryWrites=true&w=majority` ||
    '';
