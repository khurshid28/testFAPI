const { Router } = require("express");
const qrController = require("../controllers/12.qrcode.js");
const checkUser = require("../middlewares/check-user.js");
const router = Router();

router.post("/validate", qrController.validate);


module.exports = router;