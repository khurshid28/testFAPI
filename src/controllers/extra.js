const fs = require("fs");
const path = require("path");
const { InternalServerError, NotFoundError } = require("../utils/errors.js");

const imageRender = (req, res, next) => {
	try {
		let fileName = req.params.fileName;
		let filePath = path.join(process.cwd() + "/uploads/" + fileName);
		if (!fs.existsSync(filePath)) {
			return next(new NotFoundError(404, "You are going the wrong way"));
		}
		res.sendFile(filePath);
	} catch (error) {
		return next(new InternalServerError(500,  error));
	}
};

module.exports = {
	imageRender,
};