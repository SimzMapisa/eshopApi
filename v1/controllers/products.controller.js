const Product = require('../models/Product');

const GetAllProducts = (req, res) => {
	Product.find()
		.then((products) => res.json(products))
		.catch((err) => console.log(err));
};

const GetProduct = async (req, res) => {
	await Product.findById(req.params.id)
		.exec()
		.then((product) => {
			if (!product)
				return res.status(404).json({ message: 'Product can not be found!' });
			console.log(product);
			res.json(product);
		});
};

const CreateProduct = async (req, res) => {
	await Product.findOne({ name: req.body.name })
		.exec()
		.then((product) => {
			if (product && product.qtyInStock !== 0) {
				return res.status(400).json({ product: 'product already exists' });
			} else {
				const newProduct = new Product({
					name: req.body.name,
					slug: req.body.name,
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

const EditProduct = async (req, res) => {
	try {
		await Product.findById(req.params.id).then((product) => {
			if (!product) {
				res.status(404).json({ message: 'Product not found' });
			}

			product.name = req.body.name || product.name;
			product.slug = req.body.name || product.name;
			product.description = req.body.description || product.description;
			product.qtyInStock = req.body.qtyInStock || product.qtyInStock;
			product.richDescription =
				req.body.richDescription || product.richDescription;
			product.img = req.body.img || product.img;
			product.price = req.body.price || product.price;
			product.category = req.body.category || product.category;
			product.brand = req.body.brand || product.brand;

			product.save();
			res.status(200).json({ message: 'Product saved successfully' });
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error updating product' });
	}
};

const DeleteProduct = (req, res) => {
	Product.findByIdAndDelete(req.params.id)
		.exec()
		.then((doc) => {
			if (!doc) {
				return res.status(404).json({ message: 'Product does not exist' });
			}
			return res.json({ message: `Product deleted` });
		});
};

module.exports = {
	CreateProduct,
	GetAllProducts,
	GetProduct,
	EditProduct,
	DeleteProduct,
};
