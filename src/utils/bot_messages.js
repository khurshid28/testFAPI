const axios =require("axios")

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
   "<b>" +
   "ID : " +
   zayavka.id +
   "%0A" +
   "PASSPORT : " +
   zayavka.passport +
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
      try{
 for (let chatid of this.chatids) {
   let url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendmessage?chat_id=${chatid}&text=${text}&parse_mode=HTML`;
   axios
     .post(url)
     .then((res) => res)
     .catch((err) => console.log(err));
 }
      }
      catch(e){
        console.log(e)
      }
   
  }
  sentScoringInfo(zayavka, fillial) {
    try{
let text =
  "<b>" +

  "ID : " +
  zayavka.id +
  "%0A" +
   
  "PASSPORT : " +
  zayavka.passport +
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