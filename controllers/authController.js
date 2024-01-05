const controller = {};
const TaiKhoan = require("../models").TaiKhoan;
const LoaiTaiKhoan = require("../models").LoaiTaiKhoan;

const bcrypt = require('bcrypt');

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
        where: { TenTaiKhoan },
        include: [{ model: LoaiTaiKhoan, attributes: ["HoTen"] }]
    });
    if (taikhoan) {
        const match = await bcrypt.compare(MatKhau, taikhoan.MatKhau);
        if (match) {
            let reqUrl = req.body.reqUrl ? req.body.reqUrl : "/";
            req.session.taikhoan = taikhoan;
            return res.redirect(reqUrl);
        }
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

        switch (taikhoan.LoaiTaiKhoan.HoTen) {
            case "Phuong":
                return res.redirect("/phuong");
                break;
            case "Quan":
                return res.redirect("/quan");
                break;
            case "So":
                return res.redirect("/so");
                break;
        }
    }
    return next();
};

controller.phuongDaDangNhap = async (req, res, next) => {
    if (req.session.taikhoan) {
        const taikhoan = req.session.taikhoan;
        res.locals.taikhoan = taikhoan;

        if (taikhoan.LoaiTaiKhoan.HoTen == "Phuong") {
            return next();
        }

        let phanhe = taikhoan.LoaiTaiKhoan.HoTen.toLowerCase();
        return res.redirect("/"+phanhe);
    }

    return res.redirect(`/dangnhap?reqUrl=${req.originalUrl}`);
}

controller.quanDaDangNhap = async (req, res, next) => {
    if (req.session.taikhoan) {
        const taikhoan = req.session.taikhoan;
        res.locals.taikhoan = taikhoan;

        if (taikhoan.LoaiTaiKhoan.HoTen == "Quan") {
            return next();
        }

        let phanhe = taikhoan.LoaiTaiKhoan.HoTen.toLowerCase();
        return res.redirect("/"+phanhe);
    }

    return res.redirect(`/dangnhap?reqUrl=${req.originalUrl}`);
}

controller.soDaDangNhap = async (req, res, next) => {
    if (req.session.taikhoan) {
        const taikhoan = req.session.taikhoan;
        res.locals.taikhoan = taikhoan;

        if (taikhoan.LoaiTaiKhoan.HoTen == "So") {
            return next();
        }

        let phanhe = taikhoan.LoaiTaiKhoan.HoTen.toLowerCase();
        return res.redirect("/"+phanhe);
    }

    console.log("mo cua di roi vao");
    return res.redirect(`/dangnhap?reqUrl=${req.originalUrl}`);
}

controller.dangXuat = async (req, res, next) => {
    req.session.destroy(function(error) {
        if (error) return next(error);
        res.redirect("/dangnhap");
    });
};

module.exports = controller;