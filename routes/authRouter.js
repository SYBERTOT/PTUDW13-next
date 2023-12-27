const express = require("express");
const router = express.Router();
const axios = require("axios");
const controller = require("../controllers/authController");
const YOUR_RECAPTCHA_SECRET_KEY = '6Le4ZC8pAAAAAGJ2UkMgQm8AyeMrHrwmJYnwxtLg';

router.get("/dangnhap", controller.hienDangNhap);
router.get("/dangxuat", controller.dangXuat);

router.use("/", require("./danRouter"));
router.use("/phuong", controller.phuongDaDangNhap, require("./phuongRouter"));
router.use("/quan", controller.quanDaDangNhap, require("./quanRouter"));
router.use("/so", controller.soDaDangNhap, require("./soRouter"));

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