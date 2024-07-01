const { Router } = require("express");
const ErrorController = require("../controllers/10.errors");
const router = Router();

router.post("/", ErrorController.sendError);

module.exports = router;