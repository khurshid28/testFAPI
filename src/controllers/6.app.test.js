const {
    InternalServerError,
    ForbiddenError,
    NotFoundError,
    BadRequestError,
  } = require("../utils/errors.js");
  
  let db = require("../config/db");
 
  let axios = require("axios");
  let bot = require("../bot/bot");
  
  const fs = require("fs");
  const path = require("path");
  
  class AppTest {
    async update1(req, res, next) {
      try {
        let { fullname, passport, pinfl } = req.body;
        req.body.user_id = req.user.id;
        let user = await new Promise(function (resolve, reject) {
          db.query(
            `Select * from User WHERE id=${req.user.id}`,
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
        req.body.merchant_id = user.merchant_id;
        req.body.fillial_id = user.fillial_id;
  
        let id = await new Promise(function (resolve, reject) {
          db.query(update1ZayavkaFunc(req.body), function (err, results, fields) {
            console.log(err);
            if (err) {
              resolve(null);
              return null;
            }
            console.log(err);
            if (results.insertId) {
              resolve(results.insertId);
            } else {
              resolve(null);
              return null;
            }
          });
        });
  
        let zayavka = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from TestZayavka WHERE id=${id}`,
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
  
        res.status(201).json({
          data: zayavka,
          message: "Update 1 is done and Zayavka is created Successfully",
        });
      } catch (error) {
        console.log(error.message);
        return next(new InternalServerError(500, error));
      }
    }
    async update2(req, res, next) {
      try {
        let {
          id,
          fullname,
          phoneNumber,
          phoneNumber2,
          cardNumber,
          passport_date,
          passport_by,
          address,
          region_id,
        } = req.body;
        fullname = `${fullname}`;
        fullname = fullname.replaceAll("ʻ", "'");
        passport_by = passport_by.replaceAll("ʻ", "'");
        console.log(req.body);
        await new Promise(function (resolve, reject) {
          db.query(
            update2ZayavkaFunc(req.body),
            [
              2,
              phoneNumber,
              phoneNumber2,
              cardNumber,
              passport_date,
              passport_by,
              JSON.stringify(address),
              region_id,
              id,
            ],
            function (err, results, fields) {
              console.log(err);
              if (err) {
                resolve(null);
                return null;
              }
  
              resolve(results);
            }
          );
        });
  
        let zayavkaUpdated = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from TestZayavka WHERE id=${req.body.id}`,
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
  
        return res.status(200).json({
          data: zayavkaUpdated,
          message: "Update 2 is done",
        });
      } catch (error) {
        console.log("error");
        console.log(error);
        return next(new InternalServerError(500, error));
      }
    }
    async update3(req, res, next) {
      try {
        let {
          id,
          max_amount,
          selfie_with_passport,
          cardNumber,
          birthDate,
          IdentificationVideoBase64,
        } = req.body;
       console.log({
        id,
        max_amount,
        // selfie_with_passport,
        cardNumber,
        birthDate,
        // IdentificationVideoBase64,
      });
        let zayavka = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from TestZayavka WHERE id=${req.body.id}`,
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
        // let fillial = await new Promise(function (resolve, reject) {
        //   db.query(
        //     `SELECT * from fillial WHERE id=${zayavka.fillial_id}`,
        //     function (err, results, fields) {
        //       if (err) {
        //         resolve(null);
        //         return null;
        //       }
        //       if (results.length != 0) {
        //         resolve(results[0]);
        //       } else {
        //         resolve(null);
        //       }
        //     }
        //   );
        // });
        // console.log(fillial);
  
        //  fillial.expired_months =[
        //   {
        //       "month" :12,
        //       "percent" :41,
        //   },
        //    {
        //       "month" :9,
        //       "percent" :34,
        //   },
        //    {
        //       "month" :6,
        //       "percent" :30,
        //   },
        //   ];
        // let arr = fillial.expired_months.map((obj) => {
        //   return `${obj.month}`;
        // });
  
        // var largest = Math.max.apply(0, arr);
        // console.log(largest);
        // let val = fillial.expired_months[arr.indexOf(`${largest}`)];
        // for (let index = 0; index < 20; index++) {
        //   console.log(">>>>>>>>>>>>>>>");
        //   console.log(Math.floor(max_amount * (1 + val["percent"] / 100)));
        // }
        // console.log(val);
  
        let alldata = {
          orderId: "PPDTEST-" + zayavka.id,
        //   amount: Math.floor(max_amount * (1 + val["percent"] / 100)),
          amount: max_amount,
          duration: "12",
          term: "12",
          passSeria: zayavka.passport.substring(0, 2),
          passNumber: zayavka.passport.substring(2),
          birthDate: birthDate,
          phoneNumber: zayavka.phoneNumber,
          phoneNumber2: zayavka.phoneNumber2,
          cardNumber: cardNumber,
          inn: process.env.PREMIUM_INN,
          // inn : 200655453,
          selfie: selfie_with_passport.substring(0, 30),
          identificationVideoBase64: IdentificationVideoBase64.substring(0, 30),
        };
  
        fs.appendFile(
          path.join(__dirname, "output_test.txt"),
          `\n ${Date().toString()}` + " >> " + JSON.stringify(alldata),
          (err) => {
            if (err)
              throw {
                err,
                type: "file",
              };
          }
        );
  
        // return next(new InternalServerError(500, error));
        let url1 = process.env.DAVR_TEST_BASE_URL + process.env.DAVR_LOGIN;
        let url2 = process.env.DAVR_TEST_BASE_URL + process.env.DAVR_SCORING;
        
        const response1 = await axios.post(
          url1,
          {
            username: process.env.DAVR_TEST_USERNAME,
            password: process.env.DAVR_TEST_PASSWORD,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        var filePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "myid",
          `${zayavka.passport}.png`
        );
        if (fs.existsSync(filePath)) {
          console.log(filePath);
          var bitmap = fs.readFileSync(filePath);
          const encoded = Buffer(bitmap).toString("base64");
          IdentificationVideoBase64 = `data:image/jpeg;base64,${encoded}`;
          console.log("IdentificationVideoBase64 : " + IdentificationVideoBase64);
        }
  
        if (!IdentificationVideoBase64 || IdentificationVideoBase64 == null) {
          return next(
            new InternalServerError(500, "IdentificationVideoBase64 error")
          );
        }
  
        const response2 = await axios.post(
          url2,
          {
            orderId: "PPDTEST-" + zayavka.id,
            // amount: Math.floor(max_amount * (1 + val["percent"] / 100)),
            amount: max_amount,
            term: "12",
            duration: "12",
            passSeria: zayavka.passport.substring(0, 2),
            passNumber: zayavka.passport.substring(2),
            birthDate: birthDate,
            phoneNumber: zayavka.phoneNumber.substring(1),
            phoneNumber2: zayavka.phoneNumber2.substring(1),
            cardNumber: cardNumber,
            // inn: process.env.PREMIUM_INN,
            // inn: "200655453",
            // inn: "303107528", elma
            // inn:"303085034", // javohir
            // inn: "305207299", // surat
            // inn: "310187940",  // ... working
            // inn : 200655453,
            // inn: 303085034,
            inn :305207299,
            // inn:303085034, //surat 
            identificationVideoBase64: IdentificationVideoBase64,
            selfie: selfie_with_passport,
          },
          {
            headers: {
              Authorization: "Bearer " + response1.data["token"],
              "Content-Type": "application/json",
            },
          }
        );
  
        console.log(response2.data);
  
        await new Promise(function (resolve, reject) {
          db.query(
            update3ZayavkaFunc({
              ...req.body,
            //   payment_amount: Math.floor(max_amount * (1 + val["percent"] / 100)),
            }),
            function (err, results, fields) {
              console.log(err);
              if (err) {
                return resolve(null);
                return null;
              }
              resolve(results);
            }
          );
        });
  
        let zayavkaUpdated = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from TestZayavka WHERE id=${id}`,
            function (err, results, fields) {
              console.log(err);
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
        
        // let t1 = setTimeout(async function () {
        //   let Updatedzayavka = await new Promise(function (resolve, reject) {
        //     db.query(
        //       `SELECT * from TestZayavka WHERE id=${id}`,
        //       function (err, results, fields) {
        //         if (err) {
        //           console.log(err);
        //           resolve(null);
        //           return null;
        //         }
        //         if (results.length != 0) {
        //           resolve(results[0]);
        //         } else {
        //           resolve(null);
        //         }
        //       }
        //     );
        //   });
        //   if (Updatedzayavka) {
        //     if (Updatedzayavka.status == "progress" && Updatedzayavka.step == 3) {
  
        //       try {
        //         var filePath = path.join(
        //           __dirname,
        //           "..",
        //           "..",
        //           "public",
        //           "myid",
        //           `${Updatedzayavka.passport}.png`
        //         );
        //         // bot.sendMessage(
        //         //   "-4009277227",
        //         //   `<b>MESSAGE : ⚠️ KUTISH VAQTI 4 daqiqadan oshdi\nID: PPDTEST-${id} \nFULLNAME: ${Updatedzayavka.fullname}\n</b>`,
        //         //   {
        //         //     parse_mode: "HTML",
        //         //   }
        //         // );
                
        //         bot.sendPhoto( "-4009277227",filePath,{
        //           parse_mode: "HTML",
        //           caption:`<b>MESSAGE : ⚠️ KUTISH VAQTI 4 daqiqadan oshdi\nID: PPDTEST-${Updatedzayavka.id} \nFULLNAME: ${Updatedzayavka.fullname}\nADDRESS: ${Updatedzayavka.address.home}\n</b>`,
        //         })
        //       } catch (error) {
        //         bot.sendMessage(2053690211, `${error}`);
        //       }
        //     }
        //   }
        //   clearTimeout(t1);
        // }, 240 * 1000);
  
        return res.status(200).json({
          data: zayavkaUpdated,
          message: "Update 3 is done",
        });
      } catch (error) {
        console.log("update 3");
        console.log(error);
        return next(new InternalServerError(500, error));
      }
    }
    

    async update5(req, res, next) {
      try {
        let zayavkaOld = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from TestZayavka WHERE id=${req.body.id}`,
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
        let fillial = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from fillial WHERE id=${zayavkaOld.fillial_id}`,
            function (err, results, fields) {
              if (err) {
                console.log(err);
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
        console.log(zayavkaOld);
        console.log(fillial);
        await new Promise(function (resolve, reject) {
          db.query(update5ZayavkaFunc({
            ...req.body,
            type: fillial.percent_type
          }), function (err, results, fields) {
            console.log(err);
            if (err) {
              return resolve(null);
              return null;
            }
  
            resolve(results);
          });
        });
  
        let zayavka = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from TestZayavka WHERE id=${req.body.id}`,
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
  
        return res.status(200).json({
          data: zayavka,
          message: "Update 5 is done",
        });
      } catch (error) {
        console.log(error);
        return next(new InternalServerError(500, error));
      }
    }
    async update6(req, res, next) {
      try {
        let zayavkaOld = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from TestZayavka WHERE id=${req.body.id}`,
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
        let fillial = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from fillial WHERE id=${zayavkaOld.fillial_id}`,
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
        await new Promise(function (resolve, reject) {
          db.query(update6ZayavkaFunc({
            ...req.body,
            type: fillial.percent_type
          }), function (err, results, fields) {
            if (err) {
              return resolve(null);
              return null;
            }
            resolve(results);
          });
        });
  
        let zayavka = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from TestZayavka WHERE id=${req.body.id}`,
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
  
        return res.status(200).json({
          data: zayavka,
          message: "Update 6 is done",
        });
      } catch (error) {
        console.log(error.message);
        return next(new InternalServerError(500, error));
      }
    }
    async update7(req, res, next) {
      try {
        console.log(req.body);
        await new Promise(function (resolve, reject) {
          db.query(
            update7ZayavkaFunc(req.body),
            function (err, results, fields) {
              console.log(err);
              if (err) {
                return resolve(null);
                return null;
              }
  
              resolve(results);
            }
          );
        });
  
        let zayavka = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from TestZayavka WHERE id=${req.body.id}`,
            function (err, results, fields) {
              console.log(err);
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
       console.log(">>>> zayavka");
       console.log(zayavka);
        return res.status(200).json({
          data: zayavka,
          message: "Update 7 is done Successfully",
        });
      } catch (error) {
        console.log(error.message);
        return next(new InternalServerError(500, error));
      }
    }
  
    async updateFinish(req, res, next) {
      try {
        let url1 = process.env.DAVR_TEST_BASE_URL + process.env.DAVR_LOGIN;
        let url2 = process.env.DAVR_TEST_BASE_URL + process.env.DAVR_AGREEMENT;
        let { contractPdf, id,term } = req.body;
        let date = new Date();
        let singedAt = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;
        console.log(singedAt);
        const response1 = await axios.post(
          url1,
          {
            username: process.env.DAVR_TEST_USERNAME,
            password: process.env.DAVR_TEST_PASSWORD,
          },
  
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        let zayavka1 = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from TestZayavka WHERE id=${id}`,
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
        //   console.log({ "orderId": `PPDTEST-${zayavka1.id}`,
        //   "term": "12",
        //   singedAt,
        //   "oferta":true,
        // });
        const response2 = await axios.post(
          url2,
          {
            orderId: `PPDTEST-${id}`,
            term: `${zayavka1.expired_month}`,
            oferta: true,
            amount: zayavka1.payment_amount,
            contractPdf: contractPdf,
            
          },
          {
            headers: {
              Authorization: "Bearer " + response1.data["token"],
              "Content-Type": "application/json",
            },
          }
        );
  
        console.log(response2.data);
  
        await new Promise(function (resolve, reject) {
          db.query(updateFinishZayavkaFunc(req.body), function (err, results, fields) {
            if (err) {
              return resolve(null);
              return null;
            }
  
            resolve(results);
          });
        });
  
        let zayavka = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from TestZayavka WHERE id=${req.body.id}`,
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
  
        return res.status(200).json({
          data: zayavka,
          message: "Update  is Finished , oferta is sent ",
        });
      } catch (error) {
        console.log(error);
        return next(new InternalServerError(500, error));
      }
    }
  
    async cancel_by_client(req, res, next) {
      try {
        await new Promise(function (resolve, reject) {
          db.query(
            cancelByClientZayavkaFunc(req.body),
            function (err, results, fields) {
              if (err) {
                return resolve(null);
                return null;
              }
  
              resolve(results);
            }
          );
        });
  
        let zayavka = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from TestZayavka WHERE id=${req.body.id}`,
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
  
        return res.status(200).json({
          data: zayavka,
          message: "Zayavka is canceled by client",
        });
      } catch (error) {
        console.log(error);
        return next(new InternalServerError(500, error));
      }
    }
    async getPercents(req, res, next) {
      try {
        let { fillial_id } = req.params;
  
        let fillial = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from fillial WHERE id=${fillial_id}`,
            function (err, results, fields) {
              if (err) {
                resolve(null);
                return null;
              } else if (results.length != 0) {
                return resolve(results[0]);
              } else {
                return resolve(null);
              }
            }
          );
        });
  
        return res.status(200).json({
          data: fillial.expired_months,
          type: fillial.percent_type,
        });
      } catch (error) {
        console.log(error);
        return next(new InternalServerError(500, error));
      }
    }
    async getAll(req, res, next) {
      try {
        let zayavkalar;
  
        if (req.user.role === "User") {
          zayavkalar = await new Promise(function (resolve, reject) {
            db.query(
              `SELECT * from TestZayavka WHERE user_id=${req.user.id} AND step > 0 ORDER BY id DESC `,
              function (err, results, fields) {
                if (err) {
                  resolve(null);
                  return null;
                }
                return resolve(results);
              }
            );
          });
        } else if (req.user.role === "SuperAdmin") {
          zayavkalar = await new Promise(function (resolve, reject) {
            db.query(
              `SELECT Zayavka.*,json_object("name",fillial.name,"work_status",fillial.work_status,"created_time",fillial.created_time,"address",fillial.address,"admin_id",fillial.admin_id,"nds",fillial.nds,"hisob_raqam",fillial.hisob_raqam,"bank_name",fillial.bank_name,"mfo",fillial.mfo,"inn",fillial.inn,"director_name",fillial.director_name,"director_phone",fillial.director_phone,"percent_type",fillial.percent_type,"expired_months",fillial.expired_months) as fillial,(case when fillial.admin_id is null then null else json_object("fullName",Admin.fullName,"phoneNumber",Admin.phoneNumber) end) as admin from TestZayavka,fillial,Admin WHERE  Zayavka.fillial_id=fillial.id and (case when fillial.admin_id is null then Admin.id=1 else fillial.admin_id=Admin.id end ) ORDER BY Zayavka.id DESC`,
              function (err, results, fields) {
                console.log(err);
                if (err) {
                  resolve(null);
                  return null;
                }
                resolve(results);
              }
            );
          });
        } else if (req.user.role === "FillialAdmin") {
          let user = await new Promise(function (resolve, reject) {
            db.query(
              `SELECT * from FillialAdmin WHERE id=${req.user.id}`,
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
          console.log(user);
          zayavkalar = await new Promise(function (resolve, reject) {
            db.query(
              `SELECT * from TestZayavka WHERE fillial_id='${user.fillial_id}' ORDER BY id DESC `,
              function (err, results, fields) {
                if (err) {
                  resolve(null);
                  return null;
                }
                return resolve(results);
              }
            );
          });
        } else if (req.user.role === "Accountant") {
          zayavkalar = await new Promise(function (resolve, reject) {
            db.query(
              `SELECT Zayavka.*,json_object("name",fillial.name,"work_status",fillial.work_status,"created_time",fillial.created_time,"address",fillial.address,"admin_id",fillial.admin_id,"nds",fillial.nds,"hisob_raqam",fillial.hisob_raqam,"bank_name",fillial.bank_name,"mfo",fillial.mfo,"inn",fillial.inn,"director_name",fillial.director_name,"director_phone",fillial.director_phone,"percent_type",fillial.percent_type,"expired_months",fillial.expired_months) as fillial,(case when fillial.admin_id is null then null else json_object("fullName",Admin.fullName,"phoneNumber",Admin.phoneNumber) end) as admin from TestZayavka,fillial,Admin WHERE (status="finished" or status="paid" ) and Zayavka.fillial_id=fillial.id and (case when fillial.admin_id is null then Admin.id=1 else fillial.admin_id=Admin.id end ) ORDER BY Zayavka.id DESC`,
              function (err, results, fields) {
                console.log(err);
                if (err) {
                  resolve(null);
                  return null;
                }
                resolve(results);
              }
            );
          });
          // console.log(user);
          // zayavkalar = await new Promise(function (resolve, reject) {
          //   db.query(
          //     `SELECT * from TestZayavka WHERE fillial_id='${user.fillial_id}' ORDER BY id DESC `,
          //     function (err, results, fields) {
          //       if (err) {
          //         resolve(null);
          //         return null;
          //       }
  
          //       return resolve(results);
          //     }
          //   );
          // });
        } else {
          console.log("keldi >>");
          let user = await new Promise(function (resolve, reject) {
            db.query(
              `SELECT *  from Admin WHERE id=${req.user.id} ORDER BY id DESC`,
              function (err, results, fields) {
                if (err) {
                  resolve(null);
                  return null;
                }
                return resolve(results[0]);
              }
            );
          });
          if (!user) {
            return next(new NotFoundError(404, "Admin Not Found"));
          }
  
          // let users = await new Promise(function (resolve, reject) {
          //   db.query(
          //     `SELECT * from User WHERE merchant_id=${user.merchant_id}`,
          //     function (err, results, fields) {
          //       if (err) {
          //          resolve(null);
          // return null;
          //       }
          //       return resolve(results);
          //     }
          //   );
          // });
          // if (!users) {
          //   return res.status(200).json({
          //     data: [],
          //   });
          // }
          // let condition = [];
          // users.forEach((u) => {
          //   condition.push(`user_id=${u.id}`);
          // });
          // condition = condition.join(` OR `);
  
          zayavkalar = await new Promise(function (resolve, reject) {
            db.query(
              `SELECT * from TestZayavka WHERE merchant_id=${user.merchant_id} ORDER BY id DESC`,
              function (err, results, fields) {
                if (err) {
                  resolve(null);
                  return null;
                }
                return resolve(results);
              }
            );
          });
        }
        return res.status(200).json({
          data: zayavkalar,
        });
      } catch (error) {
        console.log(error);
        return next(new InternalServerError(500, error));
      }
    }
    async getStatistics(req, res, next) {
      try {
        if (req.user.role === "SuperAdmin") {
        
      
          let data = [];
          let banks = ["Davr", "Hamkor", "Asaka", "QQB"];
      
    
          for await (let item of banks) {
           
            let zayavkalarUspeshna = await new Promise(function (resolve, reject) {
              db.query(
                `SELECT count(id) from TestZayavka where step=8 and bank='${item}'`,
                function (err, results, fields) {
                  if (err) {
                    console.log(err);
                    resolve(null);
                    
                  }
                   resolve(results);
                }
              );
            });
            
            let zayavkalarScoringOtkaz = await new Promise(function (
              resolve,
              reject
            ) {
              db.query(
                `SELECT count(id) from TestZayavka where status='canceled_by_scoring' and bank='${item}'`,
                function (err, results, fields) {
                  if (err) {
                    console.log(err);
                    resolve(null);
                     null;
                  }
                   resolve(results);
                }
              );
            });
            let zayavkalarClienttOtkaz = await new Promise(function (
              resolve,
              reject
            ) {
              db.query(
                `SELECT count(id) from TestZayavka where status='canceled_by_client' and bank='${item}'`,
                function (err, results, fields) {
                  if (err) {
                    console.log(err);
                    resolve(null);
              
                  }
                   resolve(results);
                }
              );
            });
    
            let zayavkalarTimeOtkaz = await new Promise(function (resolve, reject) {
              db.query(
                `SELECT count(id) from TestZayavka where status='canceled_by_daily' and bank='${item}'`,
                function (err, results, fields) {
                  if (err) {
                    console.log(err);
                    resolve(null);
                   
                  }
                   resolve(results);
                }
              );
            });
    
            console.log(zayavkalarUspeshna[0]["count(id)"]);
            console.log(zayavkalarClienttOtkaz[0]["count(id)"]);
            console.log(zayavkalarScoringOtkaz[0]["count(id)"]);
            console.log(zayavkalarTimeOtkaz[0]["count(id)"]);
    
            let getZayavka =
              zayavkalarUspeshna[0]["count(id)"] +
              zayavkalarClienttOtkaz[0]["count(id)"] +
              zayavkalarScoringOtkaz[0]["count(id)"] +
              zayavkalarTimeOtkaz[0]["count(id)"];
    
    
              let zayavkalarScoring = await new Promise(function (resolve, reject) {
                db.query(
                  `SELECT avg(scoring_end - scoring_start)/(60*1000) as avg,count(id) as count from TestZayavka where scoring_start is not null and scoring_end is not null and bank='${item}'`,
                  function (err, results, fields) {
                    if (err) {
                      console.log(err);
                      resolve(null);
                     
                    }
                     resolve(results);
                  }
                );
              });
         
            console.log("getZayavka>>", getZayavka);
            if (getZayavka) {
              let percentUspeshna = (zayavkalarUspeshna[0]["count(id)"] / getZayavka) * 100;
              let percentScoring = (zayavkalarScoringOtkaz[0]["count(id)"] / getZayavka) * 100;
              let percentClient = (zayavkalarClienttOtkaz[0]["count(id)"] / getZayavka) * 100;
              let percentTime = (zayavkalarTimeOtkaz[0]["count(id)"] / getZayavka) * 100;
              
              data.push({
                name: item,
                statistics: {
                  success: {
                    percent: percentUspeshna,
                    count: zayavkalarUspeshna[0]["count(id)"],
                  },
                  scoring_otkaz: {
                    percent: percentScoring,
                    count: zayavkalarScoringOtkaz[0]["count(id)"],
                  },
                  client_otkaz: {
                    percent: percentClient,
                    count: zayavkalarClienttOtkaz[0]["count(id)"],
                  },
                  time_otkaz: {
                    percent: percentTime,
                    count: zayavkalarTimeOtkaz[0]["count(id)"],
                  },
                },scoring : zayavkalarScoring[0]
    
              });
            } else {
              data.push({
                name: item,
                statistics: null,
                scoring: null
              });
            }
          }
    
          console.log(JSON.stringify(data));
        
          return res.status(200).json({
            data
          });
      }else{
        return next(new AuthorizationError(401, "No token provided"));
      }
      } catch (error) {
        console.log(error);
        return next(new InternalServerError(500, error));
      }
    }
  }
  
  function update1ZayavkaFunc(data) {
    let { user_id, merchant_id, fillial_id, fullname, passport, pinfl } = data;
    fullname = `${fullname}`;
    fullname = fullname.replaceAll("ʻ", "'");
    return `INSERT INTO TestZayavka (user_id,merchant_id,fillial_id,fullname,passport,pinfl) VALUES (${user_id},${merchant_id},${fillial_id},'${fullname}','${passport}','${
      pinfl ?? ""
    }') ; `;
  }
  
  function update2ZayavkaFunc(data) {
    let {
      id,
      phoneNumber,
      phoneNumber2,
      cardNumber,
      passport_by,
      passport_date,
      address,
      region_id,
    } = data;
  
    // passport_by = passport_by.replaceAll("ʻ", "'");
    // address = address.replaceAll("ʻ", "'");
    return `UPDATE TestZayavka SET step=?,phoneNumber=?,phoneNumber2=?,cardNumber=?,passport_date=?,passport_by=?,address=?,region_id=? WHERE id = ?`;
  }
  
  function update3ZayavkaFunc(data) {
    let { id, max_amount, payment_amount } = data;
    return `UPDATE TestZayavka SET step=3,max_amount='${max_amount}' WHERE id = ${id};`;
  }
  
  // function update4ZayavkaFunc(data) {
  //   let { id } = data;
  //   return `UPDATE TestZayavka SET step=4 WHERE id = ${id};`;
  // }
  
  function update5ZayavkaFunc(data) {

    let { id, products, location, device, amount,type } = data;
    let productsString = `'[`;
    products.forEach((product) => {
      productsString += toMyString(product).slice(1, -1);
      productsString += `,`;
    });
    productsString = productsString.slice(0, -1);
    productsString += "]'";
    console.log(productsString);

    if (type =="IN") {
      return `UPDATE TestZayavka SET step=5,payment_amount=${amount},products=${
        productsString ?? ""
      },location=${toMyString(location)},device=${toMyString(
        device
      )} WHERE id = ${id};`
    }else{
      return `UPDATE TestZayavka SET step=5,amount=${amount},products=${
        productsString ?? ""
      },location=${toMyString(location)},device=${toMyString(
        device
      )} WHERE id = ${id};`
    }
  }
  
  function update6ZayavkaFunc(data) {
    let { id, payment_amount, expired_month,type } = data;
    if (type =="IN") {
      return `UPDATE TestZayavka SET step=6,amount=${payment_amount},expired_month = ${expired_month} WHERE id = ${id};`;
 
    }else{
      return `UPDATE TestZayavka SET step=6,payment_amount=${payment_amount},expired_month = ${expired_month} WHERE id = ${id};`;
 
    }
   }
  
  function updateFinishZayavkaFunc(data) {
    let { id } = data;
    return `UPDATE TestZayavka SET step=8,agree = TRUE,status = 'finished',finished_time = CURRENT_TIMESTAMP WHERE id = ${id};`;
  }
  
  function update7ZayavkaFunc(data) {
    let { id } = data;
    return `UPDATE TestZayavka SET step=7,selfie='/static/images/zayavka${id}.jpg'  WHERE id = ${id};`;
  }
  
  function cancelByClientZayavkaFunc(data) {
    let { id, canceled_reason } = data;
    return `UPDATE TestZayavka SET status = 'canceled_by_client', finished_time = CURRENT_TIMESTAMP ,canceled_reason='${canceled_reason}' WHERE id = ${id}`;
  }
  
  function toMyString(ob) {
    if (!ob) {
      return "null";
    }
    let result = `'{`;
    let li = [];
    for (let [key, value] of Object.entries(ob)) {
      value = `${value}`;
      value = value.replaceAll("'", "ʻ");
      value = value.replaceAll('"', "ʻ");
      li.push(`"${key}":"${value}"`);
    }
    result += li.join();
    if (ob.role) {
      result += `,"date": "${new Date().addHours(5).toISOString()}"`;
    }
    result = result + `}'`;
    return result;
  }
  
  Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
  };
  
  module.exports = new AppTest();
  