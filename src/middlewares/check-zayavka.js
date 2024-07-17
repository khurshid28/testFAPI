const jwt = require("../utils/jwt.js");
const {
  AuthorizationError,
  ForbiddenError,
  InternalServerError,
  InvalidTokenError,
  UnAvailableError,
} = require("../utils/errors.js");
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");
let db = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    console.log(req.body.id);
    let Myzayavka = await new Promise(function (resolve, reject) {
      db.query(
        `Select * from Zayavka WHERE id='${req.body.id}'`,
        function (err, results, fields) {
          if (err) {
             resolve(null);
                        return null;;
          }
          // console.log("++++", results);
          if (results.length != 0) {
            resolve(results[0]);
          } else {
            resolve(null);
          }
        }
      );
    });
    if(!Myzayavka) {
      return next();
    }
    let zayavka = await new Promise(function (resolve, reject) {
      db.query(
        `Select * from Zayavka WHERE passport='${Myzayavka.passport}' AND id != '${req.body.id}' AND status='progress' `,
        function (err, results, fields) {
          if (err) {
             resolve(null);
                        return null;
          }
          if (results.length != 0) {
            resolve(results[0]);
          } else {
            resolve(null);
          }
        }
      );
    });
    
    if (!zayavka) {
      return next();
    }
    
    return next(new UnAvailableError(403, "Пользователю не предоставлено разрешение"));
  } catch (error) {
    console.log("????????????");
    console.log(error);
    if (error instanceof TokenExpiredError) {
      return next(new AuthorizationError(401, "Token has expired"));
    } else if (error instanceof JsonWebTokenError) {
      return next(new InvalidTokenError(401, "Malformed token"));
    }

    return next(new InternalServerError(500,  error));
  }
};
