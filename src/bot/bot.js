// const TelegramBot = require("node-telegram-bot-api");
// const path = require("path");
// const XLSX = require("xlsx");
// const fs = require("fs");
// const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// let db = require("../config/db");
// bot.on("message", async (msg) => {
//   const chatId = msg.chat.id;
//   console.log(chatId);

//   if (
//     chatId === 6001596917 ||
//     // chatId === 702623697 ||
//     chatId === 1955031743 ||
//     chatId === 2053690211 ||
//     chatId === 2907182 ||
//     chatId === 1136321790 ||
//     chatId === 49825747
//   ) {
//     // if (msg.text = "/go" && chatId === 2053690211) {
//     //   zayavkalar = await new Promise(function (resolve, reject) {
//     //     db.query(
//     //       `SELECT id,fullName,passport,pinfl,passport_date from Zayavka where pinfl<>"" and status="canceled_by_scoring" and id not in(142,143,181);`,
//     //       function (err, results, fields) {
//     //         console.log(err);
//     //         if (err) {
//     //           resolve(null);
//     //           return null;
//     //         }
//     //         return resolve(results);
//     //       }
//     //     );
//     //   });
//     //   console.log(zayavkalar);
//     //   console.log(zayavkalar.length);

//     //   // Sample JSON data
//     //   const data = [];
//     //   for (let index = 0; index < zayavkalar.length; index++) {
//     //     const element = zayavkalar[index];
//     //     data.push({
//     //       "№":index+1,
//     //       "Ф.И.О":element.fullName,
//     //       "ПАССПОРТ":element.passport,
//     //       "ПИНФЛ":element.pinfl,
//     //       "Дата Рождения": element.passport_date
//     //     });

//     //   }

//     //   // Create a new workbook
//     //   const workbook1 = XLSX.utils.book_new();
//     //   const sheetName1 = "Sheet1";

//     //   // Convert JSON data to worksheet
//     //   const worksheet1 = XLSX.utils.json_to_sheet(data);

//     //   worksheet1["!cols"] = [
//     //     { width: 5 },
//     //     { width: 40 },
//     //     { width: 10 },
//     //     { width: 15 },
//     //     { width: 15 },

//     //   ];
//     //   // console.log(workbook1["!cols"]);
//     //   // Add the worksheet to the workbook
//     //   XLSX.utils.book_append_sheet(workbook1, worksheet1, sheetName1);

//     //   // Save the workbook to a file
//     //   const outputFilePath = "zayavkalar.xlsx";
//     //   XLSX.writeFile(workbook1, outputFilePath);

//     //   console.log(
//     //     `Styled Excel sheet created successfully at ${outputFilePath}`
//     //   );
//     //   await bot.sendDocument(
//     //     chatId,
//     //    outputFilePath
//     //   );

//     // }

//     // if (msg.text == "/get" && chatId === 2053690211) {
//     //   let data = new Promise(function (resolve, reject) {
//     //     db.query(
//     //       `SELECT id,fullname,status,Date(created_time - interval 5 hour) as date  from Zayavka WHERE  status in ('canceled_by_scoring','finished','paid') and  ('2024-01-31' < Date(created_time - interval 5 hour) and Date(created_time - interval 5 hour) < '2024-03-01')`,
//     //       function (err, results, fields) {
//     //         if (err) {
//     //           resolve(null);
//     //           return null;
//     //         }
//     //         return resolve(results);
//     //       }
//     //     );
//     //   });

//     //   data.then(function (results) {
//     //     if (results && results.length) {
//     //       let check = results[0].status == "canceled_by_scoring";
//     //       let res = [
//     //         {
//     //           ...results[0],
//     //           canceled: check ? 1 : 0,
//     //           finished: !check ? 1 : 0,
//     //         },
//     //       ];

//     //       for (let i = 1; i < results.length; i++) {
//     //         if (results[i].date == res[res.length - 1].date) {
//     //           res[res.length - 1].fullname += ("\n"+ results[i].fullname);
//     //         } else {
//     //           res.push(results[i]);
//     //         }

//     //         check = results[i].status == "canceled_by_scoring";
//     //         res[res.length - 1] = {
//     //           ...res[res.length - 1],
//     //           canceled: (check ? 1 : 0) + (res[res.length - 1].canceled ?? 0),
//     //           finished: (!check ? 1 : 0) + (res[res.length - 1].finished ?? 0),
//     //         };
//     //       }
//     //       // console.log(res);
//     //       console.log(res);
//     //     }

//     //   });

//     //   // let zayavkalar = await new Promise(function (resolve, reject) {
//     //   //   db.query(
//     //   //     `SELECT id,fullname,status,Date(created_time -interval 5 hour) as date from Zayavka where status in("finished","paid","progress","canceled_by_scoring") and id>55;`,
//     //   //     function (err, results, fields) {
//     //   //       if (err) {
//     //   //         resolve(null);
//     //   //         return null;
//     //   //       }
//     //   //       return resolve(results);
//     //   //     }
//     //   //   );
//     //   // });
//     //   // console.log(zayavkalar.length);
//     //   // for (let index = 0; index < zayavkalar.length; index++) {
//     //   //   const element = zayavkalar[index];
//     //   //   await bot.sendMessage(
//     //   //     chatId,
//     //   //     `ID : ${element.id} \nFULLNAME : ${element.fullname} \nSTATUS : ${element.status}\nDATE : ${element.date}`
//     //   //   );
//     //   // }
//     // }

//     if (msg.text == "/data") {
//       zayavkalar1 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id)  from Zayavka WHERE  status='progress'`,
//           function (err, results, fields) {
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });
//       zayavkalar2 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id)  from Zayavka WHERE  status='canceled_by_scoring'`,
//           function (err, results, fields) {
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });
//       zayavkalar3 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id) from Zayavka WHERE  status='canceled_by_client'`,
//           function (err, results, fields) {
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });
//       zayavkalar4 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id) from Zayavka WHERE  status='canceled_by_daily'`,
//           function (err, results, fields) {
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });
//       zayavkalar5 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id) from Zayavka WHERE  status='finished' or status='paid'`,
//           function (err, results, fields) {
//             console.log(err);
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });

//       zayavkalar8 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id),sum(payment_amount) from Zayavka WHERE paid_status='paid' `,
//           function (err, results, fields) {
//             console.log(err);
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });
//       zayavkalar9 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id) from Zayavka`,
//           function (err, results, fields) {
//             console.log(err);
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });

//       let conceled_zayavkalar =
//         zayavkalar2[0]["count(id)"] +
//         zayavkalar3[0]["count(id)"] +
//         zayavkalar4[0]["count(id)"];
//       let paid_zayavkalar = zayavkalar8[0]["count(id)"];
//       let summa = zayavkalar8[0]["sum(payment_amount)"];
//       let finished_zayavkalar = zayavkalar5[0]["count(id)"];
//       console.log(JSON.stringify(zayavkalar5[0]["count(id)"]));

//       bot.sendMessage(
//         chatId,
//         `Umumiy Zayavkalar :${
//           zayavkalar9[0]["count(id)"]
//         }\nuspeshna : ${finished_zayavkalar}\npul ko'chirilgan : ${paid_zayavkalar}  ^ ${toMoney(
//           Math.floor(summa)
//         )}\nscoring otkaz : ${zayavkalar2[0]["count(id)"]}`
//       );
//     } else if (msg.text == "/bugun") {
//       zayavkalar1 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id)  from Zayavka WHERE  status='progress' and DATE(now() - INTERVAL 5 HOUR)=DATE(created_time - INTERVAL 5 HOUR);`,
//           function (err, results, fields) {
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });
//       zayavkalar2 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id)  from Zayavka WHERE  status='canceled_by_scoring' and DATE(now() - INTERVAL 5 HOUR)=DATE(created_time - INTERVAL 5 HOUR);`,
//           function (err, results, fields) {
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });
//       zayavkalar3 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id) from Zayavka WHERE  status='canceled_by_client' and DATE(now() - INTERVAL 5 HOUR)=DATE(created_time - INTERVAL 5 HOUR);`,
//           function (err, results, fields) {
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });
//       zayavkalar4 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id) from Zayavka WHERE  status='canceled_by_daily' and DATE(now() - INTERVAL 5 HOUR)=DATE(created_time - INTERVAL 5 HOUR);`,
//           function (err, results, fields) {
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });
//       zayavkalar5 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id) from Zayavka WHERE  (status='finished' or status='paid') and DATE(now() - INTERVAL 5 HOUR)=DATE(created_time - INTERVAL 5 HOUR);`,
//           function (err, results, fields) {
//             console.log(err);
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });

//       zayavkalar8 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id),sum(payment_amount) from Zayavka WHERE paid_status='paid' and DATE(now() - INTERVAL 5 HOUR)=DATE(created_time - INTERVAL 5 HOUR);`,
//           function (err, results, fields) {
//             console.log(err);
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });
//       zayavkalar9 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id) from Zayavka WHERE DATE(now() - INTERVAL 5 HOUR)=DATE(created_time - INTERVAL 5 HOUR);`,
//           function (err, results, fields) {
//             console.log(err);
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });

//       let conceled_zayavkalar =
//         zayavkalar2[0]["count(id)"] +
//         zayavkalar3[0]["count(id)"] +
//         zayavkalar4[0]["count(id)"];
//       let paid_zayavkalar = zayavkalar8[0]["count(id)"];
//       let summa = zayavkalar8[0]["sum(payment_amount)"];
//       let finished_zayavkalar = zayavkalar5[0]["count(id)"];
//       console.log(JSON.stringify(zayavkalar5[0]["count(id)"]));

//       bot.sendMessage(
//         chatId,
//         `-- Bugun --\nUmumiy Zayavkalar :${
//           zayavkalar9[0]["count(id)"]
//         }\nuspeshna : ${finished_zayavkalar} \npul ko'chirilgan : ${paid_zayavkalar} ^ ${toMoney(
//           Math.floor(summa)
//         )} \nscoring otkaz : ${zayavkalar2[0]["count(id)"]}`
//       );
//     } else if (msg.text == "/kecha") {
//       zayavkalar1 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id)  from Zayavka WHERE  status='progress' and  DATE(now() - INTERVAL 5 HOUR) - 1 = DATE(created_time - INTERVAL 5 HOUR)`,
//           function (err, results, fields) {
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });
//       zayavkalar2 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id)  from Zayavka WHERE  status='canceled_by_scoring' and  DATE(now() - INTERVAL 5 HOUR) - 1 = DATE(created_time - INTERVAL 5 HOUR)`,
//           function (err, results, fields) {
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });
//       zayavkalar3 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id) from Zayavka WHERE  status='canceled_by_client' and  DATE(now() - INTERVAL 5 HOUR) - 1 = DATE(created_time - INTERVAL 5 HOUR)`,
//           function (err, results, fields) {
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });
//       zayavkalar4 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id) from Zayavka WHERE  status='canceled_by_daily' and  DATE(now() - INTERVAL 5 HOUR) - 1 = DATE(created_time - INTERVAL 5 HOUR)`,
//           function (err, results, fields) {
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });
//       zayavkalar5 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id) from Zayavka WHERE (status='finished' or status='paid') and  DATE(now() - INTERVAL 5 HOUR) - 1 = DATE(created_time - INTERVAL 5 HOUR)`,
//           function (err, results, fields) {
//             console.log(err);
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });

//       zayavkalar8 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id),sum(payment_amount) from Zayavka WHERE paid_status='paid' and  DATE(now() - INTERVAL 5 HOUR) - 1 = DATE(created_time - INTERVAL 5 HOUR )`,
//           function (err, results, fields) {
//             console.log(err);
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });

//       zayavkalar9 = await new Promise(function (resolve, reject) {
//         db.query(
//           `SELECT count(id) from Zayavka where DATE(now() - INTERVAL 5 HOUR) - 1 = DATE(created_time - INTERVAL 5 HOUR )`,
//           function (err, results, fields) {
//             console.log(err);
//             if (err) {
//               resolve(null);
//               return null;
//             }
//             return resolve(results);
//           }
//         );
//       });

//       let conceled_zayavkalar =
//         zayavkalar2[0]["count(id)"] +
//         zayavkalar3[0]["count(id)"] +
//         zayavkalar4[0]["count(id)"];
//       let paid_zayavkalar = zayavkalar8[0]["count(id)"];
//       let summa = zayavkalar8[0]["sum(payment_amount)"];
//       let finished_zayavkalar = zayavkalar5[0]["count(id)"];
//       console.log(JSON.stringify(zayavkalar5[0]["count(id)"]));

//       bot.sendMessage(
//         chatId,
//         `-- Kecha --\nUmumiy Zayavkalar : ${
//           zayavkalar9[0]["count(id)"]
//         }\nuspeshna : ${finished_zayavkalar} \npul ko'chirilgan : ${paid_zayavkalar}  ^ ${toMoney(
//           Math.floor(summa)
//         )}\nscoring otkaz : ${zayavkalar2[0]["count(id)"]}`
//       );
//     } else if (
//       msg.text == "/log" &&
//       (chatId == 2053690211 || chatId == 1955031743)
//     ) {
//       try {
//         bot.sendDocument(
//           chatId,
//           path.join(__dirname, "..", "controllers", "scoring_data.txt")
//         );
//         bot.sendDocument(
//           chatId,
//           path.join(__dirname, "..", "controllers", "output.txt")
//         );
//       } catch (error) {
//         console.log(error);
//       }
//     } else {
//       var filePath = path.join(
//         __dirname,
//         "..",
//         "..",
//         "public",
//         "myid",
//         `${msg.text}.png`
//       );
//       if (fs.existsSync(filePath)) {
//         console.log("File is exist");
//         bot.sendPhoto(chatId, filePath);
//         // bot.sendPhoto(chatId,path.join(
//         //   __dirname,
//         //   "..",
//         //   "..",
//         //   "public",
//         //   "images",
//         //   `zayavka192.jpg`
//         // ))
//       } else {
//         bot.sendMessage(chatId, "Not Found");
//       }
//     }
//   }
// });

// function toMoney(number) {
//   if (!number) {
//     return "0";
//   }
//   let result = "";
//   for (let i = 0; i < number.toString().length; i++) {
//     result += number.toString()[i];
//     if ((number.toString().length - i) % 3 == 1) {
//       result += " ";
//     }
//   }
//   return result;
// }

// module.exports = bot;
