const Super = require("../models/Super.js");
const Admin = require("../models/Admin.js");
const User = require("../models/User.js");
const Merchant = require("../models/Merchant.js");

let db = require("../config/db");

const {
  InternalServerError,
  AuthorizationError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors.js");
const jwt = require("../utils/jwt.js");

// const { mockUser, mockSuper } = require("../../mock.js");

class Login {
  async userLogin(req, res, next) {
    try {
      console.log(">>>>>>>>>> userLogin");
      let user;
      const { loginName, loginPassword } = req.body;
      console.log(loginName);
      console.log(loginPassword);
      user = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT * from SuperAdmin WHERE loginName ='${loginName}' AND loginPassword ='${loginPassword}'`,
          function (err, results, fields) {
            if (err) {
                resolve(null);
                        return null;;
            }
            console.log("++++", results);
            console.log("SuperAdmin");
            if (results.length != 0) {
              resolve(results[0]);
            } else {
              resolve(null);
            }
          }
        );
      });
     
     
      if (!user)
        user = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from Admin WHERE loginName='${loginName}' AND loginPassword='${loginPassword}'`,
            function (err, results, fields) {
              if (err) {
                return  resolve(null);
                        return null;;
              }
              console.log("++++", results);
              if (results.length != 0) {
                resolve(results[0]);
              } else {
                resolve(null);
              }
            }
          );
        });
      if (!user)
        user = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from User WHERE loginName='${loginName}' AND loginPassword='${loginPassword}'`,
            function (err, results, fields) {
              if (err) {
                return  resolve(null);
                        return null;;
              }
              console.log("++++", results);
              if (results.length != 0) {
                resolve(results[0]);
              } else {
                resolve(null);
              }
            }
          );
        });

      console.log(">>>>>>>>>>");
      
      if (!user) {
        user = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from Accountant WHERE loginName='${loginName}' AND loginPassword='${loginPassword}'`,
            function (err, results, fields) {
              if (err) {
                resolve(null);
                return null;
              }
              console.log("++++", results);
              if (results.length != 0) {
                resolve(results[0]);
              } else {
                resolve(null);
              }
            }
          );
        });

      }
      

      if (!user) {
        return next(new AuthorizationError(401, "Invalid login credentials!"));
      }

      if (user.work_status == "deleted") {
        return next(new NotFoundError(404, "Not Found"));
      } else if (user.work_status == "blocked" || user.work_status=="super_blocked") {
        return next(new ForbiddenError(403, "You are blocked and No Active"));
      } 
      
      const token = jwt.sign({
        userId: user["id"],
        agent: req.headers["user-agent"],
        role: user.role,
      });

      return res.status(200).json({
        data: user,
        message: "Here is your token",
        token,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500,  error));
    }
  }
  
}

module.exports = new Login();
