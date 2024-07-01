const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");
const botToken = "6775552139:AAFsKqrDUpTMCgZj1Y9LbkrOR9y6IM7ZF5k";

const bot = new TelegramBot(botToken, { polling: true });

// let userData[chatId].currentState= "start";

const keyboard = {
  inline_keyboard: [[{ text: "Boshladik", callback_data: "begin" }]],
};
const keyboard2 = {
  inline_keyboard: [
    [
      { text: "Tasdiqlayman", callback_data: "agree" },
      { text: "Yo'q", callback_data: "disagree" },
    ],
  ],
};
const sentInline = {
  inline_keyboard: [[{ text: "Yuborilgan", callback_data: "yuborilgan" }]],
};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const user_id = msg.chat.id;

  // console.log(chatId);
  let userData = JSON.parse(fs.readFileSync(path.join(__dirname,"userData.json"), "utf8"));
  userData[chatId] ??= { currentState: "start" };
  // if (userData[chatId].currentState == "done") {
  //    bot.sendMessage(
  //      chatId,
  //      `Hurmatli hamkor!, sizning ma'lumotlaringiz yozib olib bo'lindi !! `
  //    );
  // }

  // let user = userData[chatId] ?? { currentState :"start"}
  console.log(userData[chatId].currentState);
  if (msg.text == "/start") {
    //  if (userData[chatId].currentState == "done" || msg.photo) {
    //    bot.sendMessage(
    //      chatId,
    //      `Hurmatli hamkor!, sizning ma'lumotlaringiz yozib olib bo'lindi !! `
    //    );
    //  }
    if (false) {
      1 + 2;
    } else {
      bot.sendMessage(
        chatId,
        "Assalomu Alaykum! Premium Payning rasmiy botiga xush kelibsiz !\n\nIltimos quyidagi savollarga  aniqlik bilan javob bering: ",
        { reply_markup: JSON.stringify(keyboard) }
      );
      userData[chatId].currentState = "begin";
    }
  } else if (msg.text != "/start" && msg.text != "tasdiqlayman") {
    const chatId = msg.chat.id;

    switch (userData[chatId].currentState) {
      case "name":
        if (msg.text) {
          userData[chatId].name = msg.text;
          bot.sendMessage(
            chatId,
            `✅yaxshi ,firma guvohnomasini rasmini yuboring ! (jpg/png)`
          );

          userData[chatId].currentState = "guvohnoma";
          break;
        } else {
          bot.sendMessage(chatId, `Iltmos do'kon nomini to'gri kiriting !`);
          userData[chatId].currentState = "name";
          break;
        }
      case "guvohnoma":
        if (msg.photo) {
          // console.log(">>>",userData[chatId].currentState);
          const guvohnoma_id = msg.photo[msg.photo.length - 1]["file_id"];

          userData[chatId].guvohnoma_id = guvohnoma_id;
          fs.writeFileSync(path.join(__dirname,"userData.json"), JSON.stringify(userData), "utf8");

          bot.sendMessage(
            chatId,
            `✅yaxshi ,firma direktorining pasport kopiyasi rasmini yuboring! (jpg/png)`
          );
          userData[chatId].currentState = "passkopiya";
        } else {
          bot.sendMessage(chatId, `iltimoss rasmini yuboring ‼️ (jpg/png)`);
          userData[chatId].currentState = "guvohnoma";
        }

        break;
      case "passkopiya":
        if (msg.photo) {
          //  const userData = JSON.parse(
          //    fs.readFileSync(path.join(__dirname,"userData.json"), "utf8")
          //  );
          const pasport_id = msg.photo[msg.photo.length - 1]["file_id"];
          //  if (!userData[chatId]) {
          //    userData[chatId] = {};
          //  }
          userData[chatId].pasport_id = pasport_id;
          fs.writeFileSync(path.join(__dirname,"userData.json"), JSON.stringify(userData), "utf8");
          bot.sendMessage(
            chatId,
            `iltimos firma direktorining telefon raqamini yuboring:\n\n masalan: 931234567 `
          );
          userData[chatId].currentState = "ndsguvohnoma";
          break;
        } else {
          bot.sendMessage(chatId, `iltimos rasm yuboring ‼️ (jpg/png)`);
          userData[chatId].currentState = "passkopiya";
          break;
        }
      case "passkopiya":
        if (msg.photo) {
          //  const userData = JSON.parse(
          //    fs.readFileSync(path.join(__dirname,"userData.json"), "utf8")
          //  );
          const pasport_id = msg.photo[msg.photo.length - 1]["file_id"];
          //  if (!userData[chatId]) {
          //    userData[chatId] = {};
          //  }
          userData[chatId].pasport_id = pasport_id;
          fs.writeFileSync(path.join(__dirname,"userData.json"), JSON.stringify(userData), "utf8");
          bot.sendMessage(
            chatId,
            `iltimos firma direktorining telefon raqamini yuboring:\n\n masalan: 931234567 `
          );
          userData[chatId].currentState = "ndsguvohnoma";
          break;
        } else {
          bot.sendMessage(chatId, `iltimos rasm yuboring ‼️ (jpg/png)`);
          userData[chatId].currentState = "passkopiya";
          break;
        }

      case "ndsguvohnoma":
        if (msg.photo) {
          bot.sendMessage(chatId, `iltimos raqamni namunadagidek  yuboring !`);
          userData[chatId].currentState = "ndsguvohnoma";
          break;
        } else if (msg.text.length == 9) {
          userData[chatId].telefon_raqam = msg.text;
          fs.writeFileSync(path.join(__dirname,"userData.json"), JSON.stringify(userData), "utf8");
          bot.sendMessage(
            chatId,
            `✅yaxshi!, nds guvohnomani yuboring (jpg/png)`
          );
          userData[chatId].currentState = "firma_rekv";

          break;
        } else {
          bot.sendMessage(chatId, `iltimos raqamni namunadagidek  yuboring !`);
          userData[chatId].currentState = "ndsguvohnoma";
          break;
        }

      case "firma_rekv":
        if (msg.photo) {
          const nds_id = msg.photo[msg.photo.length - 1]["file_id"];

          userData[chatId].nds_id = nds_id;
          fs.writeFileSync(path.join(__dirname,"userData.json"), JSON.stringify(userData), "utf8");
          bot.sendMessage(
            chatId,
            `✅yaxshi!, endi firma rekvizit rasmini yuboring:`
          );
          userData[chatId].currentState = "images";
          break;
        } else {
          bot.sendMessage(chatId, `iltimos rasm yuboring ‼️ (jpg/png)`);
          userData[chatId].currentState = "firma_rekv";
          break;
        }

      case "images":
        if (msg.photo) {
          const firma_rekv = msg.photo[msg.photo.length - 1]["file_id"];
          userData[chatId].firma_rekv = firma_rekv;
          fs.writeFileSync(path.join(__dirname,"userData.json"), JSON.stringify(userData), "utf8");

          bot.sendMessage(
            chatId,
            `✅yaxshi!, endi esa do'konning rasmlarini bittalab yuboring  \n\n 2 ta ichki tarafdan va 1 ta tashqi tarafdan\n\n 1 rasmni yuboring:`
          );
          userData[chatId].currentState = "image1";
          break;
        } else {
          bot.sendMessage(chatId, `iltimos rasm yuboring ‼️ (jpg/png)`);
          userData[chatId].currentState = "images";
          break;
        }
      case "image1":
        if (msg.photo) {
          const image1_id = msg.photo[msg.photo.length - 1]["file_id"];
          userData[chatId].image1_id = image1_id;
          fs.writeFileSync(path.join(__dirname,"userData.json"), JSON.stringify(userData), "utf8");
          bot.sendMessage(chatId, `2 -rasmni yuboring `);
        } else {
          bot.sendMessage(chatId, `✅iltimos rasm yuboring ‼️ (jpg/png)`);
        }
        userData[chatId].currentState = "image2"; // Reset to start for the next conversation
        break;
      case "image2":
        if (msg.photo) {
          const image2_id = msg.photo[msg.photo.length - 1]["file_id"];
          userData[chatId].image2_id = image2_id;
          fs.writeFileSync(path.join(__dirname,"userData.json"), JSON.stringify(userData), "utf8");
          bot.sendMessage(chatId, `so'ngi rasmni yuboring  `);
          userData[chatId].currentState = "finish";
        } else {
          bot.sendMessage(chatId, `iltimos rasm yuboring ‼️ (jpg/png)`);
        }
        // Reset to start for the next conversation
        break;
      case "finish":
        if (msg.photo) {
          const image3_id = msg.photo[msg.photo.length - 1]["file_id"];
          userData[chatId].image3_id = image3_id;
          fs.writeFileSync(path.join(__dirname,"userData.json"), JSON.stringify(userData), "utf8");

          // bot.sendMessage(
          //   chatId,
          //   `siznig so'rovingiz qabul qilindi, siz bilan buxgalterimiz bog'lanadi !`
          // );
          let media = [
            {
              media: `${userData[chatId].guvohnoma_id}`,

              type: "photo",
              caption: `telefon raqam +9989 ${userData[chatId].telefon_raqam}\n\n\n`,
              // parse_mode: "MarkdownV2",
              // parse_mode: "MarkdownV2",
            },
            {
              media: `${userData[chatId].pasport_id}`,

              type: "photo",
            },
            {
              media: `${userData[chatId].firma_rekv}`,

              type: "photo",

              // parse_mode: "MarkdownV2",
              // parse_mode: "MarkdownV2",
            },
            {
              media: `${userData[chatId].nds_id}`,

              type: "photo",

              // parse_mode: "MarkdownV2",
              // parse_mode: "MarkdownV2",
            },
            {
              media: `${userData[chatId].image1_id}`,

              type: "photo",

              // parse_mode: "MarkdownV2",
              // parse_mode: "MarkdownV2",
            },
            {
              media: `${userData[chatId].image2_id}`,

              type: "photo",
              // parse_mode: "MarkdownV2",
              // parse_mode: "MarkdownV2",
            },
            {
              media: `${userData[chatId].image3_id}`,

              type: "photo",
              // parse_mode: "MarkdownV2",
              // parse_mode: "MarkdownV2",
            },
          ];
          await bot.sendMediaGroup(chatId, media);
          await bot.sendMessage(chatId, "malumotlarni tasdiqlaysizmi ?", {
            reply_markup: JSON.stringify(keyboard2),
          });
          userData[chatId].currentState = "next";
        } else {
          bot.sendMessage(chatId, `iltimos rasm yuboring ‼️ (jpg/png)`);
        }

        break;

      default:
        bot.sendMessage(
          chatId,
          `nimadir xato ketdi, /start buyrug'i orqali botni qayta ishga tushurishingiz mumkin ! `
        );
        userData[chatId].currentState = "start";
        break;
    }
  }

  fs.writeFileSync(path.join(__dirname,"userData.json"), JSON.stringify(userData), "utf8");
});

bot.on("callback_query", async (query) => {
  const chatId = query.from.id;
  let userData = JSON.parse(fs.readFileSync(path.join(__dirname,"userData.json"), "utf8"));

  if (query.data == "begin") {
    bot.sendMessage(chatId, `Firma nomini to'liq kiriting :`);
    userData[chatId].currentState = "name";
  }
  if (query.data == "agree") {
    console.log(">>>>>>>");
    let media = [
      {
        media: `${userData[chatId].guvohnoma_id}`,
        type: "photo",
        caption: `telefon raqam +9989${userData[chatId].telefon_raqam}\n\ntelegram : @${query.from.username}\n\n firma: ${userData[chatId].name}`,
      },
      {
        media: `${userData[chatId].pasport_id}`,
        type: "photo",
      },
      {
        media: `${userData[chatId].firma_rekv}`,
        type: "photo",
      },
      {
        media: `${userData[chatId].nds_id}`,
        type: "photo",
      },
      {
        media: `${userData[chatId].image1_id}`,
        type: "photo",
      },
      {
        media: `${userData[chatId].image2_id}`,
        type: "photo",
      },
      {
        media: `${userData[chatId].image3_id}`,

        type: "photo",
        // parse_mode: "MarkdownV2",
        // parse_mode: "MarkdownV2",
      },
    ];

    if (
      userData[chatId].currentState == "next" &&
      userData[chatId].currentState != "done"
    ) {
      userData[chatId].currentState = "done";
      await bot.sendMediaGroup(49825747, media);

      await bot.sendMessage(
        chatId,
        `✅Sizning ma'lumotlaringiz yozib olindi, Siz bilan buxgalterimiz bog'lanadi !`
      );
      const buxgalterInline = {
        inline_keyboard: [
          [
            {
              text: "✅didox yuborildi",
              callback_data: `${chatId}` + "-sent",
            },
            {
              text: "❌Bekor qilish",
              callback_data: `${chatId}` + "-canceled",
            },
          ],
        ],
      };

      // console.log(chatId);
      await bot
        .sendMessage(49825747, `Hamkor statusi :`, {
          reply_markup: JSON.stringify(buxgalterInline),
        })
        

      userData[chatId].currentState = "done";
    }
  }

  if (query.data == "disagree") {
    console.log("<<<<<<");
    if (userData[chatId].currentState == "done") {
      bot.sendMessage(
        chatId,
        `Hurmatli hamkor!, sizning ma'lumotlaringiz yozib olib bo'lindi !! `
      );
    } else {
      bot.sendMessage(
        chatId,
        `Agar malumotlarda xatolik bo'lsa /start buyrug'i orqali botni qayta ishga tushurishingiz va malumotlarni qayta yuborishingiz mumkin bo'ladi ! `
      );
    }
  }

  if (query.data.split("-").length > 1) {
    let msgText = query.data.split("-")[1];
    let userId = query.data.split("-")[0];
    let message_id = query.data.split("-")[2];
    console.log(msgText);

    if (msgText == "sent" ) {
      if (
        userData[userId].currentState == "done" &&
        userData[userId].currentState != "sent" &&
        userData[userId].currentState != "ddocs received" &&
      userData[userId].currentState != "canceled" &&
      userData[userId].currentState != "fineshed" 
      
      ) {
        userData[userId].currentState = "sent";
        console.log("<<>>><<>>");
        if (userId) {
          const userInline = {
            inline_keyboard: [
              [
                {
                  text: "✅Qabul qilindi",
                  callback_data: `${chatId}` + "-received",
                },
              ],
            ],
          }; 
          bot.sendMessage(
            49825747,
            `✅ ${userData[userId].name} firmasiga shartnoma Jo'natilgani   haqidagi xabar yuborildi!`
          );

          bot.sendMessage(
            userId,
            "✅didoxdan shartnomani qabul qilib oling  hurmatli hamkor !",
            { reply_markup: JSON.stringify(userInline) }
          );
        }
      }
      else if (
        userData[userId].currentState == "sent" ||
        userData[userId].currentState == "ddocs received" ||
        userData[userId].currentState == "canceled" ||
        userData[userId].currentState == "fineshed"
        
      ) {
       
        bot.sendMessage(
          49825747,
          `${userData[userId].name} firmasiga avval allaqachon shartnoma yuborgansiz !`
        );
      }
    }
    if (
      msgText == "canceled"  
    ) {
      if (userData[userId].currentState=="done" &&
      userData[userId].currentState != "ddocs received" &&
      userData[userId].currentState != "canceled" &&
      userData[userId].currentState != "fineshed" &&
      userData[userId].currentState != "sent") {
          console.log(userData[userId].currentState);
          userData[userId].currentState = "canceled";
          bot.sendMessage(
            userId,
            `❌❌❌Hurmati Mijoz , siz keltirgan malumotlarga asosan biz siz bilan hozircha shartnoma tuza olmaymiz,Agar sizda qandaydir savollar bo'lsa biz bilan bog'lanishingiz mumkin ! \n @sardor1802`
          );
          bot.sendMessage(
            49825747,
            `❌  ${userData[userId].name} firmasiga shartnoma tuzmaslik haqidagi xabar yuborildi!`
          );
      }
      else if(userData[userId].currentState == "ddocs received" ||
      userData[userId].currentState == "canceled" ||
      userData[userId].currentState == "fineshed" ||
      userData[userId].currentState == "sent"){
        bot.sendMessage(
          49825747,
          `${userData[userId].name} firmasiga avval allaqachon shartnoma yuborgansiz !`
        );
      }

    
    }

    if (
      msgText == "received" &&
      userData[chatId].currentState != "ddocs received"
    ) {
      console.log(userId);
      userData[chatId].currentState = "ddocs received";

      bot.sendMessage(
        49825747,
        `✅✅  ${userData[chatId].name} firma shartnomani qabul qildi !`
      );
      userData[chatId].currentState= "finished"
      bot.sendMessage(chatId, `✅`);
      bot.sendMessage(
        chatId,
        `✅Hurmatli hamkor , shartnomani qabul qilganingiz haqidagi xabarni buxgalterimizga yetkazdik !`
      );
    } else if (userData[chatId].currentState == "ddocs received" && chatId != 49825747 ) {
      bot.sendMessage(
        chatId,
        `Sizning shartnomani qabul qilganingiz haqidagi xabar buxgalterimizga allaqachon yetqazildi !`
      );
    }
  }
  

  fs.writeFileSync(path.join(__dirname,"userData.json"), JSON.stringify(userData), "utf8");
});

// bot.on("polling_error", console.log);
