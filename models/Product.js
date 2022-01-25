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

    qtyInStock: {
        type: Number,
        required: true,
    },
    date: { type: Date, default: Date.now },
})

module.exports = Product = mongoose.model('products', ProductSchema);
