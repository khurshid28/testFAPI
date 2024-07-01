const {
    InternalServerError, ForbiddenError,
} = require("../utils/errors.js");


let db =require("../config/db")


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

class Admin {

    // async create(req, res, next) {
       
    //     try {
    //         if (req.user.role === "user") {
    //             return next(
    //                 new ForbiddenError(
    //                     403,
    //                     "You do not have permission to access this resource"
    //                 )
    //             );
    //         }
    //         let {
    //             merchant_id,
    //             address,
    //             name,
    //             inn,
    //             mfo,
    //             nds,
    //             bank_name,
    //             hisob_raqam,
    //             director_name,
    //             director_phone,
    //             percent_type,
    //     expired_months,


    //         } = req.body;
    //         name = name.replaceAll("ʻ", "'");
    //         director_name = director_name.replaceAll("ʻ", "'");
    //         bank_name = bank_name.replaceAll("ʻ", "'");
    //         let expired_monthsString = `'[`;
    //          expired_months.forEach((expired_month) => {
    //     expired_monthsString += toMyString(expired_month).slice(1, -1);
    //     expired_monthsString += `,`;
    //   });
    //   expired_monthsString = expired_monthsString.slice(0, -1);
    //   expired_monthsString += "]'"; 
    //   // let expired_monthsString = `'[`;
            
           
    //         let id = await new Promise(function (resolve, reject) {
    //             db.query(
    //               `INSERT INTO fillial (name,address,merchant_id,who_created,inn,mfo,bank_name,nds,hisob_raqam,director_name,director_phone,percent_type,expired_months) VALUES('${name}',${toMyString(address)},'${merchant_id}','{"role":"${req.user.role}","id":${
    //                 req.user.id
    //               },"date": "${new Date().toISOString()}"}','${inn}','${mfo}','${bank_name}','${nds}','${hisob_raqam}','${director_name}','${director_phone}','${percent_type}',${expired_monthsString}) ;`,
    //               function (err, results, fields) {
    //                 console.log(">>>>>>....");
    //                 console.log(err);
    //                 if (err) {
    //                    resolve(null);
    //                     return null;;
    //                 }
    //                 console.log("++++", results);
    //                 if (results.insertId) {
    //                   resolve(results.insertId);
    //                 } else {
    //                    resolve(null);
    //                     return null;;
    //                 }
    //               }
    //             );
    //           });

    //       return  res.status(201).json({
    //             "message": "Fillial is created successfully",
    //             id
    //         });
    //     } catch (error) {
    //         return next(new InternalServerError(500, error));
    //     }
    // }
    
    async getbyId(req, res, next) {
      try {
          if (req.user.role != "SuperAdmin" ) {
              return next(
                  new ForbiddenError(
                      403,
                      "You do not have permission to access this resource"
                  )
              );
          }
          
          let admin = await new Promise(function (resolve, reject) {
            db.query(
              `SELECT * FROM Admin WHERE id=${req.params.id};`,
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
          res.status(200).json({data:admin});
      } catch (error) {
          console.log(error);
          return next(new InternalServerError(500,  error));
      }
  }
    // async getAll(req, res, next) {
    //     try {
    //         if (!(req.user.role == "SuperAdmin" || req.user.role == "Admin")) {
    //             return next(
    //                 new ForbiddenError(
    //                     403,
    //                     "You do not have permission to access this resource"
    //                 )
    //             );
    //         }
           
    //         let fillials = await new Promise(function (resolve, reject) {
    //           db.query(
    //             `SELECT * FROM merchant;`,
    //             function (err, results, fields) {
    //               if (err) {
    //                  resolve(null);
    //                     return null;;
    //               }
    //               console.log("++++", results);
    //               if (results.length != 0) {
    //                 resolve(results);
    //               } else {
    //                 resolve(null);
    //               }
    //             }
    //           );
    //         });
    //         res.status(200).json({data:fillials});
    //     } catch (error) {
    //         console.log(error);
    //         return next(new InternalServerError(500,  error));
    //     }
    // }

}

module.exports = new Admin();