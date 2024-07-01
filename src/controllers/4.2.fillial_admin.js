const cryptoRandomString = require("secure-random-string");
const {
    InternalServerError,
    ForbiddenError,
    NotFoundError,
} = require("../utils/errors.js");


let db = require("../config/db")

class FillialAdmin {
   
    async create(req, res, next) {
        try {

            const {
                fullName,
                phoneNumber,
                gender
            } = req.body;
           

            const loginName = cryptoRandomString({ length: 10 });
            const loginPassword = cryptoRandomString({ length: 15 });

            req.body.loginName= loginName
            req.body.loginPassword= loginPassword

            let  fillial = await new Promise(function (resolve, reject) {
                db.query(
                  `SELECT * from Fillial WHERE id=${req.body.fillial_id}`,
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
        

        req.body.merchant_id = fillial.merchant_id
          
         let id = await new Promise(function (resolve, reject) {
              let KEYS =Object.keys(req.body).join().replaceAll("ʻ", "'")
              let VALUES =[]
              
              Object.values(req.body).forEach((el)=>{
               VALUES.push(`"${el}"`)
              })
              console.log(KEYS);
              console.log(VALUES);
                db.query(
                  `INSERT INTO FillialAdmin (${KEYS}) VALUES(${VALUES.join().replaceAll("ʻ", "'")}) ;`,
                  function (err, results, fields) {
                    if (err) {
                        resolve(null);
                        return null;;
                    }
                    console.log(err);
                    console.log("++++", results);
                    if (results.insertId) {
                      resolve(results.insertId);
                    } else {
                        resolve(null);
                        return null;;
                    }
                  }
                );
              });

            let  user = await new Promise(function (resolve, reject) {
                db.query(
                  `SELECT * from FillialAdmin WHERE id=${id}`,
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

            return res.status(201).json({ data:user,message:"Fillial Admin is created successfully" });
        } catch (error) {
            console.log(error.message)
            return next(new InternalServerError(500,  error));
        }
    }

    
    async getAll(req, res, next) {
        try {
         if (!(req.user.role === "Admin" || req.user.role === "FillialAdmin")) {
            return next(
                new ForbiddenError(
                  403,
                  "You do not have permission to access this resource"
                )
              );
         }
           

            let  FillialAdmins = await new Promise(function (resolve, reject) {
                db.query(
                  `SELECT * from FillialAdmin`,
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
        

              

          
         

           
            return res.status(200).json({ data: FillialAdmins });
        } catch (error) {
            console.log(error.message)
            return next(new InternalServerError(500,  error));
        }
    }
   
}

module.exports = new FillialAdmin();