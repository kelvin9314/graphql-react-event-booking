const EventModel = require('../../models/event.model') 
const { transformEvent } = require('./mergeData')


module.exports = {
  events: async () => {
    // populate(), 讀取該field 的relation所指向的extra data (類似foreign key)
    try{
      const events = await EventModel.find()
      return events.map(event => {
        // we can use event.id because of mongoose will actually access the native ID and translate it into string
        return transformEvent(event)
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

      createdEvent = transformEvent(result)

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
  }
}