const express = require("express");
const controller = require("../controllers/soController");
const router = express.Router();

router.get("/", controller.thongke);
router.get("/pheduyet", controller.pheduyet);
router.get("/thongke", controller.thongke);
router.get("/qldiemdat", controller.qldiemdat);
router.get("/qlbangqc", controller.qlbangqc);
router.get("/qltaikhoan", controller.qltaikhoan);
router.get("/qlquanphuong", controller.qlquanphuong);
router.post("/", controller.taoTaiKhoan);
router.delete("/:id", controller.xoaTaiKhoan);

module.exports = router;