const express = require("express");
const controller = require("../controllers/soController");
const router = express.Router();

router.get("/", controller.thongke);
router.get("/pheduyet", controller.pheduyet);
router.get("/thongke", controller.thongke);
router.get("/qlbangqc", controller.qlbangqc);
router.get("/qlquanphuong", controller.qlquanphuong);

router.get("/qldiemdat", controller.qldiemdat);
router.post("/qldiemdat", controller.taoDiemDat);
router.put("/qldiemdat", controller.capnhatDiemDat);
router.delete("/qldiemdat/:id", controller.xoaDiemDat);

router.get("/qltaikhoan", controller.qltaikhoan);
router.post("/qltaikhoan", controller.taoTaiKhoan);
router.put("/qltaikhoan", controller.capnhatTaiKhoan);
router.delete("/qltaikhoan/:id", controller.xoaTaiKhoan);

module.exports = router;