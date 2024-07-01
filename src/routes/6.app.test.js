
const multer = require("multer");
const Storage = multer.diskStorage({
  destination: 'public/images',
  filename: (req, file,cb) =>{
    cb(null,"zayavka"+ req.body.id +".jpg")
  }
})


const upload = multer({
  storage: Storage,
}).single('selfie')



const { Router } = require("express");
const appTestController = require("../controllers/6.app.test.js");
const checkToken = require("../middlewares/check-token.js");
const checkBlocked = require("../middlewares/check-blocked.js");
const checkZayavka = require("../middlewares/check-zayavka.js");
const checkUser = require("../middlewares/check-user.js");

const router = Router();

router.use(checkToken);
router.use(checkBlocked);

router.post("/update/1",checkUser, appTestController.update1);
router.post("/update/2",checkUser, appTestController.update2);
router.post("/update/3",checkUser, appTestController.update3);
// router.post("/update/4",checkUser, appTestController.update4);
router.post("/update/5",checkUser, appTestController.update5);
router.post("/update/6",checkUser, appTestController.update6);
router.post("/update/7",checkUser, upload, appTestController.update7);
router.post("/update/finish",checkUser,  appTestController.updateFinish);
router.post("/cancel_by_client/",checkUser, appTestController.cancel_by_client);

// router.post("/upload", appTestController.upload);
// router.get("/get/:id",checkUser, appTestController.get);
router.get("/getAll/", appTestController.getAll);
router.get("/statistics/", appTestController.getStatistics);


router.get("/percents/:fillial_id",checkUser, appTestController.getPercents);



module.exports = router;




