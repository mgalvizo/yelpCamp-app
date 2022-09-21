const mongoose = require('mongoose');
// Require passport-local-mongoose
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
    },
});

// Passport-Local Mongoose will add a username, hash and salt field to store
// the username, the hashed password and the salt value.
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
