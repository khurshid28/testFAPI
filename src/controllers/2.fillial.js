const { InternalServerError, ForbiddenError } = require("../utils/errors.js");

const FillialModel = require("../models/Fillial.js");

let db = require("../config/db");

function toMyString(ob) {
  let result = `'{`;
  let li = [];
  for (let [key, value] of Object.entries(ob)) {
    value = `${value}`;
    value = value.replaceAll("ʻ", "'");
    li.push(`"${key}":"${value}"`);
  }
  result += li.join();
  if (ob.role) {
    result += `,"date": "${new Date().addHours(5).toISOString()}"`;
  }
  result = result + `}'`;
  return result;
}

class Fillial {
  async create(req, res, next) {
    try {
      if (req.user.role != "SuperAdmin") {
        return next(
          new ForbiddenError(
            403,
            "You do not have permission to access this resource"
          )
        );
      }
      let {
        merchant_id,
        address,
        name,
        inn,
        mfo,
        nds,
        bank_name,
        hisob,
        director_name,
        director_phone,
        percent_type,
        expired_months,
        

      } = req.body;
      name = name.replaceAll("ʻ", "'");
      director_name = director_name.replaceAll("ʻ", "'");
      bank_name = bank_name.replaceAll("ʻ", "'");
      //       let expired_monthsString = `'[`;
      //        expired_months.forEach((expired_month) => {
      //   expired_monthsString += toMyString(expired_month).slice(1, -1);
      //   expired_monthsString += `,`;
      // });
      // expired_monthsString = expired_monthsString.slice(0, -1);
      // expired_monthsString += "]'";
      // let expired_monthsString = `'[`;
      let merchant = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT * FROM merchant WHERE id=${merchant_id};`,
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
      
      let id = await new Promise(function (resolve, reject) {
        db.query(
          `INSERT INTO fillial (name,address,merchant_id,who_created,inn,mfo,bank_name,nds,hisob_raqam,director_name,director_phone,percent_type,expired_months,admin_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ;`,

          [
            name,

            JSON.stringify(toMyString(address)),
            merchant_id,
            JSON.stringify({
              role: req.user.role,
              id: req.user.id,
              date: new Date().toISOString(),
            }),
            inn,
            mfo,
            bank_name,
            nds,
            hisob,
            director_name,
            director_phone,
            percent_type,
            JSON.stringify( expired_months,),
            merchant.admin_id
          ],
          function (err, results, fields) {
            console.log(">>>>>>....");
            console.log(err);
            if (err) {
              resolve(null);
              return null;
            }
            console.log("++++", results);
            if (results.insertId) {
              resolve(results.insertId);
            } else {
              resolve(null);
              return null;
            }
          }
        );
      });

      return res.status(201).json({
        message: "Fillial is created successfully",
        id,
      });
    } catch (error) {
      return next(new InternalServerError(500, error));
    }
  }

  async getbyId(req, res, next) {
    try {
      // if (req.user.role == "SuperAdmin" || req.user.role == "Admin") {
      //   return next(
      //     new ForbiddenError(
      //       403,
      //       "You do not have permission to access this resource"
      //     )
      //   );
      // }

      let fillial = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT * FROM fillial WHERE id=${req.params.id};`,
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
      res.status(200).json({ data: fillial });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error));
    }
  }
  async getAll(req, res, next) {
    try {
      if (req.user.role != "SuperAdmin" && req.user.role != "Admin") {
        return next(
          new ForbiddenError(
            403,
            "You do not have permission to access this resource"
          )
        );
      }

      let fillials = await new Promise(function (resolve, reject) {
        db.query(`SELECT f.*,(select count(id) from Zayavka where fillial_id=f.id) as count  FROM fillial as f where f.work_status="working" order by count desc;`, function (err, results, fields) {
          if (err) {
            resolve(null);
            return null;
          }
          console.log("++++", results);
          if (results.length != 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        });
      });
      res.status(200).json({ data: fillials });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error));
    }
  }
}

module.exports = new Fillial();
