const BookingModel = require('../../models/booking.model')
const EventModel = require('../../models/event.model') 
const { transformBooking } = require('./mergeData')


module.exports = {

  bookings: async() =>{
    try{
      const bookings = await BookingModel.find()
      return bookings.map(booking =>{
        return transformBooking(booking)
      })
    } catch(err){
        throw err
    }
  },
  bookEvent: async args =>{
    const fetchedEvent = await EventModel.findOne({_id: args.eventID})
    const booking = new BookingModel({
      user: '5cf5e63750bf031fb419c068',
      event: fetchedEvent
    })
    const result = await booking.save()

    return transformBooking(result)
  },
  cancelBooking: async args =>{
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