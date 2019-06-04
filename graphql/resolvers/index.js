const bcrypt = require('bcrypt')

const EventModel = require('../../models/event.model') 
const UserModel = require('../../models/user.model')

// using function to model the relation in a highly flexible way
const getEvent = async eventIDs =>{
  try{
  const events = await EventModel.find({_id: {$in: eventIDs}})
  events.map(event => {
      return { 
        ...event._doc,
        _id: event.id, 
        date: new Date(event._doc.date).toISOString(),
        creator: getUser.bind(this, event.creator) }
    })

  return events
  } catch(err) {
    throw err
  }
}

const getUser = async userID =>{
  try{
    const user = await UserModel.findById(userID)
    return {
      ...user._doc, 
      _id: user.id, 
      createdEvents: getEvent.bind(this, user._doc.createdEvents)
    }
  }catch(err){
    throw err
  }

}

module.exports = {
  events: async () => {
    // populate(), 讀取該field 的relation所指向的extra data (類似foreign key)
    try{
      const events = await EventModel.find()
      return events.map(event => {
        // we can use event.id because of mongoose will actually access the native ID and translate it into string
        return {
          ...event._doc, 
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: getUser.bind(this, event._doc.creator)
        }
      })
    } catch (err){
      throw err
    }
  },
  createEvent: async args => {
    const {title , description, price, date} = args.eventInput

    const event = new EventModel({
      title,
      description,
      price: +price,
      date: new Date(date),
      // the ID of user, mongoose will automatically convert the string to an Object ID  
      creator: '5cf5e63750bf031fb419c068'
    })

    let createdEvent

    try{
      const result = await event.save()

      createdEvent = {
        ...result._doc,
          _id: result._doc._id.toString(),
        creator: getUser.bind(this,result._doc.creator)
      }

      const user = await UserModel.findById('5cf5e63750bf031fb419c068')

      if(!user){
        throw new Error('User not found')
      }
      user.createdEvents.push(event)
      await user.save()

      return createdEvent
    }catch(err){
      throw err
    }
  },
  createUser: async args =>{

    try{
      const {email, password} = args.userInput
      const saltRounds = 12 
      // 先檢查帪號的email有沒有重覆
      const existingUser = await UserModel.findOne({email})
      if(existingUser){
        throw new Error('User exists already')
      }
      // 加密 password
      const hashedPassword = await bcrypt.hash(password,saltRounds)
      const user = new UserModel({
        email,
        password: hashedPassword
      })

      // 存進 mongoDB
      const result = await user.save()

      return {...result._doc, password: null, _id: result.id}
    } catch(err){
      throw err
    }
  
  }
}