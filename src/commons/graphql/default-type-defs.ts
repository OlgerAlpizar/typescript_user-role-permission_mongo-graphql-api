import { gql } from 'apollo-server-express'

const defaultTypeDefs = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`

export default defaultTypeDefs