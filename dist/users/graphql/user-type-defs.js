"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const default_type_defs_1 = __importDefault(require("../../commons/graphql/default-type-defs"));
const userTypeDefs = (0, apollo_server_express_1.gql) `
extend type Query {
  getUser(id: ID!): User 
}

type User {
    id: ID!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    phone: String!
    avatarUrl: String
}
`;
exports.default = [default_type_defs_1.default, userTypeDefs];
