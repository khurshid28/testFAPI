const TelegramBot = require("node-telegram-bot-api");
const path = require("path");
const XLSX = require("xlsx");
const fs = require("fs");
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

let db = require("../config/db");
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  console.log(chatId);

  if (
    chatId == 6702785171 ||
    chatId === 6001596917 ||
    chatId === 1955031743 ||
    chatId === 2053690211
  ) {
    

    if (msg.text == "/data") {
      let zayavkalar1 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id)  from TestZayavka WHERE  status='progress' and  bank='Fapi' `,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar2 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id)  from TestZayavka WHERE  bank='Fapi' `,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar3 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka WHERE  status='canceled_by_client' and  bank='Fapi' `,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar4 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka WHERE  status='canceled_by_daily' and  bank='Fapi'`,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar5 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka WHERE  step>3 and  bank='Fapi'`,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });

      let zayavkalar8 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id),sum(payment_amount) from TestZayavka WHERE paid_status='paid' and  bank='Fapi' `,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar9 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka where   bank='Fapi'`,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });

      let zayavkalar10 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka where status="canceled_by_scoring" and canceled_reason="TIMEOUT" and  bank='Fapi' `,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });

      let conceled_zayavkalar =
        zayavkalar2[0]["count(id)"] +
        zayavkalar3[0]["count(id)"] +
        zayavkalar4[0]["count(id)"];
      let paid_zayavkalar = zayavkalar8[0]["count(id)"];
      let summa = zayavkalar8[0]["sum(payment_amount)"];
      let finished_zayavkalar = zayavkalar5[0]["count(id)"];

      let zayavkalartimeOut = zayavkalar10[0]["count(id)"];

      let progress_zayavkalar = zayavkalar1[0]["count(id)"];

      let daily_zayavkalar = zayavkalar4[0]["count(id)"];

      // console.log(JSON.stringify(zayavkalar5[0]["count(id)"]));

      bot.sendMessage(
        chatId,
        `Umumiy Zayavkalar : ${
          zayavkalar9[0]["count(id)"]
        }\nuspeshna : ${finished_zayavkalar}\nprogress : ${progress_zayavkalar}\nscoring otkaz : ${
          zayavkalar2[0]["count(id)"]
        }\nclient otkaz : ${
          zayavkalar3[0]["count(id)"]
        }\nTIMEOUT : ${zayavkalartimeOut}\nDaily cancel : ${daily_zayavkalar}\noformleniya : ${paid_zayavkalar}  ^ ${toMoney(
          Math.floor(summa)
        )}`
      );
    } else if (msg.text == "/bugun") {
      let zayavkalar1 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id)  from TestZayavka WHERE  status='progress' and DATE(now())=DATE(created_time) and  bank='Fapi' ;`,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar2 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id)  from TestZayavka WHERE  status='canceled_by_scoring' and canceled_reason<>"TIMEOUT" and DATE(now())=DATE(created_time) and  bank='Fapi' ;`,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar3 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka WHERE  status='canceled_by_client' and DATE(now())=DATE(created_time) and  bank='Fapi' ;`,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar4 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka WHERE  status='canceled_by_daily' and DATE(now())=DATE(created_time) and  bank='Fapi';`,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar5 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka WHERE  step>3 and DATE(now())=DATE(created_time) and  bank='Fapi' ;`,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });

      let zayavkalar8 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id),sum(payment_amount) from TestZayavka WHERE paid_status='paid' and DATE(now())=DATE(created_time) and  bank='Fapi' ;`,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar9 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka WHERE DATE(now())=DATE(created_time) and  bank='Fapi' ;`,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });

      let zayavkalar10 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka where status="canceled_by_scoring" and canceled_reason="TIMEOUT" and DATE(now())=DATE(created_time) and  bank='Fapi'`,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });

      let conceled_zayavkalar =
        zayavkalar2[0]["count(id)"] +
        zayavkalar3[0]["count(id)"] +
        zayavkalar4[0]["count(id)"];
      let paid_zayavkalar = zayavkalar8[0]["count(id)"];
      let summa = zayavkalar8[0]["sum(payment_amount)"];
      let finished_zayavkalar = zayavkalar5[0]["count(id)"];
      let progress_zayavka = zayavkalar1[0]["count(id)"];

      // console.log(JSON.stringify(zayavkalar5[0]["count(id)"]));
      let zayavkalartimeOut = zayavkalar10[0]["count(id)"];

      // console.log(JSON.stringify(zayavkalar5[0]["count(id)"]));

      bot.sendMessage(
        chatId,
        `-- Bugun --\nUmumiy Zayavkalar :${
          zayavkalar9[0]["count(id)"]
        }\nprogress : ${progress_zayavka}\nuspeshna : ${finished_zayavkalar}\nscoring otkaz : ${
          zayavkalar2[0]["count(id)"]
        }\nclient otkaz : ${
          zayavkalar3[0]["count(id)"]
        }\nTIMEOUT : ${zayavkalartimeOut}\noformleniya : ${paid_zayavkalar} ^ ${toMoney(
          Math.floor(summa)
        )} `
      );
    } else if (msg.text == "/kecha") {
      let zayavkalar1 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id)  from TestZayavka WHERE  status='progress' and  DATE(now()) - 1 = DATE(created_time) and  bank='Fapi'`,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar2 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id)  from TestZayavka WHERE  status='canceled_by_scoring' and canceled_reason<>"TIMEOUT" and  DATE(now()) - 1 = DATE(created_time) and  bank='Fapi'`,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar3 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka WHERE  status='canceled_by_client' and  DATE(now()) - 1 = DATE(created_time) and  bank='Fapi'`,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar4 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka WHERE  status='canceled_by_daily' and  DATE(now()) - 1 = DATE(created_time) and  bank='Fapi'`,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar5 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka WHERE step>3 and  DATE(now()) - 1 = DATE(created_time) and  bank='Fapi' `,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });

      let zayavkalar8 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id),sum(payment_amount) from TestZayavka WHERE paid_status='paid' and  DATE(now()) - 1 = DATE(created_time ) and  bank='Fapi'`,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });

      let zayavkalar9 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka where DATE(now()) - 1 = DATE(created_time ) and  bank='Fapi' `,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let zayavkalar10 = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT count(id) from TestZayavka where status="canceled_by_scoring" and canceled_reason="TIMEOUT" and DATE(now()) - 1 = DATE(created_time )`,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              resolve(null);
              return null;
            }
            return resolve(results);
          }
        );
      });
      let conceled_zayavkalar =
        zayavkalar2[0]["count(id)"] +
        zayavkalar3[0]["count(id)"] +
        zayavkalar4[0]["count(id)"];
      let paid_zayavkalar = zayavkalar8[0]["count(id)"];
      let summa = zayavkalar8[0]["sum(payment_amount)"];
      let finished_zayavkalar = zayavkalar5[0]["count(id)"];
      // console.log(JSON.stringify(zayavkalar5[0]["count(id)"]));

      let zayavkalartimeOut = zayavkalar10[0]["count(id)"];

      let daily_zayavkalar = zayavkalar4[0]["count(id)"];

      // console.log(JSON.stringify(zayavkalar5[0]["count(id)"]));

      bot.sendMessage(
        chatId,
        `-- Kecha --\nUmumiy Zayavkalar : ${
          zayavkalar9[0]["count(id)"]
        }\nuspeshna : ${finished_zayavkalar}\nscoring otkaz : ${
          zayavkalar2[0]["count(id)"]
        }\nclient otkaz : ${
          zayavkalar3[0]["count(id)"]
        }\nTIMEOUT : ${zayavkalartimeOut}\nDaily cancel : ${daily_zayavkalar}\noformleniya : ${paid_zayavkalar}  ^ ${toMoney(
          Math.floor(summa)
        )}`
      );
    } else if (
      msg.text.split("-")[0] == "step" &&
      (chatId == 2053690211 ||
        chatId == 1955031743 ||
        chatId == 6702785171 ||
        chatId == 6001596917)
    ) {
      zayavka = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT *  from TestZayavka WHERE  id=${msg.text.split("-")[1]}`,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            if (results.length > 0) {
              return resolve(results[0]);
            } else {
              return resolve(null);
            }
          }
        );
      });

      if (zayavka) {
        bot.sendMessage(
          chatId,
          `Ism: ${zayavka.fullname}\nstatus: ${zayavka.status}\nstep : ${zayavka.step}\npassport : ${zayavka.passport}\nphoneNumber : ${zayavka.phoneNumber}\nprichina : ` +
            (zayavka.canceled_reason ?? "")
        );
      }
    } else if (
      msg.text.split("-")[0] == "cancel" &&
      (chatId == 2053690211 ||
        chatId == 1955031743 ||
        chatId == 6001596917 ||
        chatId == 6702785171)
    ) {
      zayavka = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT *  from TestZayavka WHERE  id=${msg.text.split("-")[1]}`,
          function (err, results, fields) {
            if (err) {
              resolve(null);
              return null;
            }
            if (results.length > 0) {
              return resolve(results[0]);
            } else {
              return resolve(null);
            }
          }
        );
      });
      if (zayavka) {
        if (zayavka.status == "progress") {
          await new Promise(function (resolve, reject) {
            db.query(
              `UPDATE Zayavka SET status="canceled_by_scoring",canceled_reason="TIMEOUT" WHERE  id=${
                msg.text.split("-")[1]
              }`,
              function (err, results, fields) {
                if (err) {
                  resolve(null);
                  return null;
                }
                if (results.length > 0) {
                  return resolve(results[0]);
                } else {
                  return resolve(null);
                }
              }
            );
          });

          // chatId == 2053690211 || chatId == 1955031743 || chatId == 6001596917 ||  chatId == 6001596917
          let canceled_text =
            "❌ Canceled PPD-" +
            msg.text.split("-")[1] +
            " , @" +
            (msg.chat.username ?? "");
          bot.sendMessage(2053690211, canceled_text);
          bot.sendMessage(1955031743, canceled_text);
          bot.sendMessage(6001596917, canceled_text);
          bot.sendMessage(6702785171, canceled_text);
        } else {
          await bot.sendMessage(
            chatId,
            "Error, Zayavka status : " + zayavka.status
          );
        }
      } else {
        await bot.sendMessage(chatId, "Zayavka not found ");
      }
    } else if (
      msg.text == "/log" &&
      (chatId == 2053690211 || chatId == 1955031743)
    ) {
      try {
        bot.sendDocument(
          chatId,
          path.join(__dirname, "..", "controllers", "scoring_data.txt")
        );
        bot.sendDocument(
          chatId,
          path.join(__dirname, "..", "controllers", "output.txt")
        );
      } catch (error) {
        console.log(error);
      }
    } else if (msg.text.split("T").length == 2) {
      let start = msg.text.split("T")[0];
      // console.log(start);

      let end = msg.text.split("T")[1];
      // console.log(end);
      if (start.split("-").length != 3 || end.split("-").length != 3) {
        await bot.sendMessage(
          chatId,
          `Iltimos Siz ko'rmoqchi bo'lgan statistika sanasini \nyyyy-mm-dd T yyyy-mm-dd formatda yozing !  `
        );
      } else {
        zayavkalar1 = await new Promise(function (resolve, reject) {
          //('2024-01-31' < Date(created_time) and Date(created_time) < '2024-03-01')
          db.query(
            `SELECT count(id)  from TestZayavka WHERE  status='progress' and (${start} < Date(created_time) and Date(created_time) < ${end});`,
            function (err, results, fields) {
              if (err) {
                resolve(null);
                return null;
              }
              return resolve(results);
            }
          );
        });
        zayavkalar2 = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT count(id)  from TestZayavka WHERE  status='canceled_by_scoring' and canceled_reason<>"TIMEOUT" and (${start} < Date(created_time) and Date(created_time) < ${end});`,
            function (err, results, fields) {
              if (err) {
                resolve(null);
                return null;
              }
              return resolve(results);
            }
          );
        });
        zayavkalar3 = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT count(id) from TestZayavka WHERE  status='canceled_by_client' and (${start} < Date(created_time) and Date(created_time) < ${end});`,
            function (err, results, fields) {
              if (err) {
                resolve(null);
                return null;
              }
              return resolve(results);
            }
          );
        });
        zayavkalar4 = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT count(id) from TestZayavka WHERE  status='canceled_by_daily' and (${start} < Date(created_time) and Date(created_time) < ${end});`,
            function (err, results, fields) {
              if (err) {
                resolve(null);
                return null;
              }
              return resolve(results);
            }
          );
        });
        zayavkalar5 = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT count(id) from TestZayavka WHERE  (status='finished' or status='paid') and (${start} < Date(created_time) and Date(created_time) < ${end});`,
            function (err, results, fields) {
              if (err) {
                console.log(err);
                resolve(null);
                return null;
              }
              return resolve(results);
            }
          );
        });

        zayavkalar8 = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT count(id),sum(payment_amount) from TestZayavka WHERE paid_status='paid' and (${start} < Date(created_time) and Date(created_time) < ${end});`,
            function (err, results, fields) {
              if (err) {
                console.log(err);
                resolve(null);
                return null;
              }
              return resolve(results);
            }
          );
        });
        zayavkalar9 = await new Promise(function (resolve, reject) {
          db.query(
            `SELECT count(id) from TestZayavka WHERE (${start} < Date(created_time) and Date(created_time) < ${end});`,
            function (err, results, fields) {
              if (err) {
                console.log(err);
                resolve(null);
                return null;
              }
              return resolve(results);
            }
          );
        });

        let conceled_zayavkalar =
          zayavkalar2[0]["count(id)"] +
          zayavkalar3[0]["count(id)"] +
          zayavkalar4[0]["count(id)"];
        let paid_zayavkalar = zayavkalar8[0]["count(id)"];
        let summa = zayavkalar8[0]["sum(payment_amount)"];
        let finished_zayavkalar = zayavkalar5[0]["count(id)"];
        // console.log(JSON.stringify(zayavkalar5[0]["count(id)"]));

        bot.sendMessage(
          chatId,
          `-- Statistika --\n
          ${start} dan ${end} gacha \nUmumiy Zayavkalar :${
            zayavkalar9[0]["count(id)"]
          }\nuspeshna : ${finished_zayavkalar} \npul ko'chirilgan : ${paid_zayavkalar} ^ ${toMoney(
            Math.floor(summa)
          )} \nscoring otkaz : ${zayavkalar2[0]["count(id)"]}`
        );

        // bot.sendMessage(
        //   chatId,
        //   `-- Statistika --
        // \n${start} dan ${end} gacha \nUmumiy Zayavkalar :20\nuspeshna : 20 \npul ko'chirilgan : 20 ^ ${toMoney(
        //   Math.floor(50000)
        // )} \nscoring otkaz : 20`
        // );
      }
    } else if (
      msg.text.split("-")[0] == "/myid" &&
      (chatId == 2053690211 || chatId == 1955031743)
    ) {
      try {
        bot.sendDocument(
          chatId,
          path.join(
            __dirname,
            "..",
            "controllers",
            `myid-${msg.text.split("-")[1]}.txt`
          )
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      var filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "myid",
        `${msg.text}.png`
      );
      if (fs.existsSync(filePath)) {
        console.log("File is exist");
        bot.sendPhoto(chatId, filePath);
        // bot.sendPhoto(chatId,path.join(
        //   __dirname,
        //   "..",
        //   "..",
        //   "public",
        //   "images",
        //   `zayavka192.jpg`
        // ))
      } else {
        bot.sendMessage(chatId, "Not Found");
      }
    }
  }
});

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

module.exports = bot;
