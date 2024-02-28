const mongoose = require('mongoose');

const CategoryShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: String,
    visibility: Boolean,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: true,
    },
},
    {
    timestamps: true,
});

module.exports = mongoose.model('Subcategory', CategoryShema)