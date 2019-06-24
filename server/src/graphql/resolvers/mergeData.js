const EventModel = require('../../models/event.model') 
const UserModel = require('../../models/user.model') 
const { dateToString } = require('../../heplers/date')

// using function to model the relation in a highly flexible way
const getEvent = async eventIDs =>{
  // multiple events
  try{
  const events = await EventModel.find({_id: {$in: eventIDs}})
  return events.map(event => {
      return transformEvent(event)
    })
  
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

const singleEvent = async eventID =>{
  // single event
  try{
    const event = await EventModel.findById(eventID)
    return transformEvent(event)
  } catch (err){
      throw err
  }
}

const transformEvent = event =>{
  return {
    ...event._doc,
    _id: event.id, 
    date: dateToString(event._doc.date),
    creator: getUser.bind(this, event.creator) 
  }
}

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id, 
    user: getUser.bind(this, booking._doc.user),
    event: singleEvent.bind(this,booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  }
}


exports.transformEvent = transformEvent
exports.transformBooking = transformBooking