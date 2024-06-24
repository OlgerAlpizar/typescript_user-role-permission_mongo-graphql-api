"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionSchemaModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const PermissionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        index: true,
        required: true,
    },
    description: {
        type: String,
        index: true,
        required: true,
    },
    applicationName: {
        type: String,
        index: true,
        required: true,
    }
}, {
    timestamps: true, //auto createdAt and updatedAt columns
}).plugin(mongoose_unique_validator_1.default);
exports.PermissionSchemaModel = (0, mongoose_1.model)('Permission', PermissionSchema);
