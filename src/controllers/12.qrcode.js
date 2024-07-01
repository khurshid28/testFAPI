let {
  InternalServerError,
  BadRequestError,
  ForbiddenError,
} = require("../utils/errors.js");

// let axios = require("axios");
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("../utils/jwt.js");

class QrCodeController {
  async validate(req, res, next) {
    try {
      let { code } = req.body;
      let { userId, orderId } =  jwt.verify(code);
      return res.status(200).json({
        message: "Successfully",
        data: { userId, orderId },
      });
    } catch (error) {
      
      if (error instanceof JsonWebTokenError) {
        return next(new JsonWebTokenError(error.message));
      } else if (error instanceof TokenExpiredError) {
        return next(new TokenExpiredError(error.message));
      } else {
        return next(new InternalServerError(500, error));
      }
    }
  }
}

module.exports = new QrCodeController();
