const mongoose = require('mongoose');

const CategoryShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: String,
    visibility: Boolean,
},
    {
    timestamps: true,
});

module.exports = mongoose.model('Category', CategoryShema)