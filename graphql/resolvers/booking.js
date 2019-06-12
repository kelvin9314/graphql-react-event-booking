const BookingModel = require('../../models/booking.model')
const EventModel = require('../../models/event.model') 
const { transformBooking } = require('./mergeData')


module.exports = {

  bookings: async (args, req) =>{
    if(!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try{
      const bookings = await BookingModel.find()
      return bookings.map(booking =>{
        return transformBooking(booking)
      })
    } catch(err){
        throw err
    }
  },
  bookEvent: async (args, req) =>{
    if(!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    const fetchedEvent = await EventModel.findOne({_id: args.eventID})
    const booking = new BookingModel({
      user: req.userID,
      event: fetchedEvent
    })
    const result = await booking.save()

    return transformBooking(result)
  },
  cancelBooking: async (args, req) =>{
    if(!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try{
      const booking = await BookingModel.findById(args.bookingID).populate('event')
      const event = transformEvent(booking._doc.event)
      await BookingModel.deleteOne({_id: args.bookingID})

      return event
    } catch (err){
        throw err
    }
  }
}