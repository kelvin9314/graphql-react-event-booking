const express = require('express')
const mongoose = require('mongoose')
const isAuth = require('./middleware/is-auth')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


/*
 * this part may use the package of Express cors
 */
app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if(req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(isAuth)

app.use('/graphql',require('./routes/graphql'))


mongoose.set('useNewUrlParser', true);

// mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-qdkg1.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
mongoose.connect(`mongodb://${process.env.DB_SERVER}/${process.env.DB_DATABASE}`)
  .then(()=>{
    console.log('mongoDB connect successful~~')
    const port =  process.env.PORT || 4000 
    app.listen(port, ()=>{
      console.log(`listening on port: ${port}`)
    })  
  }).catch(err => {
    console.log(err);
  })

