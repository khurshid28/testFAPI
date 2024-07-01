const { Router } = require("express");
const merchantController = require("../controllers/1.merchant");
const checkToken = require("../middlewares/check-token.js");
const checkBlocked = require("../middlewares/check-blocked.js");

const router = Router();

router.use(checkToken);
router.use(checkBlocked);
router.post("/create", merchantController.create);
router.get("/getAll", merchantController.getAll);
router.get("/:id", merchantController.get);



module.exports = router;