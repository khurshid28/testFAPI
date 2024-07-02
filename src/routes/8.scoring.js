const { Router } = require("express");
const scoringController = require("../controllers/8.scoring.js");

// const checkToken = require("../middlewares/check-token.js");
// const checkBlocked = require("../middlewares/check-blocked.js");

const router = Router();

// router.use(checkToken);
// router.use(checkBlocked);

// router.get("/result", scoringController.get);


router.post("/result", scoringController.post);


module.exports = router;

