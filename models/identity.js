// app/models/identity.js

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
SALT_WORK_FACTOR = 10;

var identitySchema = new Schema({
    
    local           :{
        name        : String, 
        email       : String,
        username    : { type: String},
        password    : { type: String}
    },
      facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
        },
        twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
        },
        google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
        }    
});

identitySchema.pre('findOneAndUpdate', function(next){
   console.log('middleware functional captain');
});


// generating a hash
identitySchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
identitySchema.methods.validPassword = function(password) {
//    return bcrypt.compareSync(password, this.local.password);
        return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Identity', identitySchema);
