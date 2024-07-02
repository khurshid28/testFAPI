const Super = require("../models/Super.js");
const cryptoRandomString = require("secure-random-string");
const {
    InternalServerError,
    ForbiddenError,
    BadRequestError,
    NotFoundError,
} = require("../utils/errors.js");


let db = require("../config/db")

class SuperAdmin {
    async getAllSuper(req, res, next) {
        try {
            if (req.user.role !== "SuperAdmin") {
                return next(
                    new ForbiddenError(
                        403,
                        "You do not have permission to access this resource"
                    )
                );
            }
            const supers = await Super.find({ work_status: { $not: "deleted" } });
            return res.status(200).send(supers);
        } catch (error) {
            return next(new InternalServerError(500,  error));
        }
    }
    async getSuper(req, res, next) {
        try {
            if (req.user.role !== "SuperAdmin") {
                return next(
                    new ForbiddenError(
                        403,
                        "You do not have permission to access this resource"
                    )
                );
            }
            const superr = await Super.findById(req.params.id);
            return res.status(200).send(superr);
        } catch (error) {
            return next(new InternalServerError(500,  error));
        }
    }
    async createSuper(req, res, next) {
        try {

            // const {
            //     fullName,
            //     phoneNumber,
            //     age,
            //     gender
            // } = req.body;
           

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

            // let SuperAdmin = await Super.create({
            //     loginName,
            //     loginPassword,
            //     fullName,
            //     phoneNumber,
            //     description,
            // });



         let id = await new Promise(function (resolve, reject) {
              let KEYS =Object.keys(req.body).join().replaceAll("ʻ", "'")
              let VALUES =[]
              
              Object.values(req.body).forEach((el)=>{
               VALUES.push(`"${el}"`)
              })
             
                db.query(
                  `INSERT INTO SuperAdmin (${KEYS}) VALUES(${VALUES.join().replaceAll("ʻ", "'")}) ;`,
                  function (err, results, fields) {
                    if (err) {
                        resolve(null);
                        return null;;
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
            let  user = await new Promise(function (resolve, reject) {
                db.query(
                  `SELECT * from SuperAdmin WHERE id=${id}`,
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

            return res.status(201).json({ data:user,message:"SuperAdmin is created successfully" });
        } catch (error) {
            console.log(error.message)
            return next(new InternalServerError(500,  error));
        }
    }
    async updateSuper(req, res, next) {
        try {
            if (req.superr.role !== "SuperAdmin") {
                return next(
                    new ForbiddenError(
                        403,
                        "You do not have permission to access this resource"
                    )
                );
            }
            const {
                fullName,
                phoneNumber,
                email,
                birthDate,
                gender,
                address,
                description,
            } = req.body;
            let image = req.file ? req.file.filename : null; // use null if no file was uploaded

            const superr = await Super.findById(req.params.id);
            if (!superr) {
                return next(new NotFoundError(404, "Super admin not found"));
            }

            superr.imageUrl = image ? image : superr.imageUrl;
            superr.fullName = fullName || superr.fullName;
            superr.phoneNumber = phoneNumber || superr.phoneNumber;

            superr.birthDate = birthDate || superr.birthDate;
            superr.gender = gender || superr.gender;
            superr.address = address || superr.address;
            superr.description = description || superr.description;

            await superr.save();

            return res
                .status(200)
                .send({ message: "Successfully updated", data: superr });
        } catch (error) {
            return next(new InternalServerError(500,  error));
        }
    }
    async deleteUser(req, res, next) {
        try {
            if (req.user.role !== "SuperAdmin") {
                return next(
                    new ForbiddenError(
                        403,
                        "You do not have permission to access this resource"
                    )
                );
            }

            const superr = await Super.findById(req.params.id);
            if (!superr) {
                return next(new NotFoundError(404, "Super not found!"));
            }

            await Super.deleteOne({ _id: req.params.id });

            return res.status(200).send({ message: "Super deleted" });
        } catch (error) {
            return next(new InternalServerError(500,  error));
        }
    }
}

module.exports = new SuperAdmin();