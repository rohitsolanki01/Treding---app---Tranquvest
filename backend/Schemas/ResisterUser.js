const { Schema, default: mongoose } =require("mongoose");

const resisterUser = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    create_at: {
        type: Date,
        default: Date.now()
    }
})


module.exports =resisterUser;