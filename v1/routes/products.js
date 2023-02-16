const express = require('express');
const router = express.Router();
const ProductRoutes = require('../controllers/products.controller');

// @route   Get api/products
// @desc - Get all products
// @access - Public

router.get('/', ProductRoutes.GetAllProducts);

// @route   Get api/products
// @desc - Get all products
// @access - Public

router.get('/:id', (req, res) => {
	res.send({ msg: 'finally got the single product', name: 'myProd' });
});

// @route   POST api/products
// @desc -  Post a single product
// @access - Public

router.post('/', ProductRoutes.CreateProduct);

module.exports = router;
