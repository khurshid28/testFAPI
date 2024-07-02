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

        let user = await new Promise(function (resolve, reject) {
            db.query(
              `SELECT * from ${req.user.role} WHERE id='${req.user.id}'`,
              function (err, results, fields) {
                if (err) {
                    resolve(null);
                        return null;;
                }
                if (results.length != 0) {
                  resolve(results[0]);
                } else {
                  resolve(null);
                }
              }
            );
          });
         

        if (user.work_status == "deleted" || user.work_status == "blocked" || user.work_status=="super_blocked") {
            return next(
                new ForbiddenError(
                    403,
                    "You are " + user.work_status + ", now you have no permission"
                )
            );
        }
        
        if (user.role == "Admin") {
          let merchant = await new Promise(function (resolve, reject) {
            db.query(
              `SELECT * from MERCHANT WHERE admin_id='${req.user.id}'`,
              function (err, results, fields) {
                if (err) {
                    resolve(null);
                        return null;;
                }
                if (results.length != 0) {
                  resolve(results[0]);
                } else {
                  resolve(null);
                }
              }
            );
          });

         if (merchant.type == "Agent") {
          return next(
            new ForbiddenError(
                403,
                "You are Agent, you have no permission"
            )
        );
         }


       
          
      }
        return next();
    } catch (error) {
      console.log("check blocked >>");
        console.log(error);
        return next(new InternalServerError(500,  error));
    }
};