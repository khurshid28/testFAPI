const User = require("../models/User.js");
const Merchant = require("../models/Merchant.js");

const { InternalServerError, ForbiddenError, BadRequestError } = require("../utils/errors.js");
const cryptoRandomString = require("secure-random-string");
let PREMIUM =require("../../Premium-Query").PREMIUM
let db =require("../config/db")

class Users {
    async getAllUsers(req, res, next) {
        try {
            if (req.user.role === "user") {
                return next(
                    new ForbiddenError(
                        403,
                        "You do not have permission to access this resource"
                    )
                );
            }
            let { merchant_id } = req.params
            const users = await User.find({ merchant_id, work_status: { $not: "deleted" } });
            return res.status(200).send(users);
        } catch (error) {
            return next(new InternalServerError(500,  error));
        }
    }
    async getUser(req, res, next) {
        try {
            if (req.user.role !== "super_admin") {
                return next(
                    new ForbiddenError(
                        403,
                        "You do not have permission to access this resource"
                    )
                );
            }
            const user = await User.findById(req.params.id);
            return res.status(200).send(user);
        } catch (error) {
            return next(new InternalServerError(500,  error));
        }
    }
    async createUser(req, res, next) {
        try {

            console.log("KKK");
            console.log(req.user.role);
            if (req.user.role === "User") {
                return next(
                    new ForbiddenError(
                        403,
                        "You do not have permission to access this resource"
                    )
                );
            }


            // const {
            //     fullName,
            //     phoneNumber,
            //     merchant_id,
            //     fillial_id,
            //     gender,
            //     address,
            //     age,
            //     work_status
            // } = req.body;


            // Generate random login name and password
            
            if (!req.body.loginName) {
                const loginName = cryptoRandomString({ length: 10 });
                req.body.loginName= loginName
            }
            if (!req.body.loginPassword) {
                const loginPassword = cryptoRandomString({ length: 15 });
                req.body.loginPassword= loginPassword
            }
           
            

            req.body.who_created= {"role":req.user.role,"id":req.user.id }

       
            let id = await new Promise(function (resolve, reject) {
                let data = req.body;
                let KEYS = [];
                let VALUES = [];
                console.log(VALUES);
                for (let [key, value] of Object.entries(data)) {
                  KEYS.push(`${key}`);
              
                  if (key != "address" && key != "who_created") {
                    value = `${value}`;
                    value = value.replaceAll("ʻ", "'");
                    // VALUES.push(`"${value}"`);
                    VALUES.push(value)
                  } else {
                    VALUES.push(toMyString(value));
                  }
                }
                console.log(">>>>");
                // console.log(KEYS.join());
                console.log(">>>>");
                console.log(VALUES);
                 `INSERT INTO User (${KEYS.join()}) VALUES (${VALUES.map(function (val, index) {
                  return "?";
              }).join(",") }`,[...(VALUES)];


                  db.query(

                    // PREMIUM.insertUserFunc(req.body),[],
                    `INSERT INTO User (${KEYS.join()}) VALUES (${VALUES.map(function (val, index) {
                        return "?";
                    }).join(",") })`,VALUES,

                    function (err, results, fields) {
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
                      }
                    }
                  );
                });

            

            // if (req.user.role === "admin") {
            //     let merchant = await Merchant.findOne({ "_id": req.user.merchant_id });
            //     if (!merchant) {
            //         return next(
            //             new BadRequestError(
            //                 404,
            //                 "Merchant not found"
            //             )
            //         );
            //     } else {
            //         if (merchant.type == "Agent") {
            //             return next(
            //                 new BadRequestError(
            //                     400,
            //                     "You are agent,you do not have permission to access this resource"
            //                 )
            //             );
            //         } else {
            //             const existingUser = await User.exists({ phoneNumber });
            //             if (existingUser) {
            //                 return next(
            //                     new BadRequestError(
            //                         400,
            //                         "This phone number already exists"
            //                     )
            //                 );
            //             }

            //             let user = await User.create({
            //                 loginName,
            //                 loginPassword,
            //                 merchant_id,
            //                 fillial_id,
            //                 // imageUrl,
            //                 fullName,
            //                 phoneNumber,
            //                 age,
            //                 gender,
            //                 address,
            //                 "who_created": req.user.id,
            //                 work_status,
            //             });

            //             return res.status(201).json({
            //                 "message": "user is created successfully",
            //                 user,
            //             }, );
            //         }
            //     }
            // }

            // const existingUser = await User.exists({ phoneNumber });
            // if (existingUser) {
            //     return next(
            //         new BadRequestError(
            //             400,
            //             "This phone number already exists"
            //         )
            //     );
            // }

            // let user = await User.create({
            //     loginName,
            //     loginPassword,
            //     merchant_id,
            //     fillial_id,
            //     // imageUrl,
            //     fullName,
            //     phoneNumber,
            //     age,
            //     gender,
            //     address,
            //     "who_created": req.user.id,
            //     work_status,
            // });

            if(!id){
                return next(new BadRequestError(400,  error)); 
            }
            let  user = await new Promise(function (resolve, reject) {
                db.query(
                  `SELECT * from User WHERE id=${id}`,
                  function (err, results, fields) {
                    if (err) {
                        resolve(null);
                        return null;;
                    }
                    if (results) {
                      resolve(results[0]);
                    } else {
                        resolve(null);
                        return null;;
                    }
                  }
                );
              });
            return res.status(201).json({
                data:user,
                "message": "User is created successfully",
               
            }, 
        );
        } catch (error) {
            // console.log(error)
            return next(new InternalServerError(500,  error));
        }
    }
    async updateUser(req, res, next) {
        try {
            if (req.user.role !== "super_admin") {
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

                gender,
                address,

                work_status,
            } = req.body;
            let image = req.file ? req.file.filename : null; // use null if no file was uploaded

            const user = await User.findById(req.params.id);
            if (!user) {
                return next(new NotFoundError(404, "User not found"));
            }

            user.imageUrl = image ? image : user.imageUrl;
            user.fullName = fullName || user.fullName;
            user.phoneNumber = phoneNumber || user.phoneNumber;
            user.gender = gender || user.gender;
            user.address = address || user.address;
            user.work_status = work_status || user.work_status;

            await user.save();

            return res
                .status(200)
                .send({ message: "Successfully updated", data: user });
        } catch (error) {
            return next(new InternalServerError(500,  error));
        }
    }
    async deleteUser(req, res, next) {
        try {
            if (req.user.role !== "super_admin") {
                return next(
                    new ForbiddenError(
                        403,
                        "You do not have permission to access this resource"
                    )
                );
            }

            const user = await User.findById(req.params.id);
            if (!user) {
                return next(new NotFoundError(404, "User not found!"));
            }

            await User.deleteOne({ _id: req.params.id });

            return res.status(200).send({ message: "User deleted" });
        } catch (error) {
            return next(new InternalServerError(500,  error));
        }
    }
}
function toMyString(ob) {
    let result = `{`;
    let li = [];
    for (let [key, value] of Object.entries(ob)) {
      value = `${value}`;
      value= value.replaceAll("ʻ", "'");
      li.push(`"${key}":"${value}"`);
    }
    result += li.join();
    if (ob.role) {
      result += `,"date": "${new Date().addHours(5).toISOString()}"`;
    }
    result = result + `}`;
    return result;
    // return JSON.parse(result);
  }
module.exports = new Users();