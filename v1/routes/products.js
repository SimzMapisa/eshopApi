const express = require('express');
const router = express.Router();
const {
	GetAllProducts,
	GetProduct,
	CreateProduct,
	EditProduct,
	DeleteProduct,
} = require('../controllers/products.controller');
const { userAuth } = require('../middleware/auth');

// @route   Get api/products
// @desc - Get all products
// @access - Public

router.get('/', GetAllProducts);

// @route   Get api/products
// @desc - Get all products
// @access - Public

router.get('/:id', GetProduct);

// @route   POST api/products
// @desc -  Post a single product
// @access - Private (only ADMINS and SUPER_ADMINS can access)

router.post('/', userAuth(['SUPER_ADMIN', 'ADMIN']), CreateProduct);

// @route   POST api/products
// @desc -  Post a single product
// @access - Private (only ADMINS and SUPER_ADMINS can access)
router.patch('/:id', userAuth(['SUPER_ADMIN', 'ADMIN']), EditProduct);

// @route   DELETE api/products
// @desc -  Delete a single product
// @access - Private (only ADMINS and SUPER_ADMINS can access)
router.delete('/:id', userAuth(['SUPER_ADMIN', 'ADMIN']), DeleteProduct);

module.exports = router;
