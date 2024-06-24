"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const defaultTypeDefs = (0, apollo_server_express_1.gql) `
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;
exports.default = defaultTypeDefs;
