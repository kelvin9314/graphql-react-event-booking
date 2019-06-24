const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email:  {
    type: String,
    required:true
  },
  password: {
    type:String,
    required:true
  },
  createdEvents:[
    {
      // stroe all the ID of the events this user created 
      type: Schema.Types.ObjectId, 
      /*  ref , this is important internally for Mongoose, this allow us to set up a relation and
          let mongoose know that two models are related which will help us when we fetch data 
          because we can basically let mongoose automatically merge data 
      */
      ref: 'Event'

    }
  ]
})

module.exports = mongoose.model('User',userSchema)
