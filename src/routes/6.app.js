
const multer = require("multer");
const Storage = multer.diskStorage({
  destination: 'public/test-images',
  filename: (req, file,cb) =>{
    cb(null,"zayavka"+ req.body.id +".jpg")
  }
})


const upload = multer({
  storage: Storage,
}).single('selfie')



const { Router } = require("express");
const appController = require("../controllers/6.app.js");
const checkToken = require("../middlewares/check-token.js");
const checkBlocked = require("../middlewares/check-blocked.js");
const checkZayavka = require("../middlewares/check-zayavka.js");
const checkUser = require("../middlewares/check-user.js");
const {default_config , ZayavkaReq } = require("../middlewares/check-step");

const router = Router();

router.use(checkToken);
router.use(checkBlocked);

router.get("/p-oferta", appController.publicOferta);
router.post("/update/1",checkUser, appController.update1);
router.post("/update/2",checkUser,default_config,ZayavkaReq.update2, appController.update2);
router.post("/update/3",checkUser,default_config,ZayavkaReq.update3, appController.update3);
// router.post("/update/4",checkUser, appController.update4);
router.post("/update/5",checkUser,default_config,ZayavkaReq.update5_6_7_finish, appController.update5);
router.post("/update/6",checkUser,default_config,ZayavkaReq.update5_6_7_finish,  appController.update6);
router.post("/update/7",checkUser,upload,default_config,ZayavkaReq.update5_6_7_finish,   appController.update7);
router.post("/update/finish",checkUser,default_config,ZayavkaReq.update5_6_7_finish, appController.updateFinish);
router.post("/cancel_by_client/",checkUser,default_config,ZayavkaReq.cancel,  appController.cancel_by_client);
// router.get("/grafik/:id",checkUser, appController.getGraphics)


//
// router.post("/upload", appController.upload);
// router.get("/get/:id",checkUser, appController.get);
router.get("/getAll/", appController.getAll);
router.get("/statistics/", appController.getStatistics);

router.get("/cancelTexts/",checkUser, appController.cancelTexts);


router.get("/percents/:fillial_id",checkUser, appController.getPercents);

router.get("/:id", appController.getByid);
router.get("/graph/:id", appController.graph);
router.get("/oferta/:id", appController.oferta);



module.exports = router;




