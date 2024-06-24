import { gql } from 'apollo-server-express'
import defaultTypeDefs from '../../commons/graphql/default-type-defs'

const userTypeDefs = gql`
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
`

export default [defaultTypeDefs, userTypeDefs]