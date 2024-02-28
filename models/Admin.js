const mongoose = require('mongoose');

const AdminShema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
},
    {
    timestamps: true,
});

module.exports = mongoose.model('Admin', AdminShema)