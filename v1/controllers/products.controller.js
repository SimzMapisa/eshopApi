const Product = require('../models/Product');

const GetAllProducts = (req, res) => {
	Product.find()
		.then((products) => res.json(products))
		.catch((err) => console.log(err));
};

const GetProduct = (req, res) => {};

const CreateProduct = (req, res) => {
	Product.findOne({ name: req.body.name }).then((product) => {
		if (product && product.qtyInStock !== 0) {
			return res.status(400).json({ product: 'product already exists' });
		} else {
			const newProduct = new Product({
				name: req.body.name,
				description: req.body.description,
				qtyInStock: req.body.qtyInStock,
				richDescription: req.body.richDescription,
				img: req.body.img,
				price: req.body.price,
				category: req.body.category,
				brand: req.body.brand,
			});

			newProduct
				.save()
				.then((product) => {
					res.json(product);
				})
				.catch((error) => {
					console.log(error.message);
				});
		}
	});
};

module.exports = {
	CreateProduct,
	GetAllProducts,
	GetProduct,
};
