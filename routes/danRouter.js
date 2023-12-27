const express = require("express");
const controller = require("../controllers/danController");
const router = express.Router();

router.get("/", controller.show);
router.get("/dsBaoCao", controller.dsBaoCao);
router.get("/dangnhap", controller.dangnhap);

module.exports = router;