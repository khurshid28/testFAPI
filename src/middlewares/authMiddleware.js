const { InternalServerError, ForbiddenError } = require("../utils/errors.js");

module.exports = async (req, res, next) => {
	try {
		if (
			req.headers.authorization &&
			(req.headers.authorization.split(" ")[0] === "Bearer") ===
				process.env.AUTH_KEY_API
		) {
			return next();
		} else if (req.query && req.query.token === process.env.AUTH_KEY_API) {
			return next();
		}

		return next(new ForbiddenError(403, "You have no permission"));
	} catch (error) {
		return next(new InternalServerError(500,  error));
	}
};