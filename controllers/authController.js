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
        attributes: [ "id", "TenTaiKhoan", "MatKhau", "LoaiTaiKhoanId", "KhuVuc"],
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
    console.log(req.body);
    let { email } = req.body;
    const taikhoan = await TaiKhoan.findOne({ where: { Email: email } });
    if (taikhoan) {
        res.json({msg: 'true', hoten: taikhoan.HoTen});
    }
    else {
        res.json({msg: 'false'});
    }
};

controller.doiMatKhau = async (req, res) => {
    let { email, psw } = req.body;
    const hashedPassword = await bcrypt.hash(psw, 10);
    try {
		await models.TaiKhoan.update({
			MatKhau: hashedPassword,
		},
		{
			where: { Email:email }
		});
        res.json({msg: 'success'});
	}
		catch (error) {
			console.error(error);
        res.json({msg: 'failed'});
		}
};

controller.xacMinhQuenMatKhau = async (req, res) => {
    // let { token } = req.params.token;
    // const taikhoan = await TaiKhoan.findOne({
    //     where: {
    //         resetPasswordToken: token,
    //         resetPasswordExpires: { [Op.gte]: Date.now() },
    //     },
    // });
    let token ="100";
    console.log(token);
    res.json({acc: token});
    // if (taikhoan) {
    //     res.render('resetmatkhau', { token: resetToken }); // Render the reset password page
    // }
    // else () {
    //     res.redirect('/quenmatkhau');
    // }
};

module.exports = controller;