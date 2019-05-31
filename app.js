const express = require('express')
const graphqlHttp = require('express-graphql')
const { buildSchema }= require('graphql') // buildSchema, converting string schema to JS objects  


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//  temp resolution , it will replace by using database later 
const events = [];

app.use('/graphql',graphqlHttp({

  schema: buildSchema(`

    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }
  
    schema{
      query: RootQuery
      mutation: RootMutation
    }
  `),
  // Resolver , resolver for your commands need to have the exact same name , like events or createEvent
  rootValue: {
    events: () => {
      return events
    },
    createEvent: (args) => {
      const {title , description, price} = args.eventInput

      const event = {
        _id: Math.random().toString(),
        title,
        description,
        price: +price,
        date: new Date().toISOString()
      } 
      events.push(event)
      return event
    }
  },
  // built-in debugging and development tool 
  graphiql: true
}))

const port =  process.env.PORT || 4000 
app.listen(port, ()=>{
  console.log(`listening on port: ${port}`);
})

