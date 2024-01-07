const controller = {};
const TaiKhoan = require("../models").TaiKhoan;
const LoaiTaiKhoan = require("../models").LoaiTaiKhoan;

const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt hashing

const sendResetEmail = require('../html/js/sendResetEmail');
const generateRandomToken = require('../html/js/generateRandomToken');

const { Op } = require("sequelize");

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
    let { email } = req.body;
    const taikhoan = await TaiKhoan.findOne({ where: { Email: email } });
    if (taikhoan) {
        taikhoan.HetHan = Date.now() + 3600000; // Token expires in 1 hour
        const resetToken = generateRandomToken();
        taikhoan.Tokenstring = resetToken;

        try {
            await taikhoan.save();
            // Send email with reset link
            await sendResetEmail(taikhoan.Email, resetToken, taikhoan.id);//, (error) => {
                // if (error) {
                    // return res.status(500).send("Failed to send reset email");
                // } else {
                    // Send a success message to the client
                    return res.send({
                        message: "Check your mailbox!",  // Email sent successfully
                        redirectTo: "/dangnhap",  // Redirect to the login page
                    });
                // }
            // });
        } catch (error) {
            return res.status(500).send("Failed to send reset email");
        }
    } else {
        // Redirect to the login page with an error message
        return res.redirect('/dangnhap?message=Email not found');
    }
};


controller.xacMinhQuenMatKhau = async (req, res) => {
    let { id, token } = req.params;
    const taikhoan = await TaiKhoan.findOne({
        where: {
            id: id,
            Tokenstring: token,
            HetHan: { [Op.gte]: Date.now() },
        },
        include: [{ model: LoaiTaiKhoan, attributes: ["HoTen"] }]
    });
    if (taikhoan) {
        taikhoan.Tokenstring = null;
        taikhoan.HetHan = null;
        await taikhoan.save();
        req.session.taikhoan = taikhoan;
        res.locals.taikhoan = taikhoan;
        return res.redirect('/resetmatkhau');
    } 
    // else () {
        return res.redirect('/quenmatkhau');
    // }
};

controller.tokenVerified = (req, res, next) => {
    if (req.session.taikhoan) {
        res.locals.taikhoan = req.session.taikhoan;
        return next();
    } else {
        return res.redirect('/dangnhap');
    }
}

controller.showResetMatKhau = (req, res) => {
    return res.render("resetmatkhau", { id: res.locals.taikhoan.id });
};

controller.capNhatMatKhau = async (req, res) => {
    let { id, NewPassword } = req.body;
	console.log(id);
    console.log(NewPassword);
    console.log(req.session.taikhoan);
    let MatKhau = await bcrypt.hash(NewPassword, saltRounds);
	try { //token nua
		await TaiKhoan.update(
			{ MatKhau: MatKhau},
			{ where: { id: id} 
		});
		return res.send("Cập nhật mật khẩu thành công!");
	  } catch (error) {
		console.error(error);
		return res.send("Cập nhật mật khẩu không thành công");
	  }
};

module.exports = controller;