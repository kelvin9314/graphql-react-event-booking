const graphqlHttp = require('express-graphql')
const { buildSchema }= require('graphql') // buildSchema, converting string schema to JS objects  .
const bcrypt = require('bcrypt')

const EventModel = require('../models/event.model') 
const UserModel = require('../models/user.model')

module.exports =  graphqlHttp({

  schema: buildSchema(`

    # graphql return data format
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _id: ID!
      email: String!
      # password is nullable , because we'll need it to create user but we will not be able to ever retrieve it from DB
      password: String
    }    


    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
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
    createEvent: args => {
      const {title , description, price, date} = args.eventInput

      const event = new EventModel({
        title,
        description,
        price: +price,
        date: new Date(date),
        // the ID of user, mongoose will automatically convert the string to an Object ID  
        creator: '5cf497a9994a6c56d8705e86'
      })

      let createdEvent

      return event.save()
      .then(result =>{
        createdEvent = {...result._doc, _id: result._doc._id.toString()}
        return UserModel.findById('5cf497a9994a6c56d8705e86')
      })
      .then(user => {
        if(!user){
          throw new Error('User not found')
        }
        user.createdEvents.push(event)
        return user.save()
      })
      .then(result =>{
        return createdEvent
      })
      .catch(err => {
        console.log(err)
        throw err
      })
    },
    createUser: args =>{
      const {email, password} = args.userInput
      const saltRounds = 12 

      // 先檢查帪號的email有沒有重覆
      return UserModel.findOne({email}).then(user =>{
        if(user){
          throw new Error('User exists already')
        }
        // 加密 password
        return bcrypt.hash(password,saltRounds)
      })
      .then(hashedPassword=>{
        const user = new UserModel({
          email,
          password: hashedPassword
        })

        // 存進 mongoDB
        return user.save()
      })
      .then(result =>{
        return {...result._doc, password:  null, _id: result.id}
      })
      .catch(err =>{
        throw err
      })
    
    }
  },
  // built-in debugging and development tool 
  graphiql: true
})
