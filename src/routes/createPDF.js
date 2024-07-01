const { Router } = require("express");
const pdfController = require("../controllers/create_pdf.js");
const checkToken = require("../middlewares/check-token.js");
const router = Router();
router.use(checkToken);
router.post("/", pdfController.create);


module.exports = router;