const controller = {};
const TaiKhoan = require("../models").TaiKhoan;
const LoaiTaiKhoan = require("../models").LoaiTaiKhoan;

controller.hienDangNhap = (req, res) => {
    let reqUrl = req.query.reqUrl ? req.query.reqUrl : "/";
    if (req.session.taikhoan) {
        return res.redirect(reqUrl);
    }
    res.render("dangnhap", { 
        layout: "layoutdan",
		title: "Đăng nhập" , 
		dangnhap: true,
    reqUrl,
    });
};

controller.dangNhap = async (req, res) => {
    let { TenTaiKhoan, MatKhau } = req.body;
    let taikhoan = await TaiKhoan.findOne({
        attributes: [ "id", "TenTaiKhoan", "MatKhau", "LoaiTaiKhoanId",],
        where: { TenTaiKhoan, MatKhau },
        include: [{ model: LoaiTaiKhoan, attributes: ["HoTen"] }]
    });
    if (taikhoan) {
        let reqUrl = req.body.reqUrl ? req.body.reqUrl : "/";

        if (taikhoan.LoaiTaiKhoanId && taikhoan.LoaiTaiKhoan.HoTen) {
            reqUrl = `/${taikhoan.LoaiTaiKhoan.HoTen.toLowerCase()}`;
        }

        req.session.taikhoan = taikhoan;
        return res.redirect(reqUrl);
    }
    return res.render("dangnhap", {
        layout: "layoutdan",
        message: "Sai tên tài khoản hoặc mật khẩu!",
    });
};

controller.daDangNhap = async (req, res, next) => {
    if (req.session.taikhoan) {
        const taikhoan = req.session.taikhoan;
        res.locals.taikhoan = taikhoan;
        if (taikhoan.LoaiTaiKhoanId) {
            const phuong = await LoaiTaiKhoan.findOne({
                where: { id: taikhoan.id, HoTen: "Phuong" },
            });
            if (phuong && taikhoan.LoaiTaiKhoanId === phuong.id) {
                console.log(`/${taikhoan.LoaiTaiKhoan.HoTen.toLowerCase()}`);
                return res.redirect(`/${taikhoan.LoaiTaiKhoan.HoTen.toLowerCase()}`);
            }

            const quan = await LoaiTaiKhoan.findOne({
                where: { id: taikhoan.id, HoTen: "Quan" },
            });
            if (quan && taikhoan.LoaiTaiKhoanId === quan.id) {
                console.log(`/${taikhoan.LoaiTaiKhoan.HoTen.toLowerCase()}`);
                return res.redirect(`/${taikhoan.LoaiTaiKhoan.HoTen.toLowerCase()}`);
            }

            const so = await LoaiTaiKhoan.findOne({
                where: { id: taikhoan.id, HoTen: "So" },
            });
            if (so && taikhoan.LoaiTaiKhoanId === so.id) {
                console.log(`/${taikhoan.LoaiTaiKhoan.HoTen.toLowerCase()}`);
                return res.redirect(`/${taikhoan.LoaiTaiKhoan.HoTen.toLowerCase()}`);
            }            
        }
    }
    return next();
};

controller.phuongDaDangNhap = async (req, res, next) => {
    if (req.session.taikhoan) {
        const taikhoan = req.session.taikhoan;
        if (taikhoan.LoaiTaiKhoanId) {
            const loaitaikhoan = await LoaiTaiKhoan.findOne({
                where: { id: taikhoan.id, HoTen: "Phuong" },
            });

            if (loaitaikhoan && taikhoan.LoaiTaiKhoanId === loaitaikhoan.id) {
                res.locals.taikhoan = taikhoan;
                return next();
            }
        }
    }
    res.redirect(`/dangnhap?reqUrl=${req.originalUrl}`)
};

controller.quanDaDangNhap = async (req, res, next) => {
    if (req.session.taikhoan) {
        const taikhoan = req.session.taikhoan;
        if (taikhoan.LoaiTaiKhoanId) {
            const loaitaikhoan = await LoaiTaiKhoan.findOne({
                where: { id: taikhoan.id, HoTen: "Quan" },
            });

            if (loaitaikhoan && taikhoan.LoaiTaiKhoanId === loaitaikhoan.id) {
                res.locals.taikhoan = taikhoan;
                return next();
            }
        }
    }
    res.redirect(`/dangnhap?reqUrl=${req.originalUrl}`)
};

controller.soDaDangNhap = async (req, res, next) => {
    if (req.session.taikhoan) {
        const taikhoan = req.session.taikhoan;
        if (taikhoan.LoaiTaiKhoanId) {
            const loaitaikhoan = await LoaiTaiKhoan.findOne({
                where: { id: taikhoan.id, HoTen: "So" },
            });

            if (loaitaikhoan && taikhoan.LoaiTaiKhoanId === loaitaikhoan.id) {
                res.locals.taikhoan = taikhoan;
                return next();
            }
        }
    }
    res.redirect(`/dangnhap?reqUrl=${req.originalUrl}`)
};

controller.dangXuat = async (req, res, next) => {
    req.session.destroy(function(error) {
        if (error) return next(error);
        res.redirect("/dangnhap");
    });
};

module.exports = controller;