const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }  // mongoose will automatically add "cratedAt" and "updatedAt" field
)

module.exports = mongoose.model('Booking',bookingSchema)