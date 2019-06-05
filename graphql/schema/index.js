const { buildSchema } = require('graphql')


module.exports = buildSchema(`

type Booking {
  _id: ID!
  event: Event!
  user: User!
  createdAt: String!
  updatedAt: String!
}

# graphql return data format
type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: User!
}

type User {
  _id: ID!
  email: String!
  # password is nullable , because we'll need it to create user but we will not be able to ever retrieve it from DB
  password: String
  createdEvents: [Event!]
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
  bookings: [Booking!]!
}

type RootMutation {
  createEvent(eventInput: EventInput): Event
  createUser(userInput: UserInput): User
  bookEvent(eventID: ID!): Booking!
  cancelBooking(bookingID: ID!): Event!
}

schema{
  query: RootQuery
  mutation: RootMutation
}
`)