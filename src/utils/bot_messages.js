const axios =require("axios")
const bot= require("../bot/bot")

class BotMessages {
  constructor() {
    this.chatids = [6702785171, 1955031743];
  }
  SendSuccessInfo(zayavka, fillial, limit_amount) {
    let text =
      "<b>" +
      "✅" +
      "ID : " +
      zayavka.id +
      "%0A" +
      "%0A" +
      "LIMIT : " +
      toMoney(Math.floor(limit_amount)) +
      "%0A" +
      "FULLNAME : " +
      zayavka.fullname +
      "%0A" +
      "Dokon : " +
      fillial.name
        .replaceAll("-", " ")

        .replaceAll("'", " ")
        .replaceAll("ʻ", "")
        .replaceAll('"', "") +
      "</b>";
    for (let chatid of this.chatids) {
      let url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendmessage?chat_id=${chatid}&text=${text}&parse_mode=HTML`;
      axios
        .post(url)
        .then((res) => res)
        .catch((err) => console.log(err));
    }
  }
  sendCancelInfo(zayavka, fillial, prichina) {
let text =
  "🚫" +
  "\n" +
  "ID : " +
  zayavka.id +
  "\n"  +
  "FULLNAME : " +
  zayavka.fullname
    .replaceAll("-", " ")
    .replaceAll("'", " ")
    .replaceAll("ʻ", "")
    .replaceAll('"', "") +
  "\n" +
  "Dokon : " +
  fillial.name
    .replaceAll("-", " ")
    .replaceAll("'", " ")
    .replaceAll("ʻ", "")
    .replaceAll('"', "") +
  "\n";
 "reason :" + (prichina ??  "TIMEOUT");


      try{
 for (let chatid of this.chatids) {
  //  let url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendmessage?chat_id=${chatid}&text=${text}&parse_mode=HTML`;
  //  axios
  //    .post(url)
  //    .then((res) => res)
  //    .catch((err) => console.log(err));
  bot.sendMessage(chatid, text);
 }
      }
      catch(e){
        console.log(e)
      }
   
  }
  sentScoringInfo(zayavka, fillial) {
    try{
let text =
  "🚀🚀🚀" +
  "\n" +
  "ID : " +
  zayavka.id +
  "\n" +
  "PASSPORT : " +
  zayavka.passport +
  "\n" +
  "FULLNAME : " +
  zayavka.fullname
    .replaceAll("-", " ")
    .replaceAll("'", " ")
    .replaceAll("ʻ", "")
    .replaceAll('"', "") +
  "\n" +
  "Dokon : " +
  fillial.name
    .replaceAll("-", " ")
    .replaceAll("'", " ")
    .replaceAll("ʻ", "")
    .replaceAll('"', ""); 
    
  
 for (let chatid of this.chatids) {
    bot.sendMessage(chatid, text);

 }
    }
    catch(error){
      console.log(error)
    }
   
  }
  sentOformitInfo(zayavka,fillial,oformit_summa){
     let text =
       "<b>" +
       "✅" +
       "ID : " +
       zayavka.id +
       "%0A" +
       "%0A" +
       "LIMIT : " +
       toMoney(Math.floor(limit_amount)) +
       "%0A" +
       "FULLNAME : " +
       zayavka.fullname +
       "%0A" +
       "Dokon : " +
       fillial.name
         .replaceAll("-", " ")

         .replaceAll("'", " ")
         .replaceAll("ʻ", "")
         .replaceAll('"', "") +
       "</b>";
     for (let chatid of this.chatids) {
       let url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendmessage?chat_id=${chatid}&text=${text}&parse_mode=HTML`;
       axios
         .post(url)
         .then((res) => res)
         .catch((err) => console.log(err));
     }
  }
}

module.exports = new BotMessages();