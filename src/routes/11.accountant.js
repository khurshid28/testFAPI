const { Router } = require("express");
const accountantController = require("../controllers/11.accountant.js");

const router = Router();

router.post("/create", accountantController.create);
router.post("/pay/", accountantController.pay);

module.exports = router;