const express = require("express");
const controller = require("../controllers/soController");
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

router.get("/", controller.thongke);
router.get("/thongke", controller.thongke);
router.get("/qlquanphuong", controller.qlquanphuong);
router.get("/qldanhsach", controller.qldanhsach);

router.get("/qldiemdat", controller.qldiemdat);
router.post("/qldiemdat", upload.single('hinhanh'), controller.taoDiemDat);
router.put("/qldiemdat", controller.capnhatDiemDat);
router.delete("/qldiemdat/:id", controller.xoaDiemDat);

router.get("/qlbangqc", controller.qlbangqc);
router.post("/qlbangqc", upload.single('hinhanh'), controller.taoBangQC);
router.put("/qlbangqc", controller.capnhatBangQC);
router.delete("/qlbangqc/:id", controller.xoaBangQC);

router.get("/qltaikhoan", controller.qltaikhoan);
router.post("/qltaikhoan", controller.taoTaiKhoan);
router.put("/qltaikhoan", controller.capnhatTaiKhoan);
router.delete("/qltaikhoan/:id", controller.xoaTaiKhoan);

router.get("/pheduyetcapphep", controller.pheduyetCapPhep);
router.put("/pheduyetcapphep", controller.capnhatPheDuyetCapPhep);
router.put("/dongycapphep", controller.dongyCapPhep);

router.get("/pheduyetdiemdat", controller.pheduyetDiemDat);
router.delete("/pheduyetdiemdat/:id", controller.xoaYCCS);

router.get("/pheduyetbangqc", controller.pheduyetBangQC);
router.delete("/pheduyetbangqc/:id", controller.xoaYCCS);
router.put("/dongybangqc", controller.dongyBangQC);

router.post("/capnhat",controller.CapNhatThongTin);
router.post("/doimatkhau", controller.doiMatKhau);
router.get('/thongtin', controller.thongTin);

router.post("/themquan", controller.themQuan);
router.post("/themphuong", controller.themPhuong);
router.delete("/xoaquan/:id", controller.xoaQuan);
router.delete("/xoaphuong/:id", controller.xoaPhuong);
router.put("/editQuan", controller.capnhatQuan);
router.put("/editPhuong", controller.capnhatPhuong);

router.post("/themHTDiemDat", controller.themHTDD);
router.post("/themHTBaoCao", controller.themHTBC);
router.delete("/xoaHTDD/:id", controller.xoaHTDD);
router.delete("/xoaHTBC/:id", controller.xoaHTBC);
router.put("/capnhatHTDD", controller.capnhatHTDD);
router.put("/capnhatHTBC", controller.capnhatHTBC)

module.exports = router;