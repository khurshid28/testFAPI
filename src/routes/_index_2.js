const { Router } = require("express");
const swaggerUi = require("swagger-ui-express");

const router = Router();


const myidRouter = require("./myid.js");

const loginRouter = require("./7.login.js");

const userRouter = require("./5.user.js");

const superRouter = require("./3.super.js");

const appRouter = require("./6.app.js");
const appTestRouter = require("./6.app.test.js");

const merchantRouter = require("./1.merchant.js");
const adminRouter = require("./4.1.admin.js");
const fillialAdminRouter = require("./4.2.fillial_admin.js");
const fillialRouter = require("./2.fillial");

const extraRouter = require("./extra.js");

const swaggerDoc = require("../docs/swagger.js");
const pdfRouter = require("./createPDF.js");
const uploadRouter = require("./uploadImage.js");

const scoringRouter = require("./8.scoring");
const scoringTestRouter = require("./8.scoring.test");



const supportRouter = require("./9.support");

const errorRouter = require("./10.errors");

const accountantRouter = require("./11.accountant");


router.use("/login", loginRouter);
router.use("/myid", myidRouter);
router.use("/user", userRouter);
router.use("/super", superRouter);




router.use("/fillial-admin", fillialAdminRouter);
// router.use("/api", extraRouter);
// router.use("/create-pdf", pdfRouter);
// router.use("/upload-image", uploadRouter);
router.use("/zayavka", appRouter);
router.use("/zayavka-test", appTestRouter);
router.use("/merchant", merchantRouter);

router.use("/admin", adminRouter);

router.use("/fillial", fillialRouter);


router.use("/scoring", scoringRouter);
router.use("/scoring-test", scoringTestRouter);
router.use("/support", supportRouter);
router.use("/error", errorRouter);
router.use("/accountant", accountantRouter);

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));


module.exports = router;
