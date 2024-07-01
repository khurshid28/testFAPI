const { Router } = require("express");
const uploadImageController = require("../controllers/upload_image.js");
const upload = require("./../utils/upload")
const checkToken = require("../middlewares/check-token.js");


const router = Router();
router.use(checkToken);
router.post("/",upload.single("image"), uploadImageController.upload);


module.exports = router;