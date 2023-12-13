const express = require("express");
const router = express.Router();
const axios = require("axios");
const controller = require("../controllers/authController");
const danController = require("../controllers/danController");
const phuongController = require("../controllers/phuongController");
const quanController = require("../controllers/quanController");
const soController = require("../controllers/soController");
const YOUR_RECAPTCHA_SECRET_KEY = '6Le4ZC8pAAAAAGJ2UkMgQm8AyeMrHrwmJYnwxtLg';

router.get("/dangnhap", controller.hienDangNhap);

router.use("/", require("./danRouter"));
router.get("/trangchu", danController.show);

router.get("/phuong", controller.phuongDaDangNhap, phuongController.show);
router.get("/phuong/qldiemdat", controller.phuongDaDangNhap, phuongController.qldiemdat);
router.get("/phuong/qlbangqc", controller.phuongDaDangNhap, phuongController.qlbangqc);
router.get("/phuong/xlbaocao", controller.phuongDaDangNhap, phuongController.xlbaocao);
router.get("/phuong/xlcapphep", controller.phuongDaDangNhap, phuongController.xlcapphep);

router.get("/quan", controller.quanDaDangNhap, quanController.show);
router.get("/quan/qldiemdat", controller.quanDaDangNhap, quanController.qldiemdat);
router.get("/quan/qlbangqc", controller.quanDaDangNhap, quanController.qlbangqc);
router.get("/quan/xlbaocao", controller.quanDaDangNhap, quanController.xlbaocao);
router.get("/quan/xlcapphep", controller.quanDaDangNhap, quanController.xlcapphep);

router.get("/so", controller.soDaDangNhap, soController.thongke);
router.get("/so/pheduyet", controller.soDaDangNhap, soController.pheduyet);
router.get("/so/thongke", controller.soDaDangNhap, soController.thongke);
router.get("/so/qldiemdat", controller.soDaDangNhap, soController.qldiemdat);
router.get("/so/qlbangqc", controller.soDaDangNhap, soController.qlbangqc);
router.get("/so/qltaikhoan", controller.soDaDangNhap, soController.qltaikhoan);
router.get("/so/qlquanphuong", controller.soDaDangNhap, soController.qlquanphuong);

// router.get("/", danController.show);
// router.get("/dangnhap", controller.hienDangNhap);

// router.get("/", controller.daDangNhap, controller.hienDangNhap);
// router.use("/", danController.show);


// router.post("/dangnhap", controller.dangNhap);
router.post("/dangnhap", async (req, res) => {
    const recaptchaResponse = req.body['g-recaptcha-response'];

    // Verify reCAPTCHA response
    try {
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${YOUR_RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
        const recaptchaVerification = await axios.post(verificationURL);
        
        if (recaptchaVerification.data.success) {
            await controller.dangNhap(req, res);
        } else {
            // Handle failed reCAPTCHA verification
            res.status(403).send('Failed reCAPTCHA verification.');
        }
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        res.status(500).send('Internal server error.');
    }
});

module.exports = router;