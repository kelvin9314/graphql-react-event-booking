const bcrypt = require('bcrypt')

const UserModel = require('../../models/user.model')


module.exports = {

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