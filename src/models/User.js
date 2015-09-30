var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

    name : String,
    email : String,
    documents : [String],
    token : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
