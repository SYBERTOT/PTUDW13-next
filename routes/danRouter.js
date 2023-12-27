const express = require("express");
const controller = require("../controllers/danController");
const router = express.Router();

router.get("/", controller.show);
router.get("/dsBaoCao", controller.dsBaoCao);
router.get("/guiBaoCao", controller.formBaoCao);
router.get("/dangnhap", controller.dangnhap);

router.post("/testtest", controller.testtest);

module.exports = router;