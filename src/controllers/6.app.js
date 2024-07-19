const {
  InternalServerError,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} = require("../utils/errors.js");
let db = require("../config/db");
let pdfGenerator = require("../utils/pdf_generate");
let Fapi = require("../utils/fapi");
let axios = require("axios");
let bot = require("../bot/bot");
const botMessage = require("../utils/bot_messages.js");
const ejs = require("ejs"); // 3.1.8
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
let mime = require("mime");
const pdf_generate = require("../utils/pdf_generate");
const fapi = require("../utils/fapi");
let moment =require("moment")

const resizeImg = require("resize-image-buffer");
class App {
  async publicOferta(req, res, next) {
    // //  let result= await fapi.scoringSend("51505045320022");
    // await fapi.scoringCheck(result.data.contractId)

    // botMessage.sendCancelInfo('a',1,3)
    botMessage.sentScoringInfo(1, 2);
    try {
      let filepath = path.join(
        __dirname,
        "../",
        "../",
        "public",
        "docs",
        `public-oferta.pdf`
      );

      return res.sendFile(filepath);
    } catch (error) {
      console.log(error.message);
      return next(new InternalServerError(500, error));
    }
  }

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
      let myidData = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT * from MyId WHERE pass_seriya='${passport}'`,
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
      console.log(myidData);
      console.log("client ma'lumotlari topilmadi");
      if (!myidData) {
        return next(new NotFoundError(404, "client ma'lumotlari topilmadi"));
      }

      let id = await new Promise(function (resolve, reject) {
        db.query(
          update1ZayavkaFunc({
            ...req.body,
            birth_date: myidData.profile.common_data.birth_date,
          }),
          function (err, results, fields) {
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
          }
        );
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
        cardId,
      } = req.body;
      fullname = `${fullname}`;
      fullname = fullname.replaceAll("ʻ", "'");
      passport_by = passport_by.replaceAll("ʻ", "'");
      console.log(req.body);

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
      let fillial = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT * from fillial WHERE id=${zayavka.fillial_id}`,
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
      let result = await fapi.scoringSend(phoneNumber, zayavka.pinfl);

      botMessage.sentScoringInfo(zayavka, fillial);
      if (result.code != 0) {
        return next(new InternalServerError(500, result.message));
      }
      console.log(result);

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
            result.data.contractId,
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
        birthDate,
        IdentificationVideoBase64,
      } = req.body;
      console.log({
        id,
        max_amount,
        // selfie_with_passport,
        // cardNumber,
        birthDate,
        // IdentificationVideoBase64,
      });
      var filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "passports",
        `Zayavka-${req.body.id}.png`
      );
      base64_decode_passport(selfie_with_passport, filePath);
      let zayavka = await new Promise(function (resolve, reject) {
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
      let fillial = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT * from fillial WHERE id=${zayavka.fillial_id}`,
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
      try {
        for (let i = 0; 5 * i <= fillial.timeout; i++) {
          let timer1 = setTimeout(async () => {
            let zayavkaNew = await new Promise(function (resolve, reject) {
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
            if (zayavkaNew.status != "progress" || zayavkaNew.step > 3) {
              clearTimeout(timer1);
              return;
            }
            let scoringData = await fapi.scoringCheck(zayavka.contractId);
            // let scoringData = {
            //   code: 0,
            //   message: "Yaxshi",
            //   data: [
            //     {
            //       scoringId: 853,
            //       bankCode: "00439",
            //       bankName: "Premium Bank",
            //       state: "WAITING",
            //       limitAmount: 0,
            //     },
            //     {
            //       scoringId: 853,
            //       bankCode: "00439",
            //       bankName: "Premium Bank",
            //       state: "SUCCESS",
            //       limitAmount: 10000000,
            //     },
            //     {
            //       scoringId: 863,
            //       bankCode: "00439",
            //       bankName: "Premium Bank",
            //       state: "SUCCESS",
            //       limitAmount: 15000000,
            //     },
            //     {
            //       scoringId: 853,
            //       bankCode: "00439",
            //       bankName: "Premium Bank",
            //       state: "SUCCESS",
            //       limitAmount: 4000000,
            //     },
            //   ],
            // };

            if (scoringData.code != 0) {
              console.log(scoringData.message);
              return;
            }
            const resSuccess = scoringData.data.filter(
              (item) => item.state == "SUCCESS"
            );
            const resCancel = scoringData.data.filter(
              (item) => item.state == "CANCELED"
            );
            if (resSuccess.length > 0) {
              const maxLimit = resSuccess.reduce(function (prev, current) {
                return prev && prev.limitAmount > current.limitAmount
                  ? prev
                  : current;
              });
              fapi.sendLimitMessage(id, maxLimit.limitAmount);
              await new Promise(function (resolve, reject) {
                db.query(
                  `update TestZayavka set step=4,bank="Fapi",limit_summa=${maxLimit.limitAmount},bankName='${maxLimit.bankName}', bankCode=${maxLimit.bankCode},scoringId=${maxLimit.scoringId} where id=${id}`
                ),
                  function (err, results, fields) {
                    console.log(err);
                    if (err) {
                      return resolve(null);
                      return null;
                    }
                    resolve(results);
                  };
              });
            }
            if (resCancel.length == scoringData.data.length) {
              let canceled_reason =
                resCancel.length > 0
                  ? resCancel[0]["canceled_reason"]
                  : "TIMEOUT";

              fapi.sendCancelMessage(id);
              botMessage.sendCancelInfo(zayavka, fillial, canceled_reason);
              await new Promise(function (resolve, reject) {
                db.query(
                  `update TestZayavka set status="canceled_by_scoring",canceled_reason='${canceled_reason}' where id=${id}`
                ),
                  function (err, results, fields) {
                    console.log(err);
                    if (err) {
                      return resolve(null);
                      return null;
                    }
                    resolve(results);
                  };
              });
            }
            if (5 * (i + 1) > fillial.timeout) {
              const res = scoringData.data.filter(
                (item) => item.state != "WAITING"
              );
              let canceled_reason =
                res.length > 0 ? res[0]["canceled_reason"] : "TIMEOUT";
              fapi.sendCancelMessage(id);
              botMessage.sendCancelInfo(zayavka, fillial, canceled_reason);
              await new Promise(function (resolve, reject) {
                db.query(
                  `update TestZayavka set status="canceled_by_scoring",canceled_reason='${canceled_reason}' where id=${id}`
                ),
                  function (err, results, fields) {
                    console.log(err);
                    if (err) {
                      return resolve(null);
                      return null;
                    }
                    resolve(results);
                  };
              });
            }
            console.log(new Date());
            clearTimeout(timer1);
          }, (i + 1) * 5000);
        }
      } catch (error) {
        console.log(error);
      }

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
      //   if (id % 2 == 0) {
      //     await new Promise(function (resolve, reject) {
      //       db.query(
      //         `update TestZayavka set limit_summa=9000000,step=4 WHERE id=${id}`,
      //         function (err, results, fields) {
      //           if (err) {
      //             console.log(err);
      //             resolve(null);
      //             return null;
      //           }
      //           if (results.length != 0) {
      //             resolve(results[0]);
      //           } else {
      //             resolve(null);
      //           }
      //         }
      //       );
      //     });
      //   } else {
      //     await new Promise(function (resolve, reject) {
      //       db.query(
      //         `update TestZayavka set status="canceled_by_scoring",canceled_reason="тест отказ" WHERE id=${id}`,
      //         function (err, results, fields) {
      //           if (err) {
      //             console.log(err);
      //             resolve(null);
      //             return null;
      //           }
      //           if (results.length != 0) {
      //             resolve(results[0]);
      //           } else {
      //             resolve(null);
      //           }
      //         }
      //       );
      //     });
      //   }

      //   clearTimeout(t1);
      // }, 10 * 1000);

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
      if (
        fillial.percent_type == "IN" &&
        req.body.amount > zayavkaOld.limit_summa
      ) {
        return next(
          new BadRequestError(400, "Amount summa is over than limit summa")
        );
      }
      await new Promise(function (resolve, reject) {
        db.query(
          update5ZayavkaFunc({
            ...req.body,
            type: fillial.percent_type,
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
      console.log(fillial.expired_months);
      let arr = fillial.expired_months.map((obj) => {
        return `${obj.month}`;
      });

      let val =
        fillial.expired_months[arr.indexOf(`${req.body.expired_month}`)];
      console.log(val);

      if (fillial.percent_type == "OUT") {
        await fapi.addGoods(
          zayavkaOld.contractId,
          zayavkaOld.scoringId,

          Math.floor(zayavkaOld.amount * (1 + val["percent"] / 100) * 100),
          zayavkaOld.products.map((item, i) => {
            return {
              count: 1,
              name: item.name,
              price: Math.floor(item.price * (1 + val["percent"] / 100) * 100),
            };
          })
        );
      } else {
        await fapi.addGoods(
          zayavkaOld.contractId,
          zayavkaOld.scoringId,
          Math.floor(req.body.payment_amount * 100),
          zayavkaOld.products.map((item, i) => {
            return {
              count: 1,
              name: item.name,
              price: Math.floor(item.price * 100),
            };
          })
        );
      }

      if (fillial.percent_type == "OUT") {
        // console.log(Math.floor(req.body.payment_amount + 1) / 1000);
        // console.log(
        //   Math.floor((zayavkaOld.amount * (1 + val["percent"] / 100)) / 1000)
        // );
        // console.log(
        //   Math.floor(req.body.payment_amount + 1) / 1000 !=
        //     Math.floor((zayavkaOld.amount * (1 + val["percent"] / 100)) / 1000)
        // );
        // if ( Math.floor(( req.body.payment_amount   + 1) / 1000)  !=  Math.floor(zayavkaOld.amount * (1 + val["percent"] / 100)/1000)) {
        //  return next(new BadRequestError(400, "Payment amount Error"));
        // }

        await new Promise(function (resolve, reject) {
          db.query(
            update6ZayavkaFunc({
              ...req.body,
              type: fillial.percent_type,
              payment_amount: Math.floor(
                zayavkaOld.amount * (1 + val["percent"] / 100)
              ),
            }),
            function (err, results, fields) {
              if (err) {
                return resolve(null);
                return null;
              }
              resolve(results);
            }
          );
        });
      } else {
        await new Promise(function (resolve, reject) {
          db.query(
            update6ZayavkaFunc({
              ...req.body,
              type: fillial.percent_type,
              payment_amount: req.body.payment_amount,
            }),
            function (err, results, fields) {
              if (err) {
                return resolve(null);
                return null;
              }
              resolve(results);
            }
          );
        });
      }

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
      console.log(error);
      return next(new InternalServerError(500, error));
    }
  }

  async sendCode(req, res, next) {
    try {
      let { id } = req.body;
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
      await fapi.ContractSendCode(zayavka.contractId);
      return res.status(200).json({
        message: `code sent  to ${customhashPhoneNumber(zayavka.phoneNumber)}`,
      });
    } catch (error) {
      console.log(error.message);
      return next(new InternalServerError(500, error));
    }
  }
  async confirmDogovor(req, res, next) {
    try {
      let { id, code } = req.body;
      // if (code != "123123") {
      //   return next(
      //     new BadRequestError(400, "confirmation code not match !!!")
      //   );
      // }
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
      await fapi.ContractCodeConfirm(zayavka.contractId,code);
      return res.status(200).json({
        data: zayavka,
        message: "Confirm code Successfully",
      });
    } catch (error) {
      console.log(error.message);
      return next(new InternalServerError(500, error));
    }
  }

  async update7(req, res, next) {
    try {
      // let { contractPdf, id, term } = req.body;
      // let date = new Date();
      // let singedAt = `${date.getFullYear()}-${
      //   date.getMonth() + 1
      // }-${date.getDate()}`;
      // console.log(singedAt);

     

      //

     try {
      for (let index = 0; index < 15; index++) {
        let timer2 =  setTimeout(async () => {
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
          if(zayavka.contract_status == "LOAN_CREATED"){
             clearTimeout(timer2);
             return;
          }
 
           let result = await fapi.ContractInfo(zayavka.contractId);
           console.log(result);
           if(zayavka.contract_status == "LOAN_CREATED"){
             await new Promise(function (resolve, reject) {
               db.query(
                 `UPDATE TestZayavka set contract_status='${result.data.state}' WHERE id=${id}`,
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
          }
          
 
           clearTimeout(timer2);
         }, (index   + 1 ) * 10000);
       }
     } catch (error) {
      console.log(error);
     }
      await new Promise(function (resolve, reject) {
        db.query(update7ZayavkaFunc(req.body), function (err, results, fields) {
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
        message: "Update 7  is done  ",
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error));
    }
  }

  async updateFinish(req, res, next) {
    console.log("update finish");
    let { code, base64, id } = req.body;
    console.log(req.body);
    try {
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
      console.log(">>>>>>>>>>>>>>>>>");

      if (zayavka.contract_status != "LOAN_CREATED") {
        return next(
          new BadRequestError(400, "The contract was not confirned !")
        );
      }
      console.log("code: " + code);
      let jobId;
      const loginData = await Fapi.login();
      let access_token = loginData["access_token"];
      if (code) {
        let url2 = process.env.FAPI_MYID_SDK + "?code=" + code;
        console.log("access_token " + access_token);
        let response2 = await axios
          .get(
            url2,

            {
              headers: {
                Authorization: "Bearer " + access_token,
              },
            }
          )
          .then((r) => r)
          .catch((err) => {
            throw err;
          });
        console.log(response2.data);

        // in prod

        //  if (!response2.data.profile || response2.data.result_code != 1) {
        //    return next(
        //      new BadRequestError(400, response2.data.result_note ?? "error")
        //    );
        //  }

        console.log("success:");
        console.log(response2.data);
        //  return res.status(200).json(response2.data);
      } else if (base64) {
        console.log("aaa");
        var filePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "myidconfirm",
          `${req.body.passport}.png`
        );
        console.log(filePath);
        let newBase64 = await base64_decode(base64, filePath);
        let url1 = process.env.FAPI_MYID_JOB_ID;
        let url2 = process.env.FAPI_MYID_PROFILE;
        let client_id = process.env.FAPI_MYID_CLIENT_ID;

        const response1 = await axios
          .post(
            url1,
            {
              pass_data: zayavka.passport,
              birth_date: zayavka.birth_date,
              client_id: client_id,

              photo_from_camera: {
                front: newBase64,
              },
              threshold: 0.5,
              agreed_on_terms: true,
              is_resident: true,
            },
            {
              headers: {
                // "Content-Type": "application/x-www-form-urlencoded",
                "Content-Type": "application/json",
              },
            }
          )
          .then((r) => r)
          .catch((err) => {
            throw err;
          });

        // console.log(response1);
        let job_id = response1.data["job_id"];
        jobId = job_id
        
        let response2 = await axios
          .get(
            url2 + "?job_id=" + job_id,

            {
              headers: {
                Authorization: "Bearer " + access_token,
              },
            }
          )
          .then((r) => r)
          .catch((err) => {
            throw err;
          });

        while (response2.status != 200) {
          response2 = await axios
            .post(
              url2,
              "",
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                  // 'Content-Type': 'application/json',
                  "Content-Type": "text/plain",

                  responseType: "json",
                  responseEncoding: "utf8",
                },
              },
              {}
            )
            .then((r) => r)
            .catch((err) => {
              throw err;
            });
        }
        console.log("response2: " + response2);
        //in prod
        //  if ( !response2.data.profile || response2.data.result_code  !=1) {
        //    return next(
        //      new BadRequestError(400, response2.data.result_note ?? "error")
        //    );
        //  }
      }
     
      console.log(">>>>> update finish");
      console.log(req.body);
      var date = new Date();
     let dateStr= moment(date).format('YYYY-MM-DD HH:mm:ss');
      let MyIdinfo  ="myidinfo "+ (code ?  `code : ${code}` :`job-id :${jobId}`)+" " + dateStr;
      let base64Image = base64.split(";base64,")[1];
      var image_bitmap = Buffer.from(base64Image.toString(), "base64");
      await fapi.ContractFinish(zayavka.contractId,image_bitmap, MyIdinfo);
      await new Promise(function (resolve, reject) {
        db.query(
          updateFinishZayavkaFunc(req.body),
          function (err, results, fields) {
            console.log(err);
            if (err) {
              return resolve(null);
              // return null;
            }

            resolve(results);
          }
        );
      });

      let Updatedzayavka = await new Promise(function (resolve, reject) {
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
      console.log(">>>> finish");
      console.log("Updatedzayavka:", Updatedzayavka);
      return res.status(200).json({
        data: Updatedzayavka,
        message: "Update finish  is done Successfully",
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error));
    }
  }
  async Loan(req, res, next) {
    const id = req.params.id;
    try {
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
      let result = await fapi.LoanPreview(zayavka.contractId);
      let newFilePath = path.join(
        __dirname,
        "../",
        "../",
        "public",
        "graphs",
        `graph-${id}.pdf`
      );

      const file = fs.writeFileSync(newFilePath, result,{encoding:"utf8"} );
      res.contentType("application/pdf");

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=graph-${id}.pdf`
      );

      return res.send(result);
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
      let zayavka = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT * from TestZayavka WHERE id=11`,
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
      //  console.log(await fapi.ContractInfo(zayavka.contractId));

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
  async getByid(req, res, next) {
    let { id } = req.params;
    try {
      let zayavka = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT * from TestZayavka WHERE id=${id}`,
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
      if(zayavka.contract_status =="LOAN_CREATING" && zayavka.step==7 ){
        let result = await fapi.ContractInfo(zayavka.contractId);
        await new Promise(function (resolve, reject) {
          db.query(
            `UPDATE TestZayavka set contract_status='${result.data.state}' WHERE id=${id}`,
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
        zayavka= await new Promise(function (resolve, reject) {
          db.query(
            `SELECT * from TestZayavka WHERE id=${id}`,
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
          data: zayavka,
        });

      }

      if (zayavka) {
        return res.status(200).json({
          data: zayavka,
        });
      } else {
        return next(new NotFoundError(404, "Zayavka Not Found"));
      }
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
          let zayavkalarUspeshna = await new Promise(function (
            resolve,
            reject
          ) {
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

          let zayavkalarTimeOtkaz = await new Promise(function (
            resolve,
            reject
          ) {
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
            let percentUspeshna =
              (zayavkalarUspeshna[0]["count(id)"] / getZayavka) * 100;
            let percentScoring =
              (zayavkalarScoringOtkaz[0]["count(id)"] / getZayavka) * 100;
            let percentClient =
              (zayavkalarClienttOtkaz[0]["count(id)"] / getZayavka) * 100;
            let percentTime =
              (zayavkalarTimeOtkaz[0]["count(id)"] / getZayavka) * 100;

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
              },
              scoring: zayavkalarScoring[0],
            });
          } else {
            data.push({
              name: item,
              statistics: null,
              scoring: null,
            });
          }
        }

        console.log(JSON.stringify(data));

        return res.status(200).json({
          data,
        });
      } else {
        return next(new AuthorizationError(401, "No token provided"));
      }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error));
    }
  }

  async graph(req, res, next) {
    let id = req.params.id;
    console.log(id);

    try {
      let Zayavka = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT merchant.name as merchant_name,TestZayavka.* from TestZayavka,merchant where TestZayavka.id=${id} and merchant.id=TestZayavka.merchant_id;`,

          // `select TestZayavka.* ,merchant.name as merchant_name from TestZayavka join merchant on TestZayavka.merchant_id=merchant.id where TestZayavka.id=${id};`,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              reject(err);
              return null;
            }
            if (results.length > 0) {
              resolve(results[0]);
            } else {
              resolve(null);
            }
          }
        );
      });

      console.log(Zayavka);
      if (!Zayavka) {
        return next(new NotFoundError(404, "Zayavka not found"));
      }

      if (Zayavka.status == "finished" || Zayavka.status == "paid") {
        let newFilePath = path.join(
          __dirname,
          "../",
          "../",
          "public",
          "graphs",
          `graph-${Zayavka.id}.pdf`
        );

        if (fs.existsSync(newFilePath)) {
          let pdfData = fs.readFileSync(newFilePath);
          res.contentType("application/pdf");

          res.setHeader(
            "Content-Disposition",
            `attachment; filename=graph-${Zayavka.id}.pdf`
          );

          return res.send(pdfData);
        } else {
          await pdf_generate(Zayavka, "graph-templete.html", newFilePath);

          let pdfData = fs.readFileSync(newFilePath);
          res.contentType("application/pdf");

          res.setHeader(
            "Content-Disposition",
            `attachment; filename=graph-${Zayavka.id}.pdf`
          );

          return res.send(pdfData);
        }
      } else {
        return next(new BadRequestError(400, "Zayavka isnot finished"));
      }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error));
    }
  }

  async oferta(req, res, next) {
    let id = req.params.id;
    console.log(id);

    try {
      let Zayavka = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT merchant.name as merchant_name,TestZayavka.* from TestZayavka,merchant where TestZayavka.id=${id} and merchant.id=TestZayavka.merchant_id;`,

          // `select TestZayavka.* ,merchant.name as merchant_name from TestZayavka join merchant on TestZayavka.merchant_id=merchant.id where TestZayavka.id=${id};`,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              reject(err);
              return null;
            }
            if (results.length > 0) {
              resolve(results[0]);
            } else {
              resolve(null);
            }
          }
        );
      });

      console.log(Zayavka);
      if (!Zayavka) {
        return next(new NotFoundError(404, "Zayavka not found"));
      }

      if (Zayavka.step > 2) {
        let newFilePath = path.join(
          __dirname,
          "../",
          "../",
          "public",
          "docs",
          `oferta-${Zayavka.id}.pdf`
        );

        if (fs.existsSync(newFilePath)) {
          let pdfData = fs.readFileSync(newFilePath);
          res.contentType("application/pdf");

          res.setHeader(
            "Content-Disposition",
            `attachment; filename=oferta-${Zayavka.id}.pdf`
          );

          return res.send(pdfData);
        } else {
          await pdf_generate(Zayavka, "oferta-templete.html", newFilePath);

          let pdfData = fs.readFileSync(newFilePath);
          res.contentType("application/pdf");

          res.setHeader(
            "Content-Disposition",
            `attachment; filename=oferta-${Zayavka.id}.pdf`
          );

          return res.send(pdfData);
        }
      } else {
        return next(new BadRequestError(400, "Zayavka data isnot filled"));
      }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error));
    }
  }

  async cancelTexts(req, res, next) {
    try {
      return res.status(200).json({
        data: [
          "Клиент ушел с магазина",
          "Не хватало по лимита",
          "Клиент отказался",
          "Другой",
        ],
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error));
    }
  }
}

function update1ZayavkaFunc(data) {
  let {
    user_id,
    merchant_id,
    fillial_id,
    fullname,
    passport,
    pinfl,
    birth_date,
  } = data;
  fullname = `${fullname}`;
  fullname = fullname.replaceAll("'", "ʻ");
  return `INSERT INTO TestZayavka (user_id,merchant_id,fillial_id,fullname,passport,pinfl,bank,birth_date) VALUES (${user_id},${merchant_id},${fillial_id},'${fullname}','${passport}','${
    pinfl ?? ""
  }','Fapi','${birth_date}') ; `;
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
    contractId,
  } = data;

  // passport_by = passport_by.replaceAll("ʻ", "'");
  // address = address.replaceAll("ʻ", "'");

  return `UPDATE TestZayavka SET step=?,phoneNumber=?,phoneNumber2=?,cardNumber=?,passport_date=?,passport_by=?,address=?,region_id=?,contractId=? WHERE id = ?`;
}
function update3ZayavkaFunc(data) {
  let { id, max_amount, payment_amount } = data;
  return `update TestZayavka SET step=3,max_amount='${max_amount}' WHERE id = ${id};`;
}

function update5ZayavkaFunc(data) {
  let { id, products, location, device, amount, type } = data;
  let productsString = `'[`;
  products.forEach((product) => {
    productsString += toMyString(product).slice(1, -1);
    productsString += `,`;
  });
  productsString = productsString.slice(0, -1);
  productsString += "]'";
  console.log(productsString);

  if (type == "IN") {
    return `update TestZayavka SET step=5,payment_amount=${amount},products=${
      productsString ?? ""
    },location=${toMyString(location)},device=${toMyString(
      device
    )} WHERE id = ${id};`;
  } else {
    return `update TestZayavka SET step=5,amount=${amount},products=${
      productsString ?? ""
    },location=${toMyString(location)},device=${toMyString(
      device
    )} WHERE id = ${id};`;
  }
}

function update6ZayavkaFunc(data) {
  let { id, payment_amount, expired_month, type } = data;
  if (type == "IN") {
    return `update TestZayavka SET step=6,amount=${payment_amount},expired_month = ${expired_month} WHERE id = ${id};`;
  } else {
    return `update TestZayavka SET step=6,payment_amount=${payment_amount},expired_month = ${expired_month} WHERE id = ${id};`;
  }
}

function updateFinishZayavkaFunc(data) {
  let { id } = data;
  return `update TestZayavka SET step=8,status = 'finished',finished_time = CURRENT_TIMESTAMP WHERE id = ${id};`;
}

function update7ZayavkaFunc(data) {
  let { id } = data;
  return `update TestZayavka SET step=7,contract_status="WAITING"  WHERE id = ${id};`;
}

function cancelByClientZayavkaFunc(data) {
  let { id, canceled_reason } = data;
  return `update TestZayavka SET status = 'canceled_by_client', finished_time = CURRENT_TIMESTAMP ,canceled_reason='${canceled_reason}' WHERE id = ${id}`;
}

async function base64_decode_passport(base64str, filePath) {
  let base64Image = base64str.split(";base64,")[1];
  var bitmap = Buffer.from(base64Image.toString(), "base64");

  fs.writeFileSync(filePath, bitmap);

  console.log("******** File created from base64 encoded string ********");
}
function customhashPhoneNumber(phone) {
  if (!phone) {
    return "";
  } else {
    phone = phone.toString();
    let res =
      phone.substring(0, 4) +
      "(" +
      phone.substring(4, 6) +
      ") ***-" +
      phone.substring(9, 11) +
      "-" +
      phone.substring(11, 13);
    return res;
  }
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
async function base64_decode(base64str, filePath) {
  let base64Image = base64str.split(";base64,")[1];
  var bitmap = Buffer.from(base64Image.toString(), "base64");

  const image = await resizeImg(bitmap, {
    width: 480,
    height: 640,
  });

  fs.writeFileSync(filePath, image);

  const newBase64 = fs.readFileSync(filePath, { encoding: "base64" });

  // console.log("******** File created from base64 encoded string ********");
  // console.log(newBase64.slice(50));
  return "data:image/jpeg;base64," + newBase64;
}
Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};
module.exports = new App();
