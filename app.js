const express = require('express')
const graphqlHttp = require('express-graphql')
const { buildSchema }= require('graphql') // buildSchema, converting string schema to JS objects  


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/graphql',graphqlHttp({

  schema: buildSchema(`

    type RootQuery {
      events: [String!]!
    }

    type RootMutation {
      createEvent(name: String): String
    }
  
    schema{
      query: RootQuery
      mutation: RootMutation
    }
  `),
  // Resolver , resolver for your commands need to have the exact same name , like events or createEvent
  rootValue: {
    events: () => {
      return ['Romantic Cooking','Sailing','All-Night Coding']
    },
    createEvent: (args) => {
      const eventName = args.name
      return eventName
    }
  },
  // built-in debugging and development tool 
  graphiql: true
}))

const port =  process.env.PORT || 4000 
app.listen(port, ()=>{
  console.log(`listening on port: ${port}`);
})

