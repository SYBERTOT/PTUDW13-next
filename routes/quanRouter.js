const express = require("express");
const controller = require("../controllers/quanController");
const router = express.Router();

router.get("/", controller.show);
router.get("/qldiemdat", controller.qldiemdat);
router.get("/qlbangqc", controller.qlbangqc);
router.get("/xlbaocao", controller.xlbaocao);
router.get("/xlcapphep", controller.xlcapphep);

module.exports = router;