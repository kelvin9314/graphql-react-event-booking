const express = require('express')
const graphqlHttp = require('express-graphql')
const { buildSchema }= require('graphql') // buildSchema, converting string schema to JS objects  
const mongoose = require('mongoose')

const EventModel = require('./models/event.model') 

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

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
      price: Float!
      date: String!
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
      return EventModel.find()
      .then(events => {
        return events.map(event => {
          // we can use event.id because of mongoose will actually access the native ID and translate it into string
          return {...event._doc, _id: event.id} 
        })
      })
      .catch(err=>{
        throw err
      })
    },
    createEvent: (args) => {
      const {title , description, price, date} = args.eventInput

      const event = new EventModel({
        title,
        description,
        price: +price,
        date: new Date(date)
      })

      return event.save()
      .then(result =>{
        console.log(result)
        return {...result._doc, _id: event._doc._id.toString()}
      })
      .catch(err => {
        console.log(err)
        throw err
      })

    }
  },
  // built-in debugging and development tool 
  graphiql: true
}))

mongoose.set('useNewUrlParser', true);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-qdkg1.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(()=>{
    console.log('mongoDB connect successful~~');
    const port =  process.env.PORT || 4000 
    app.listen(port, ()=>{
      console.log(`listening on port: ${port}`);
    })  
  }).catch(err => {
    console.log(err);
  })

