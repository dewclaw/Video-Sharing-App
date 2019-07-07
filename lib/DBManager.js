let mongoose = require('mongoose')

function DBConnect() {
    mongoose.connect('mongodb://frank:password1@ds161069.mlab.com:61069/dataclaw', { useNewUrlParser: true }).then(() => {
        console.log("MONGO DB CONNECTION SUCCESS")
    })
}


var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    emailAddress: String,
    age: String,
    pwHash: String,
    condition: [String]
})
var User = mongoose.model('User', UserSchema)

// var userOne = new User({
//     firstName : "Frank",
//     lastName : "Novello",
//     emailAddress : "fnovello12@gmail.com",
//     age : "29", 
//     pwHash : "password1",
//     condition : ['Bipolar','anxiety']
// })
// userOne.save((error,userOne)=>{
//     if(error){
//         throw error
//     }
//     console.log(`User created success`)
//     console.log(userOne.condition[0])
// })
// User.find((error, users) => {
//     if (error) {
//         throw error
//     }
//     console.log(users)
// })
// DBConnect();

module.exports = {
    DBConnect : DBConnect,
    UserModel : User
}