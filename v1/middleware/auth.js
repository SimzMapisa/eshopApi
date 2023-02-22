const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		console.log(token);
		const decoded = jwt.verify(token, process.env.secretOrKey);
		req.userData = decoded;
		next();
	} catch (error) {
		return res
			.status(401)
			.json({ message: 'auth failed, Please login to access these resources' });
	}
};

module.exports = {
	userAuth,
};
