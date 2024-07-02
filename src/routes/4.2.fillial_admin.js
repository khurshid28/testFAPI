const { Router } = require("express");
const fillialAdminController = require("../controllers/4.2.fillial_admin");
const checkToken = require("../middlewares/check-token.js");
const checkBlocked = require("../middlewares/check-blocked.js");

const router = Router();

router.use(checkToken);
router.use(checkBlocked);
router.post("/create", fillialAdminController.create);
router.post("/getAll", fillialAdminController.getAll);


module.exports = router;