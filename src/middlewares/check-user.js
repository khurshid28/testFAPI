const User = require("../models/User.js");
const Super = require("../models/Super.js");
const Admin = require("../models/Admin.js");
const {
    ForbiddenError,
    InternalServerError,
    NotFoundError
} = require("../utils/errors.js");

let db =require("../config/db")

module.exports = async(req, res, next) => {
    try {
        if (req.user.role !== "User" ) {
            return next(
              new ForbiddenError(
                403,
                "You do not have permission to access this resource"
              )
            );
          }
        
        return next();
    } catch (error) {
      console.log("check user >>");
        console.log(error);
        return next(new InternalServerError(500,  error));
    }
};