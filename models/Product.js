const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema 
const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    richDescription: {
        type: String,
        default: ''
    },
    img: String,
    images: [{
        type: String,
    }],
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    qtyInStock: {
        type: Number,
        required: true,
    },
    date: { type: Date, default: Date.now },
})

module.exports = Product = mongoose.model('products', ProductSchema);
