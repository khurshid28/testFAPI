const Super = require("../models/Super.js");
const cryptoRandomString = require("secure-random-string");
const {
    InternalServerError,
    ForbiddenError,
    BadRequestError,
    NotFoundError,
} = require("../utils/errors.js");


let db = require("../config/db")

class Accountant {
    
    async pay(req, res, next) {
        try {

            let {
                id,
            } = req.body;
           

           


            // const existingUser = await Super.exists({ phoneNumber });
            // if (existingUser) {
            //     return next(
            //         new BadRequestError(
            //             400,
            //             "A super with the given phone number already exists"
            //         )
            //     );
            // }

            // let super_admin = await Super.create({
            //     loginName,
            //     loginPassword,
            //     fullName,
            //     phoneNumber,
            //     description,
            // });



          await new Promise(function (resolve, reject) {
          
                db.query(
                  `Update Zayavka SET status="paid" WHERE id=? ; `,
                  [id],
                  function (err, results, fields) {
                    console.log(err);
                    console.log(results);
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
        
            
            return res.status(200).json({ message:"it is paid successfully" });
        } catch (error) {
            console.log(error.message)
            return next(new InternalServerError(500,  error));
        }
    }
    async create(req, res, next) {
        try {

            let {
                fullName,
                phoneNumber,
            } = req.body;
           

            // Generate random login name and password
            const loginName = cryptoRandomString({ length: 10 });
            const loginPassword = cryptoRandomString({ length: 15 });

            req.body.loginName= loginName
            req.body.loginPassword= loginPassword


            // const existingUser = await Super.exists({ phoneNumber });
            // if (existingUser) {
            //     return next(
            //         new BadRequestError(
            //             400,
            //             "A super with the given phone number already exists"
            //         )
            //     );
            // }

            // let super_admin = await Super.create({
            //     loginName,
            //     loginPassword,
            //     fullName,
            //     phoneNumber,
            //     description,
            // });



         let id = await new Promise(function (resolve, reject) {
             
             
                db.query(
                  `INSERT INTO Accountant (loginName,loginPassword,fullName,phoneNumber) VALUES(?,?,?,?) ;`,
                  [loginName,loginPassword,fullName,phoneNumber],
                  function (err, results, fields) {
                    console.log(err);
                    console.log(results);
                    if (err) {
                        resolve(null);
                        return null;
                    }
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
            let  accountant = await new Promise(function (resolve, reject) {
                db.query(
                  `SELECT * from Accountant WHERE id=${id}`,
                  function (err, results, fields) {
                    console.log(err);
                    console.log(results);
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
            
            return res.status(201).json({ data:accountant,message:"Accountant is created successfully" });
        } catch (error) {
            console.log(error.message)
            return next(new InternalServerError(500,  error));
        }
    }
    // async updateSuper(req, res, next) {
    //     try {
    //         if (req.superr.role !== "super_admin") {
    //             return next(
    //                 new ForbiddenError(
    //                     403,
    //                     "You do not have permission to access this resource"
    //                 )
    //             );
    //         }
    //         const {
    //             fullName,
    //             phoneNumber,
    //             email,
    //             birthDate,
    //             gender,
    //             address,
    //             description,
    //         } = req.body;
    //         let image = req.file ? req.file.filename : null; // use null if no file was uploaded

    //         const superr = await Super.findById(req.params.id);
    //         if (!superr) {
    //             return next(new NotFoundError(404, "Super admin not found"));
    //         }

    //         superr.imageUrl = image ? image : superr.imageUrl;
    //         superr.fullName = fullName || superr.fullName;
    //         superr.phoneNumber = phoneNumber || superr.phoneNumber;

    //         superr.birthDate = birthDate || superr.birthDate;
    //         superr.gender = gender || superr.gender;
    //         superr.address = address || superr.address;
    //         superr.description = description || superr.description;

    //         await superr.save();

    //         return res
    //             .status(200)
    //             .send({ message: "Successfully updated", data: superr });
    //     } catch (error) {
    //         return next(new InternalServerError(500,  error));
    //     }
    // }
    // async deleteUser(req, res, next) {
    //     try {
    //         if (req.user.role !== "super_admin") {
    //             return next(
    //                 new ForbiddenError(
    //                     403,
    //                     "You do not have permission to access this resource"
    //                 )
    //             );
    //         }

    //         const superr = await Super.findById(req.params.id);
    //         if (!superr) {
    //             return next(new NotFoundError(404, "Super not found!"));
    //         }

    //         await Super.deleteOne({ _id: req.params.id });

    //         return res.status(200).send({ message: "Super deleted" });
    //     } catch (error) {
    //         return next(new InternalServerError(500,  error));
    //     }
    // }
}

module.exports = new Accountant();