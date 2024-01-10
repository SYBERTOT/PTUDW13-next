const express = require("express");
const controller = require("../controllers/canBoController");
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Set up Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './html/img');  // Destination folder
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filePath = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, filePath);  // Generate a unique file name
    }
});

const upload = multer({ storage: storage });

router.get("/", controller.show);

router.get("/qldiemdat", controller.qldiemdat);
router.post("/qldiemdat", controller.taoYCCSdiemdat);

router.get("/qlbangqc", controller.qlbangqc);
router.post("/qlbangqc", controller.taoYCCSbangqc);
router.post("/taocappheptubangqc", upload.single('hinhanh'), controller.taoCapPhepTuBangQC);

router.get("/xlbaocao", controller.xlbaocao);
router.put("/xlbaocao", controller.capnhatCachThucXuLy);

router.get("/xlcapphep", controller.xlcapphep);
router.post("/xlcapphep", upload.single('hinhanh'), controller.taoCapPhep);
router.delete("/xlcapphep/:id", controller.xoaCapPhep);

router.post("/capnhat",controller.CapNhatThongTin);
router.post("/doimatkhau", controller.doiMatKhau);

router.get('/thongtin', controller.thongTin);
module.exports = router;