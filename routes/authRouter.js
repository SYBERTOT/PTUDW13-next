const express = require("express");
const router = express.Router();
const axios = require("axios");
const controller = require("../controllers/authController");
const YOUR_RECAPTCHA_SECRET_KEY = '6Le4ZC8pAAAAAGJ2UkMgQm8AyeMrHrwmJYnwxtLg';

router.get("/dangnhap", controller.hienDangNhap);
router.get("/dangxuat", controller.dangXuat);

router.use("/phuong", controller.phuongDaDangNhap, require("./phuongRouter"));
router.use("/quan", controller.quanDaDangNhap, require("./quanRouter"));
router.use("/so", controller.soDaDangNhap, require("./soRouter"));
router.use("/", controller.daDangNhap, require("./danRouter"));

router.post("/dangnhap", controller.dangNhap);

module.exports = router;