const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
	try {
		await mongoose.connect(process.env.MONGO_LOCAL_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('connected to the database successfully');
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = connectDb;
