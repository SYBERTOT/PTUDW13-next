const express = require("express");
const router = express.Router();
const axios = require("axios");
const controller = require("../controllers/authController");

router.post("/resetmatkhau", controller.capNhatMatKhau);

router.get("/dangnhap", controller.hienDangNhap);
router.get("/dangxuat", controller.dangXuat);
router.get("/quenmatkhau/:id/:token", controller.xacMinhQuenMatKhau);
router.get("/resetmatkhau", controller.tokenVerified, controller.showResetMatKhau);

router.use("/phuong", controller.phuongDaDangNhap, require("./quanRouter"));
router.use("/quan", controller.quanDaDangNhap, require("./quanRouter"));
router.use("/so", controller.soDaDangNhap, require("./soRouter"));
router.use("/", controller.daDangNhap, require("./danRouter"));

router.post("/dangnhap", controller.dangNhap);
router.post("/quenmatkhau", controller.xlQuenMatKhau);

module.exports = router;