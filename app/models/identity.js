// app/models/identity.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var identitySchema = new Schema({
        name        : String,
        email       : String,
        username    : String,
        password    : String
    });

module.exports = mongoose.model('Identity', identitySchema);
