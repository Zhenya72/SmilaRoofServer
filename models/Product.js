const mongoose = require('mongoose');

const ProductShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    imageUrl: String,
    visibility: Boolean,
    availability: Boolean,
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory', 
        required: true,
    },
},
    {
    timestamps: true,
});

module.exports = mongoose.model('Product', ProductShema)