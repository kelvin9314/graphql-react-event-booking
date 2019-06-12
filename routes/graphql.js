// require('dotenv').config()
const graphqlHttp = require('express-graphql')
const graphQlSchema = require('../graphql/schema/index')
const graphQlResolves = require('../graphql/resolvers/index')


let flagFlag = true

if(process.env.NODE_ENV == 'production') {
  flagFlag = false
} 

console.log(process.env.NODE_ENV );

module.exports =  graphqlHttp({
  schema: graphQlSchema,
  // Resolver , resolver for your commands need to have the exact same name , like events or createEvent
  rootValue: graphQlResolves,
  // built-in debugging and development tool 
  graphiql: flagFlag
})
