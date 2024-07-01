const { Router } = require("express");
const adminController = require("../controllers/4.admin.js");
const checkToken = require("../middlewares/check-token.js");
const checkBlocked = require("../middlewares/check-blocked.js");

const router = Router();

router.use(checkToken);
router.use(checkBlocked);
// router.post("/create", adminController.create);
// router.get("/getAll", merchantController.getAll);
router.get("/:id", adminController.getbyId);


module.exports = router;