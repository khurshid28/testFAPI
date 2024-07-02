const { Router } = require("express");
const CardController = require("../controllers/13.card.js");
const cardMiddlware = require("../middlewares/custom-card-middleware.js");
const checkUser = require("../middlewares/check-user.js");
const checkToken = require("../middlewares/check-token.js");
const router = Router();

router.use(checkToken);
router.use(checkUser);
router.use(cardMiddlware);
router.post("/sendOtp", CardController.sendOtp);
router.post("/verify", CardController.verify);
router.post("/check", CardController.check);

module.exports = router;
