const { buildSchema } = require('graphql')


module.exports = buildSchema(`

"""
預訂資訊
"""
type Booking {
  "識別碼"
  _id: ID!
  "事件"
  event: Event!
  "使用者"
  user: User!
  "建立日期"
  createdAt: String!
  "最後更新日期"
  updatedAt: String!
}

"""
事件資訊
"""
type Event {
  "識別碼"
  _id: ID!
  "標題"
  title: String!
  "描述"
  description: String!
  "價格"
  price: Float!
  "建立日期"
  date: String!
  "建立者"
  creator: User!
}

"""
使用者資訊
"""
type User {
  "識別碼"
  _id: ID!
  "郵件地址"
  email: String!
  # password is nullable , because we'll need it to create user but we will not be able to ever retrieve it from DB
  "密碼"
  password: String
  "該使用者所建立的事件"
  createdEvents: [Event!]
}    

"""
登入驗證後回傳的資訊
"""
type AuthData {
  userID: ID!
  token: String!
  tokenExpiration: Int!
}

"""
新增事件所需的資料
"""
input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
}

"""
新增使用者所需的資料
"""
input UserInput {
  email: String!
  password: String!
}

type RootQuery {
  "事件資訊"
  events: [Event!]!
  "預訂資訊"
  bookings: [Booking!]!
  "登入"
  login(email: String!, password: String!): AuthData!
}

type RootMutation {
  "新增事件"
  createEvent(eventInput: EventInput): Event
  "新增使用者"
  createUser(userInput: UserInput): User
  "使用者預訂事件"
  bookEvent(eventID: ID!): Booking!
  "使用者取消事件"
  cancelBooking(bookingID: ID!): Event!
}

schema{
  query: RootQuery
  mutation: RootMutation
}
`)