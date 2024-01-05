const express = require("express");
const controller = require("../controllers/quanController");
const router = express.Router();

router.get("/", controller.show);

router.get("/qldiemdat", controller.qldiemdat);
router.post("/qldiemdat", controller.taoYCCSdiemdat);

router.get("/qlbangqc", controller.qlbangqc);
router.post("/qlbangqc", controller.taoYCCSbangqc);
router.get("/xlbaocao", controller.xlbaocao);
router.put("/xlbaocao", controller.capnhatCachThucXuLy);
router.get("/xlcapphep", controller.xlcapphep);
router.put("/",controller.CapNhatThongTin);

module.exports = router;