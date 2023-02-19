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

router.get('/:id', ProductRoutes.GetProduct);

// @route   POST api/products
// @desc -  Post a single produc
// @access - Public

router.post('/', ProductRoutes.CreateProduct);

module.exports = router;
