const express = require("express");
const controller = require("../controllers/danController");
const router = express.Router();
const axios = require("axios");
const YOUR_RECAPTCHA_SECRET_KEY = '6Le4ZC8pAAAAAGJ2UkMgQm8AyeMrHrwmJYnwxtLg';

router.get("/", controller.show);
router.get("/dsBaoCao", controller.dsBaoCao);
router.get("/dangnhap", controller.dangnhap);

// router.post("/guiBaoCao", controller.guiBaoCao);
router.post("/guiBaoCao", async (req, res) => {
    const recaptchaResponse = req.body['g-recaptcha-response'];
    // Verify reCAPTCHA response
    try {
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${YOUR_RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
        const recaptchaVerification = await axios.post(verificationURL);
        
        if (recaptchaVerification.data.success) {
            await controller.guiBaoCao(req, res);
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