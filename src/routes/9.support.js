const { Router } = require("express");
const supportController = require("../controllers/9.support");
const checkToken = require("../middlewares/check-token.js");
const checkBlocked = require("../middlewares/check-blocked.js");

const router = Router();


router.use(checkToken);
router.use(checkBlocked);


router.post("/", supportController.sendMessage);

module.exports = router;