let axios = require("axios");
const path = require("path");
let fs = require("fs");
let db = require("../config/db");

const {
  InternalServerError,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} = require("../utils/errors.js");

class Fapi {
  async login() {
    const login = process.env.FAPI_LOGIN;
    const response1 = await axios.post(
      login,
      {
        client_id: process.env.CLIENT_ID,
        grant_type: process.env.GRANT_TYPE,
        client_secret: process.env.CLIENT_SECRET,
        username: process.env.FAPI_USERNAME,
        password: process.env.FAPI_PASSWORD,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 10000,
      }
    );
    console.log("logged");
    return response1.data;
  }
  async sendSms(phoneNumber, text) {
    try {
      let access_token = (await this.login())["access_token"];
      let url = process.env.FAPI_SMS_URL;
      let response = await axios.post(
        url,
        {
          recipient: phoneNumber,
          content: text,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  async scoringSend(phoneNumber, pinfl) {
    let response;
    try {
      let access_token = (await this.login())["access_token"];
      let url = process.env.FAPI_scoring_send;
      response = await axios.post(
        url,
        {
          buyerPinfl: pinfl,
          buyerPhone:phoneNumber,
          totalAmount: 50000000,
          contractDate: formattedDate(),
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async scoringCheck(contractId) {
    let response;
    try {
      let access_token = (await this.login())["access_token"];
      let url = process.env.FAPI_scoring_check;
      response = await axios.post(
        url,
        {
          contractId,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async addGoods(contractId, scoringId, amount, products) {
    let response;
    try {
      let access_token = (await this.login())["access_token"];
      let url = process.env.FAPI_add_goods;
      response = await axios.post(
        url,
        {
          contractId: contractId,
          scoringId: scoringId,
          amount: amount,
          goods: products,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async ContractPreview(contractId) {
    try {
      let access_token = (await this.login())["access_token"];
      let url = process.env.FAPI_PREVIEW_CONTRACT;
      let response = await axios.post(
        url,
        {
          contractId,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  async LoanPreview(contractId) {
    try {
      let access_token = (await this.login())["access_token"];
      let url = process.env.FAPI_PREVIEW_LOAN;
      let response = await axios.post(
        url,
        {
          contractId,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
   
    
      return response.data
    } catch (error) {
      
       throw error
    }
  }
  async sendLimitMessage(id, price) {
    try {
      let zayavka = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT * from Zayavka WHERE id=${id}`,
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
      if (!zayavka) return;
      await this.sendSms(
        zayavka.phoneNumber.replaceAll("+", ""),
        `Hurmatli ${zayavka.fullname}, Sizga PremiumPay tomonidan ${toMoney(
          Math.floor(price)
        )} so'm miqdorida limit ajratildi\n Hamkorlarimizdan xaridni davom ettiring !!!`
      );

      // await this.sendSms(
      //   "998946161122",
      //   `Hurmatli Qosimjonov Abdulaziz, Sizga PremiumPay tomonidan ${toMoney(
      //     12734000
      //   )} so'm miqdorida limit ajratildi\n Hamkorlarimizdan xaridni davom ettiring !!!`
      // );

      console.log(
        `Hurmatli ${zayavka.fullname}, Sizga PremiumPay tomonidan ${toMoney(
          Math.floor(price)
        )} so'm miqdorida limit ajratildi !!!`
      );
    } catch (error) {
      console.log(error);
    }
  }

  async sendCancelMessage(id) {
    try {
      let zayavka = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT * from Zayavka WHERE id=${id}`,
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
      if (!zayavka) return;
      await this.sendSms(
        zayavka.phoneNumber.replaceAll("+", ""),
        `Hurmatli mijoz sizning muddatli to'lov bo'yicha PremiumPayga yuborilgan so'rovnomangiz rad etildi. Ma'lumot uchun: +998935034000`
      );

      console.log(
        `Hurmatli mijoz sizning muddatli to'lov bo'yicha PremiumPayga yuborilgan so'rovnomangiz rad etildi. Ma'lumot uchun: +998935034000`
      );
    } catch (error) {
      console.log(error);
    }
  }

  async sendOformitMessage(id) {
    try {
      let zayavka = await new Promise(function (resolve, reject) {
        db.query(
          `SELECT * from Zayavka WHERE id=${id}`,
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
      if (!zayavka) return;
      await this.sendSms(
        zayavka.phoneNumber.replaceAll("+", ""),
        `Hurmatli mijoz, ID: ${zayavka.loanId}\nBankdan olingan mikroqarzingizni mobil ilovalar orqali so'ndirishingiz mumkin;\nMuddati o'tgan qarzdorlik vujudga kelganda karta raqamingizdan avtomatik tarzda yechiladi\nMa'lumot uchun: +998935034000`
      );
      console.log(
        `Hurmatli mijoz, ID: ${zayavka.loanId}\n Bankdan olingan mikroqarzingizni mobil ilovalar orqali so'ndirishingiz mumkin;\nMuddati o'tgan qarzdorlik vujudga kelganda karta raqamingizdan avtomatik tarzda yechiladi\nMa'lumot uchun: +998935034000`
          .length
      );
    } catch (error) {
      console.log(error);
    }
  }
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

function formattedDate() {
  const date = new Date();

  // Get the day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

module.exports = new Fapi();
