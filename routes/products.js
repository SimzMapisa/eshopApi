const express = require('express');
const router = express.Router();
const Product = require('../models/Product')


// @route   Get api/products
// @desc - Get all products 
// @access - Public

router.get('/', (req, res) => {
    res.json({ msg: "I got all the products" });
})

// @route   Get api/products
// @desc - Get all products 
// @access - Public

router.get('/:id', (req, res) => {
    res.send({ msg: "finally got the single product", name: "myProd" });
})


// @route   POST api/products
// @desc -  Post a single product
// @access - Public

router.post('/', (req, res) => {
    const product = new Product({
        name: req.body.name,
        desc: req.body.description,
        qty: req.body.qtyInStock
    })

    product.save();
    console.log(product);
})


module.exports = router;