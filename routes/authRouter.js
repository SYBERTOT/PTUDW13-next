const express = require("express");
const router = express.Router();
const axios = require("axios");
const controller = require("../controllers/authController");

router.get("/dangnhap", controller.hienDangNhap);
router.get("/dangxuat", controller.dangXuat);
router.get("/quenmatkhau/:token", controller.xacMinhQuenMatKhau);
router.get("doimatkhau", controller.doiMatKhau);
// router.get("/resetmatkhau/:token", )

router.use("/phuong", controller.phuongDaDangNhap, require("./phuongRouter"));
router.use("/quan", controller.quanDaDangNhap, require("./quanRouter"));
router.use("/so", controller.soDaDangNhap, require("./soRouter"));
router.use("/", controller.daDangNhap, require("./danRouter"));

router.post("/dangnhap", controller.dangNhap);
// router.get("/quenmatkhau", controller.xlQuenMatKhau);
router.post("/quenmatkhau", controller.xlQuenMatKhau);

router.post("/doimatkhau", controller.doiMatKhau);
module.exports = router;