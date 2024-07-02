let db = require("./src/config/db");
let bot = require("./src/bot/bot");
const path = require("path");
const fs = require("fs");
getStatistics = async () => {
  let data = [];
  let banks = ["Davr", "Hamkor", "Asaka", "QQB"];

  for await (let item of banks) {
    let zayavkalarUspeshna = await new Promise(function (resolve, reject) {
      db.query(
        `SELECT count(id) from Zayavka where step=8 and bank='${item}'`,
        function (err, results, fields) {
          if (err) {
            console.log(err);
            resolve(null);
          }
          resolve(results);
        }
      );
    });

    let zayavkalarScoringOtkaz = await new Promise(function (resolve, reject) {
      db.query(
        `SELECT count(id) from Zayavka where status='canceled_by_scoring' and bank='${item}'`,
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
    let zayavkalarClienttOtkaz = await new Promise(function (resolve, reject) {
      db.query(
        `SELECT count(id) from Zayavka where status='canceled_by_client' and bank='${item}'`,
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
        `SELECT count(id) from Zayavka where status='canceled_by_daily' and bank='${item}'`,
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
        `SELECT avg(scoring_end - scoring_start)/(60*1000) as avg,count(id) as count from Zayavka where scoring_start is not null and scoring_end is not null and bank='${item}'`,
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
};

addresstoBot = async () => {
  let data = await new Promise(function (resolve, reject) {
    db.query(
      `SELECT id,address,passport,fullname,payment_amount,status,(created_time) as date  from Zayavka WHERE  id=567;`,
      function (err, results, fields) {
        if (err) {
          resolve(null);
          return null;
        }
        return resolve(results);
      }
    );
  });

  console.log(data);
  var filePath = path.join(
    __dirname,
    // "..",
    // "..",
    "public",
    "myid",
    `${data[0].passport}.png`
  );
  bot.sendPhoto(2053690211,filePath,{
    parse_mode: "HTML",
    caption:`<b>MESSAGE : ⚠️ KUTISH VAQTI 4 daqiqadan oshdi\nID: PPDTEST-${data[0].id} \nFULLNAME: ${data[0].fullname}\nADDRESS: ${data[0].address.home}\n</b>`,
  })
  // bot.sendMessage(
  //   "2053690211",
  //   `<b>MESSAGE : ⚠️ KUTISH VAQTI 4 daqiqadan oshdi\nID: PPDTEST-${data[0].id} \nFULLNAME :${data[0].fullname}\nADDRESS: ${data[0].address.home}\n</b>`,
  //   {
  //     parse_mode: "HTML",
  //   }
  // );
};

// getStatistics();
addresstoBot()