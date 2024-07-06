require("./src/config/_index.js");

let fs = require("fs");

var express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const bodyParser = require("body-parser");
let axios = require("axios");

let router3 = require("./src/routes/_index_3");
// built in middlewares
const logger = require("./src/middlewares/logger.js");
const rateLimit = require("./src/middlewares/rate-limit.js");
const errorHandler = require("./src/middlewares/error-handler.js");

const app = express();

let db = require("./src/config/db");

const checkToken = require("./src/middlewares/check-token.js");
let PREMIUM = require("./Premium-Query").PREMIUM;

// PORT
const PORT = 2222;
// app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
// app.use(bodyParser.json({ limit: "50mb" }));

// app.use((req, res, next) => {
//   // console.log(`${req.method} ${req.originalUrl} [STARTED]`)
//   // const start = process.hrtime()

//   res.on("finish", () => {
//     const durationInMilliseconds = getDurationInMilliseconds(
//       req.duration_start
//     );

//     if (req.errorMethod) {
//       req.duration = `${durationInMilliseconds.toLocaleString()} ms`;
//       let text =
//         "<b>ERROR ON TEST-SERVER : %0A" +
//         req.errorMethod +
//         " " +
//         res.statusCode +
//         " " +
//         req.duration +
//         "</b>" +
//         req.errorText;
//       let url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendmessage?chat_id=-${process.env.ERROR_GROUP_ID}&text=${text}&parse_mode=HTML`;
//       axios
//         .post(url)
//         .then((res) => res)
//         .catch((err) => console.log(err));
//     }
//   });

//   req.duration_start = process.hrtime();
//   next();
// });

app.use(morgan("dev"));

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(cors(), rateLimit());

// static

let mime = require("mime-types");
const { InternalServerError, NotFoundError, BadRequestError } = require("./src/utils/errors.js");


const pdf_generate = require("./src/utils/pdf_generate.js");
app.get("/graph",checkToken, async (req, res, next) => {
  try {
    if (!req.orderId) {
      return next(new NotFoundError(400, "orderId required"));
    }

    let Zayavka = await new Promise(function (resolve, reject) {
      db.query(
        `SELECT merchant.name as merchant_name,TestZayavka.* from TestZayavka,merchant where TestZayavka.id=${req.orderId} and merchant.id=TestZayavka.merchant_id;`,

        // `select TestZayavka.* ,merchant.name as merchant_name from TestZayavka join merchant on TestZayavka.merchant_id=merchant.id where TestZayavka.id=${id};`,
        function (err, results, fields) {
          if (err) {
            console.log(err);
            reject(err);
            return null;
          }
          if (results.length > 0) {
            resolve(results[0]);
          } else {
            resolve(null);
          }
        }
      );
    });
    if (!Zayavka) {
      return next(new NotFoundError(404, "Zayaka not found"));
    }

    if(!(Zayavka.status =="finished" ||  Zayavka.status =="paid")){
        return next(new BadRequestError(400, "Zayavka isnot finished"));
    }
  
    let newFilePath = path.join(
      __dirname,
      "public",
      "graphs",
      `graph-${Zayavka.id}.pdf`
    );

    if (fs.existsSync(newFilePath)) {
      let pdfData = fs.readFileSync(newFilePath);
      res.contentType("application/pdf");

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=graph-${Zayavka.id}.pdf`
      );

      return res.send(pdfData);
    } else {
      await pdf_generate(Zayavka, "graph-templete.html",newFilePath);

      let pdfData = fs.readFileSync(newFilePath);
      res.contentType("application/pdf");

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=graph-${Zayavka.id}.pdf`
      );

    return  res.send(pdfData);
    }
  } catch (error) {
    console.log(error);
    return next(new InternalServerError(500, error));
  }
});


app.use("/static", checkToken, express.static(path.join(__dirname, "public")));


app.use("/api/v3", router3);

app.use(helmet());

// error handling
app.use(errorHandler);
app.use(logger);

// testing server
app.get("/", (req, res) => res.send("premium pay"));
;
// starting server
app.listen(PORT, async () => {
  console.log(`server ready on port:${PORT}`);

});

const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};
