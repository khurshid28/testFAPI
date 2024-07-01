const Super = require("../models/Super.js");
const Admin = require("../models/Admin.js");
const User = require("../models/User.js");
const Merchant = require("../models/Merchant.js");
const fs = require("fs");
let path = require("path");
let axios = require("axios");

const {
  InternalServerError,
  AuthorizationError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors.js");
const jwt = require("../utils/jwt.js");

let db = require("../config/db");

class ScoringTest {
  async get(req, res, next) {
    try {
      return res.status(200).json({ message: "Here is result" });
    } catch (error) {
      console.log(error.message);
      return next(new InternalServerError(500, error));
    }
  }
  async post(req, res, next) {
    console.log("post");
    try {
      let { orderId, status, reason, summa, term } = req.body;
      console.log(req.body);
      let id = `${orderId}`.split("-")[1];
      if (reason) {
        reason = reason.replaceAll("ʻ", "'");
      }
      if (summa) {
        summa = `${summa}`.replaceAll(",", ".");
      }

      const filePath = path.resolve(__dirname, "scoring_test_data.txt");
      fs.appendFileSync(
        filePath,
        `\n ${Date().toString()}` + " >> " + JSON.stringify(req.body),
        (err) => {
          if (err)
            throw {
              err,
              type: "file",
            };
        }
      );

      if (status == "1") {
        await new Promise(function (resolve, reject) {
          db.query(
            `UPDATE TestZayavka SET scoring_start = CURRENT_TIMESTAMP WHERE id = ${id};`,
            function (err, results, fields) {
              if (err) {
                resolve(null);
                return null;
              }
              if (results) {
                resolve(results);
              } else {
                resolve(null);
                return null;
              }
            }
          );
        });
      } else if (status == "3") {
        await new Promise(function (resolve, reject) {
          db.query(
            `UPDATE TestZayavka SET scoring_end = CURRENT_TIMESTAMP,status = 'canceled_by_scoring', finished_time = CURRENT_TIMESTAMP ,canceled_reason='${reason}' WHERE id = ${id};`,
            function (err, results, fields) {
              if (err) {
                resolve(null);
                return null;
              }
              if (results) {
                resolve(results);
              } else {
                resolve(null);
                return null;
              }
            }
          );
        });
      } else if (status == "4") {
        await new Promise(function (resolve, reject) {
          db.query(
            `UPDATE TestZayavka SET step=4,paid_status='waiting',term='${term}',limit_summa='${summa}',scoring_end = CURRENT_TIMESTAMP WHERE id = ${id};`,
            function (err, results, fields) {
              if (err) {
                resolve(null);
                return null;
              }
              if (results) {
                resolve(results);
              } else {
                resolve(null);
                return null;
              }
            }
          );
        });
      } else if (status == "7") {
        await new Promise(function (resolve, reject) {
          db.query(
            `UPDATE TestZayavka SET paid_status='paid' WHERE id = ${id};`,
            function (err, results, fields) {
              if (err) {
                resolve(null);
                return null;
              }
              if (results) {
                resolve(results);
              } else {
                resolve(null);
                return null;
              }
            }
          );
        });
      } else if (status == "8") {
        await new Promise(function (resolve, reject) {
          db.query(
            `UPDATE TestZayavka SET status = 'canceled_by_scoring',finished_time = CURRENT_TIMESTAMP,canceled_reason='Заявка была отклонена (отказ)'  WHERE id = ${id};`,
            function (err, results, fields) {
              if (err) {
                resolve(null);
                return null;
              }
              if (results) {
                resolve(results);
              } else {
                resolve(null);
                return null;
              }
            }
          );
        });
      }

      try {
        //vaqtincha

        let zayavka = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT TestZayavka.*,fillial.name,fillial.percent_type from TestZayavka,fillial WHERE TestZayavka.id=${id} and fillial.id=TestZayavka.fillial_id `,
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

        let text =
          "<b>" +
          statusIcon(status) +
          (statusIcon(status) ? "%0A" : "") +
          "ID : " +
          orderId +
          "%0A" +
          "STATUS : " +
          status +
          (status == 4
            ? "%0A" + "LIMIT : " + toMoney(Math.floor(summa))
            : status != 7
            ? "%0A" + "SUMMA : " + toMoney(Math.floor(zayavka.max_amount))
            : "") +
          (status == 7
            ? "%0A" + "PERIOD : " + toMoney(Math.floor(zayavka.expired_month))
            : "") +
          (status == 7
            ? "%0A" +
              "OFORMIT SUMMA : " +
              toMoney(Math.floor(zayavka.payment_amount))
            : "") +
          // (
          //   reason ?
          //   "%0A" + "Причина : " +
          //   reason.toString().replaceAll("."," ")  : ""
          // )
          "%0A" +
          "FULLNAME : " +
          zayavka.fullname +
          "%0A" +
          "Dokon : " +
          zayavka.name
            .replaceAll("-", " ")
            .replaceAll("'", " ")
            .replaceAll("ʻ", "")
            .replaceAll('"', "") +
          "</b>";
        console.log(zayavka);
        console.log(">>>>>>>");
        console.log(text);

        let url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendmessage?chat_id=6001596917&text=${text}&parse_mode=HTML`;
        axios
          .post(url)
          .then((res) => res)
          .catch((err) => console.log(err));
        let url1 = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendmessage?chat_id=2053690211&text=${text}&parse_mode=HTML`;
        axios
          .post(url1)
          .then((res) => res)
          .catch((err) => console.log(err));

        // let url2 = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendmessage?chat_id=702623697&text=${text}&parse_mode=HTML`;
        // axios
        //   .post(url2)
        //   .then((res) => res)
        //   .catch((err) => console.log(err));

        let url3 = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendmessage?chat_id=1955031743&text=${text}&parse_mode=HTML`;
        axios
          .post(url3)
          .then((res) => res)
          .catch((err) => console.log(err));

        let url4 = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendmessage?chat_id=2907182&text=${text}&parse_mode=HTML`;
        axios
          .post(url4)
          .then((res) => res)
          .catch((err) => console.log(err));
        let url5 = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendmessage?chat_id=1136321790&text=${text}&parse_mode=HTML`;

        axios
          .post(url5)
          .then((res) => res)
          .catch((err) => console.log(err));

        let url6 = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendmessage?chat_id=49825747&text=${text}&parse_mode=HTML`;

        axios
          .post(url6)
          .then((res) => res)
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }

      return res.status(200).json({
        status: true,
        message: "qabul qilindi",
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error));
    }
  }
 
}
function statusIcon(status) {
  if (status==4) {
    return "✅";
  }
  if (status==3) {
    return "🚫";
  }
  if (status==8) {
    return "🚫";
  }
  if (status==7) {
    return "📩";
  }
  return ""
}


function toMoney(number) {
  if (!number) {
    return "0";
  }
  let result = "";
  for (let i = 0; i < number.toString().length; i++) {
    result += number.toString()[i];
    if ((number.toString().length - i) % 3 == 1) {
      result += " ";
    }
  }
  return result;
}

module.exports = new ScoringTest();
