const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: 'String',
        required: true,
    },
    description: {
        type: 'String',
        required: true,
    },

    qtyInStock: {
        type: 'Number',
        required: true,
    },
    date: { type: Date, default: Date.now },
})

const product = mongoose.model('Product', productSchema);

exports.Product;
