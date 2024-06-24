import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cors from 'cors'
import { Logger } from './configurations/logger-middleware'
import corsOptions from './configurations/cors-middleware'
import errorHandler from './configurations/error-handler-middleware'
import { mongooseConnectDB } from './configurations/mongoose-connection'
import { ApolloServer, gql } from 'apollo-server-express'
import {getSingle} from './users/repositories/user-repository'

dotenv.config()

const PORT = Number(process.env.PORT) || 3010

const app = express()

//middleware's
app.use(morgan('dev'))
app.use(bodyParser.json()) // to allow json capabilities
app.use(bodyParser.urlencoded({ extended: true })) // parse requests of content-type - application/x-www-form-urlencoded
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(errorHandler)

// graphql
const userTypeDefs = gql`

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
`

const resolvers = {
  Query:{
    getUser: async (_: any, args: {id: string}) => await getSingle(args.id)
  }
}

const apolloServer = new ApolloServer({
  typeDefs: userTypeDefs,
  resolvers,
  context: () =>({

  })
})

const startServer = async () => {
  await apolloServer.start();
  apolloServer.applyMiddleware({app, path: '/graphql'})
};

startServer()
.then(async () => {
  await mongooseConnectDB(),
  app.listen(PORT, async () => {
    Logger.info(`Express with Apollo server running on port ${PORT}`)
  })
})

