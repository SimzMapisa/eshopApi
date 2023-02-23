const jwt = require('jsonwebtoken');
/**
 *
 * @param roles is an array of one or more roles
 * @returns authenticates based on given role if the role is not found in the decoded token then it throws an error
 */
const userAuth =
	(roles = []) =>
	(req, res, next) => {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.secretOrKey);
			if (!roles.includes(decoded.role)) {
				throw new Error();
			}
			req.userData = decoded;
			next();
		} catch (error) {
			return res.status(401).json({
				message:
					'Unauthorized access, you are not allowed to access these resources',
				success: false,
			});
		}
	};

module.exports = {
	userAuth,
};
