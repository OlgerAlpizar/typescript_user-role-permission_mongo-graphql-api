"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchemaModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        index: true,
        required: true,
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please use a valid email address',
        ],
    },
    password: {
        type: String,
        required: true,
        minlength: 10,
    },
    firstName: {
        type: String,
        index: true,
        required: true,
    },
    lastName: {
        type: String,
        index: true,
        required: true,
    },
    avatarUrl: {
        type: String,
    },
}, {
    timestamps: true, //auto createdAt and updatedAt columns
}).plugin(mongoose_unique_validator_1.default);
exports.UserSchemaModel = (0, mongoose_1.model)('User', UserSchema);
