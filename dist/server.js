"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const logger_middleware_1 = require("./configurations/logger-middleware");
const cors_middleware_1 = __importDefault(require("./configurations/cors-middleware"));
const error_handler_middleware_1 = __importDefault(require("./configurations/error-handler-middleware"));
const mongoose_connection_1 = require("./configurations/mongoose-connection");
const apollo_server_express_1 = require("apollo-server-express");
const user_repository_1 = require("./users/repositories/user-repository");
dotenv_1.default.config();
const PORT = Number(process.env.PORT) || 3010;
const app = (0, express_1.default)();
//middleware's
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json()); // to allow json capabilities
app.use(body_parser_1.default.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(cors_middleware_1.default));
app.use(express_1.default.json());
app.use(error_handler_middleware_1.default);
// graphql
const userTypeDefs = (0, apollo_server_express_1.gql) `

type User {
    id: ID!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    phone: String!
    avatarUrl: String
}

type Query {
  getUser(id: ID!): User 
}
`;
const resolvers = {
    Query: {
        getUser: async (_, args) => await (0, user_repository_1.getSingle)(args.id)
    }
};
const apolloServer = new apollo_server_express_1.ApolloServer({
    typeDefs: userTypeDefs,
    resolvers,
    context: () => ({})
});
const startServer = async () => {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });
};
startServer()
    .then(async () => {
    await (0, mongoose_connection_1.mongooseConnectDB)(),
        app.listen(PORT, async () => {
            logger_middleware_1.Logger.info(`Express with Apollo server running on port ${PORT}`);
        });
});
