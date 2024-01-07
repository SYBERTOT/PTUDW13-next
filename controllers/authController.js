const controller = {};
const TaiKhoan = require("../models").TaiKhoan;
const LoaiTaiKhoan = require("../models").LoaiTaiKhoan;

const bcrypt = require('bcrypt');

const sendResetEmail = require('../html/js/sendResetEmail');
const generateRandomToken = require('../html/js/generateRandomToken');

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
};

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
};

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
};

controller.dangXuat = async (req, res, next) => {
    req.session.destroy(function(error) {
        if (error) return next(error);
        res.redirect("/dangnhap");
    });
};

controller.xlQuenMatKhau = async (req, res) => {
    let { email } = req.body;
    const taikhoan = await TaiKhoan.findOne({ where: { Email: email } });
    if (taikhoan) {
        const resetToken = generateRandomToken(); // Implement this function
        // taikhoan.resetPasswordToken = resetToken;
        // taikhoan.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        // await taikhoan.save();

        // Send email with reset link
        sendResetEmail(taikhoan.Email, resetToken, (error) => {
            if (error) {
                return res.status(500).send("Failed to send reset email");
            } else {
                return res.send("Check your mailbox!"); // Email sent successfully
            }
        });
    } else {
    return res.redirect('/dangnhap/quenmatkhau');
    }
};

controller.xacMinhQuenMatKhau = async (req, res) => {
    let { token } = req.params.token;
    // const taikhoan = await TaiKhoan.findOne({
    //     where: {
    //         resetPasswordToken: token,
    //         resetPasswordExpires: { [Op.gte]: Date.now() },
    //     },
    // });
    
    console.log(token);
    // if (taikhoan) {
    //     res.render('resetmatkhau', { token: resetToken }); // Render the reset password page
    // }
    // else () {
    //     res.redirect('/quenmatkhau');
    // }
};

module.exports = controller;