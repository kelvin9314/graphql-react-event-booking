const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true,
  },
  price:{
    type: Number,
    required: true
  },
  date:{
    type: Date,
    required: true
  }
})

// like create collection
module.exports = mongoose.model('Event',eventSchema)

