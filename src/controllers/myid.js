const {
  InternalServerError,
  ForbiddenError,
  BadRequestError,
} = require("../utils/errors.js");
let axios = require("axios");
let path = require("path");
let fs = require("fs");
let Fapi = require("../utils/fapi")
let db = require("../config/db");

const resizeImg = require("resize-image-buffer");
const { param } = require("../routes/myid.js");
const { response } = require("express");
class Myid {
  async getMe(req, res, next) {
    try {
      console.log(">>>>>>>>>>>>>>>>>");
      
      let { code, base64, passport, birthDate } = req.body;
      console.log("code: " + code);
      
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
        console.log("success:");
        console.log(response2.data);
        if (response2.data.profile 
          // prod
          // && response2.data.result_code == 1
          ) {
          let userMyIdData = await new Promise((resolve, reject) => {
            db.query(
              `INSERT INTO MyId (response_id,pass_seriya,comparison_value,profile) VALUES ('${
                response2.data.response_id
              }', '${passport}','${
                response2.data.comparison_value
              }','${JSON.stringify(response2.data.profile).replaceAll(
                `\^`,
                ""
              )}')`,
              function (err, results, fields) {
                if (err) {
                  console.log("err >> ", err);
                  resolve(null);
                  // return null;
                }
                console.log("results >> ", results);
                if (results) {
                  resolve("success");
                } else {
                  resolve(null);
                  // return null;
                }
              }
            );
          });

          return res.status(response2.status).json(response2.data);
        } else {
          return next(
            new InternalServerError(500, response2.data.result_note ?? "error")
          );
        }
       
      } else if (base64) {
        console.log('aaa');
        var filePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "myid",
          `${req.body.passport}.png`
        );
        console.log(filePath);
        let newBase64 = await base64_decode(base64, filePath);
        let url1 = process.env.FAPI_MYID_JOB_ID
        let url2 = process.env.FAPI_MYID_PROFILE 
        let client_id = process.env.FAPI_MYID_CLIENT_ID; 
         

        const response1 = await axios
          .post(
            url1,
            {
              pass_data: passport,
              // pinfl: "35614060828935",
              birth_date: birthDate,
              client_id: client_id,
              // device: "string",
              // external_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
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
        let response2 = await axios
          .get(
            url2+"?job_id="+job_id,
            

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
        console.log('response2: ' + response2);
         if (response2.data.profile 
            // prod
          // && response2.data.result_code == 1
          
          ) {
           let userMyIdData = await new Promise((resolve, reject) => {
             db.query(
               `INSERT INTO MyId (response_id,pass_seriya,comparison_value,profile) VALUES ('${
                 response2.data.response_id
               }', '${passport}','${
                 response2.data.comparison_value
               }','${JSON.stringify(response2.data.profile).replaceAll(
                 `\^`,
                 ""
               )}')`,
               function (err, results, fields) {
                 if (err) {
                   console.log("err >> ", err);
                   resolve(null);
                   // return null;
                 }
                 console.log("results >> ", results);
                 if (results) {
                   resolve("success");
                 } else {
                   resolve(null);
                   // return null;
                 }
               }
             );
           });

           return res.status(response2.status).json(response2.data);
         } else {
           return next(
             new InternalServerError(500, response2.data.result_note ?? "error")
           );
         }
        //  return res.status(response2.status).json(response2.data);
      }

        return next(new InternalServerError(500, "Myid image error"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error));
    }
  }
  async base64(req, res, next) {
    try {
      console.log(">>>>>>>>>>>>>>>>>");
      let { passport } = req.params;

      let response3 = await axios
      .get("http://localhost:7070/api/v1/base64/"+ passport, )
      .then((res) => res)
      .catch((err) => {
        console.log(">>>> Test server ERROR", err.response);
        return err.response;
      });

    return res.status(response3.status).json(response3.data);
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error));
    }
  }

  async check(req, res, next) {
    try {
      let { passport, gender, date } = req.body;

      console.log(new Date().getFullYear() - `${date}`.split(".")[2], " yil");
      let age = new Date().getFullYear() - `${date}`.split(".")[2];
      console.log(req.body);
      if (gender == "ERKAK") {
        if (age < 19 || age > 58) {
          return res.status(200).json({
            message: "Возраст клиента указан неверно.",
            status: false,
          });
        }
      } else {
        if (age < 19 || age > 53) {
          return res.status(200).json({
            message: "Возраст клиента указан неверно.",
            status: false,
          });
        }
      }
      return res.status(200).json({
        message: "Пользователю предоставлено разрешение",
        status: true,
      });

      let zayavka2 = await new Promise(function (resolve, reject) {
        db.query(
          `Select * from Zayavka WHERE passport='${passport}' AND status='canceled_by_scoring' ORDER BY id DESC`,
          function (err, results, fields) {
            // console.log("here");
            // console.log(err);
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

      //  esdan chiqmasin
      if (zayavka2) {
        if (
          Date.daysBetween(Date.parse(zayavka2.finished_time), Date.now()) <= 15
        ) {
          return res.status(200).json({
            message: `Недавно клиент получил отказ, теперь он(она) может проверить через ${
              16 -
              Date.daysBetween(Date.parse(zayavka2.finished_time), Date.now())
            } дней.`,
            status: false,
          });
        }
      }

      let zayavka = await new Promise(function (resolve, reject) {
        db.query(
          `Select * from Zayavka WHERE passport='${passport}' AND step>6  ORDER BY id DESC `,
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
        return res.status(200).json({
          message: "Пользователю предоставлено разрешение",
          status: true,
        });
      } else {
        if (
          Date.daysBetween(Date.parse(zayavka.finished_time), Date.now()) < 4
        ) {
          return res.status(200).json({
            message: "Клиент недавно получил товар",
            status: false,
          });
        }
      }
      db.query(
        `UPDATE Zayavka SET status="canceled_by_client",canceled_reason="- - -"  WHERE passport='${passport}' AND step<7 AND status="progress" `,
        function (err, results, fields) {}
      );

      return res.status(200).json({
        message: "Пользователю предоставлено разрешение",
        status: true,
      });
    } catch (error) {
      console.log(">>>>>>>>>. ERROR >>>>>>>>>>");
      console.log(error);
      return next(new InternalServerError(500, error));
    }
  }

  async imageGetMe(req, res, next) {
    try {
      console.log(">>>>>>>>>>>>>>>>>");
      let { passport, birthDate } = req.body;

      console.log(req.body);
      let filePath = path.join(__dirname, "../../", req.file.path);

      var bitmap = fs.readFileSync(filePath);
      const encoded = Buffer(bitmap).toString("base64");

      fs.unlink(filePath, function (err) {
        if (err && err.code == "ENOENT") {
          // file doens't exist
          console.info("File doesn't exist, won't remove it.");
        } else if (err) {
          // other errors, e.g. maybe we don't have enough permission
          console.error("Error occurred while trying to remove file");
        } else {
          console.info(`removed`);
        }
      });

      let url1 = process.env.FACE_URL_DEV + "oauth2/access-token";
      let url2 =
        process.env.FACE_URL_DEV +
        "authentication/simple-inplace-authentication-request-task";

      const response1 = await axios
        .post(
          url1,
          {
            grant_type: "password",
            client_id: process.env.FACE_CLIENT_ID_2,
            username: process.env.FACE_USERNAME,
            password: process.env.FACE_PASSWORD,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((r) => r)
        .catch((err) => {
          throw err;
        });

      // console.log(response1);
      let access_token = response1.data["access_token"];
      console.log(birthDate);
      let response2 = await axios
        .post(
          url2,
          {
            pass_data: passport,
            birth_date: birthDate,
            photo_from_camera: {
              front: `data:image/jpeg;base64,${encoded}`,
            },
            agreed_on_terms: true,
            client_id: process.env.FACE_CLIENT_ID_2,
          },

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

      let url3 = `${process.env.FACE_URL_DEV}authentication/simple-inplace-authentication-request-status?job_id=${response2.data["job_id"]}`;
      console.log(JSON.stringify(url3));
      let response3 = await axios
        .post(
          url3,
          "",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              // 'Content-Type': 'application/json',
              "Content-Type": "text/plain",

              // "responseType": 'blob',
              // "Accept":"*/*",
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
      while (response3.status != 200) {
        response3 = await axios
          .post(
            url3,
            "",
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
                // 'Content-Type': 'application/json',
                "Content-Type": "text/plain",

                // "responseType": 'blob',
                // "Accept":"*/*",
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

      return res.status(response3.status).json(response3.data);
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error));
    }
  }
}

Date.daysBetween = function (date1, date2) {
  //Get 1 day in milliseconds
  var one_day = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds
  var difference = date2 - date1;

  // Convert back to days and return
  return Math.round(difference / one_day);
};

// function base64_decode(base64str, filePath) {
//   let base64Image = base64str.split(";base64,")[1];
//   var bitmap = Buffer.from(base64Image.toString(), "base64");

//   fs.writeFileSync(filePath, bitmap);
//   console.log("******** File created from base64 encoded string ********");
// }

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
module.exports = new Myid();
