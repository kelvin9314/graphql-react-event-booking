const express = require('express')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/',(req,res,next)=>{
  res.status(200).json(`hello world !`)
})


const port =  process.env.PORT || 4000 
app.listen(port, ()=>{
  console.log(`listening on port: ${port}`);
})

