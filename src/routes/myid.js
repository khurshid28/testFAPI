const { Router } = require("express");
const myidController = require("../controllers/myid.js");
const checkToken = require("../middlewares/check-token.js");
const checkBlocked = require("../middlewares/check-blocked.js");
const checkUser = require("../middlewares/check-user.js");
const myIdMiddleware = require("../middlewares/check-myid.js");

const multer = require("multer");
const Storage = multer.diskStorage({
  destination: 'public/extraImages',
  filename: (req, file,cb) =>{
    cb(null, file.originalname)
  }
})


const upload = multer({
  storage: Storage,
}).single('image')




const router = Router();

// router.use(checkToken);
// router.use(checkBlocked);
// router.use(checkUser);

router.post("/image",upload, myidController.imageGetMe);
router.post("/check", myidController.check);
router.post("/",myIdMiddleware, myidController.getMe);
router.get("/base64/:passport", myidController.base64);




module.exports = router;