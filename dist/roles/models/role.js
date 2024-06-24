"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleSchemaModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const RoleSchema = new mongoose_1.Schema({
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
    domain: {
        type: String,
        index: true,
        required: true,
    },
    permissionIds: {
        type: [String],
        index: true,
        required: true,
    },
}, {
    timestamps: true, //auto createdAt and updatedAt columns
}).plugin(mongoose_unique_validator_1.default);
exports.RoleSchemaModel = (0, mongoose_1.model)('Role', RoleSchema);
