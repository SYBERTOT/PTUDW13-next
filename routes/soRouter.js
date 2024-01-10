const express = require("express");
const controller = require("../controllers/soController");
const router = express.Router();

router.get("/", controller.thongke);
router.get("/thongke", controller.thongke);
router.get("/qlquanphuong", controller.qlquanphuong);

router.get("/qldiemdat", controller.qldiemdat);
router.post("/qldiemdat", controller.taoDiemDat);
router.put("/qldiemdat", controller.capnhatDiemDat);
router.delete("/qldiemdat/:id", controller.xoaDiemDat);

router.get("/qlbangqc", controller.qlbangqc);
router.post("/qlbangqc", controller.taoBangQC);
router.put("/qlbangqc", controller.capnhatBangQC);
router.delete("/qlbangqc/:id", controller.xoaBangQC);

router.get("/qltaikhoan", controller.qltaikhoan);
router.post("/qltaikhoan", controller.taoTaiKhoan);
router.put("/qltaikhoan", controller.capnhatTaiKhoan);
router.delete("/qltaikhoan/:id", controller.xoaTaiKhoan);

router.get("/pheduyet", controller.pheduyet);
router.put("/pheduyet", controller.capnhatPheDuyetCapPhep);

router.post("/capnhat",controller.CapNhatThongTin);
router.post("/doimatkhau", controller.doiMatKhau);
router.get('/thongtin', controller.thongTin);

module.exports = router;