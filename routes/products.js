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
    Product.findOne({ name: req.body.name })
        .then((product) => {
            if (product && product.qtyInStock !== 0) {
                return res.status(400).json({ product: "product already exists" })
            } else {
                const newProduct = new Product({
                    name: req.body.name,
                    description: req.body.description,
                    qtyInStock: req.body.qtyInStock,
                });

                newProduct.save()
                    .then(product => { res.json(product) })
                    .catch(error => { console.log(error.message) });
            }
        })

})


module.exports = router;