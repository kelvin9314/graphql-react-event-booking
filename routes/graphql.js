const graphqlHttp = require('express-graphql')

const graphQlSchema = require('../graphql/schema/index')
const graphQlResolves = require('../graphql/resolvers/index')

module.exports =  graphqlHttp({
  schema: graphQlSchema,
  // Resolver , resolver for your commands need to have the exact same name , like events or createEvent
  rootValue: graphQlResolves,
  // built-in debugging and development tool 
  graphiql: true
})
