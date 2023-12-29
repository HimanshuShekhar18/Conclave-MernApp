const mongoose = require('mongoose');

const Schema = mongoose.Schema;  // Schema ek class hain

// how the userdata will be stored in database uska ek blueprint
// creating an instacne of this class Schema, or uske andar object pass karna hota hain and uss object ke kon se fields hone chahiye
const userSchema = new Schema(
    {
        phone: { type: String, required: true },
        name: { type: String, required: false },   // jab pehli baar user create kiya to 2nd step mein name chahiye
        avatar: { type: String, required: false }, // why string? bcoz: file ka path store karenge
        activated: { type: Boolean, required: false, default: false },
    },
    {
        timestamps: true, // to store timestamps of each record created add and updated add in the database
    }
);

module.exports = mongoose.model('User', userSchema, 'users');
// model name = User
// Schema konsa use = userSchema
// collections name = users