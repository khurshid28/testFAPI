var pdf = require("pdf-creator-node");
const path = require("path");
let fs = require("fs");

// function to encode file data to base64 encoded string
function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
}

module.exports = async function (zayavka,filename,newFilePath) {
  let options = {
    format: "A4",
    //  phantomPath: "./node_modules/phantomjs-prebuilt/bin/phantomjs",
  };

 
  let dt2 = new Date(zayavka.created_time.toString());

  dt2.setMonth(dt2.getMonth() + 12);

  let dateText2 = dt2
    .toISOString()
    .substring(0, 10)
    .split("-")
    .reverse()
    .join("-");
  dateText2 = "02" + dateText2.substring(2);
  let image1 = base64_encode(
    path.join(
      __dirname,
      "../",
      "../",
      "public",
      "templetes",
      `img`,
      "photo_2024-04-19_15-32-34.jpg"
    )
  );
  let image2 = base64_encode(
    path.join(
      __dirname,
      "../",
      "../",
      "public",
      "templetes",
      `img`,
      "photo_2024-04-19_15-32-42.jpg"
    )
  );
  let screenshot = base64_encode(
    path.join(__dirname, "../", "../", "public", "templetes", `img`, "srin.jpg")
  );

  var document = {
    html: fs.readFileSync(
      path.join(
        __dirname,
        "../",
        "../",

        "public",
        "templetes",
       `${filename}`
       
      ),
      "utf8"
    ),
    data: {
      ...zayavka,
      image1,
      image2,
      screenshot,
      amount: toMoney(zayavka.amount),
      payment_amount: toMoney(zayavka.payment_amount),
      payment_amount_month: toMoney(
        Math.floor(zayavka.payment_amount / zayavka.expired_month)
      ),
      created_time: zayavka.created_time.toISOString()
        .substring(0, 10)
        .split("-")
        .reverse()
        .join("-"),
      created_time_hour: zayavka.created_time.toISOString().substring(11, 16),
      passport_seria: zayavka.passport.substring(0, 2),
      passport_number: zayavka.passport.substring(2),
      products: zayavka.products.map((item) => {
        return { ...item, price: toMoney(item.price) };
      }),
      data: Array.from(Array(zayavka.expired_month), (_, x) => {
        let dt = new Date(zayavka.created_time.toString());

        dt.setMonth(dt.getMonth() + x + 1);

        let dateText = dt
          .toISOString()
          .substring(0, 10)
          .split("-")
          .reverse()
          .join("-");
        dateText = "02" + dateText.substring(2);
        console.log(dateText);
        return {
          count: x + 1,

          current_price: toMoney(
            Math.floor(zayavka.payment_amount / zayavka.expired_month) *
              (zayavka.expired_month - x - 1)
          ),
          payment_amount_month: toMoney(
            Math.floor(zayavka.payment_amount / zayavka.expired_month)
          ),

          date: dateText,
        };
      }),
      lastDate: dateText2,
    },
    path: newFilePath,
    type: "",
  };

  console.log(zayavka.created_time.toString().substring(11, 16));
  await pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  return newFilePath;
};

function toMoney(n) {
  if (n == null || n == 0) {
    return "0";
  }

  let result = "";
  let number = n.toString().split(".")[0];
  for (let i = 0; i < number.length; i++) {
    result += number[i];
    if ((number.length - i) % 3 == 1 && i != number.length - 1) {
      result += " ";
    }
  }
  let extraV = "00";
  if (n.toString().split(".").length > 1) {
    if (n.toString().split(".")[1].length > 1) {
      extraV = n.toString().split(".")[1].substring(0, 2);
    } else {
      extraV = n.toString().split(".")[1].substring(0, 1) + "0";
    }
  }
  return result + "," + extraV;
}
