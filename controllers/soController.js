const controller = {};
const models = require("../models");
const { Op } = require('sequelize');

controller.qldiemdat = (req, res) => {
	res.render('qldiemdat', { title: "Quản lý điểm đặt" , quanly: true , layout: "layoutso"});
}

controller.qlbangqc = (req, res) => {
	res.render('qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , layout: "layoutso"});
}

controller.qltaikhoan = async (req, res) => {
	res.locals.loaitaikhoans = await models.LoaiTaiKhoan.findAll({
		attributes: [ "id", "HoTen"],
		where: {
			id: {
				[Op.ne]: 3
			}
		}
	})
	res.locals.taikhoans = await models.TaiKhoan.findAll({
		attributes: [
		  "id",
		  "HoTen",
		  "NgaySinh",
		  "Email",
		  "DienThoai",
		  "KhuVuc",
		  "LoaiTaiKhoanId",
		],
		order: [["createdAt", "DESC"]],
		include: [
			{ model: models.LoaiTaiKhoan}
		],
		where: {
			LoaiTaiKhoanId: {
				[Op.ne]: 3
			}
		}
	  });
	res.render('qltaikhoan', { title: "Quản lý tài khoản" , quanly: true , layout: "layoutso"});
}

controller.qlquanphuong = (req, res) => {
	res.render('qlbangqc', { title: "Quản lý quận, phường" , quanly: true , layout: "layoutso"});
}

controller.pheduyet = (req, res) => {
	res.render('pheduyet', { title: "Phê duyệt" , pheduyet: true , layout: "layoutso"});
}

controller.thongke = (req, res) => {
	res.render('thongke', { title: "Thống kê" , thongke: true , layout: "layoutso"});
}

controller.taoTaiKhoan = async(req, res) => {
	let { username, loaitk, khuvuc } = req.body;
	try{
		await models.TaiKhoan.create({
			TenTaiKhoan: username, 
			LoaiTaiKhoanId: loaitk,
			KhuVuc: khuvuc,
			MatKhau: "123",
		});
		res.redirect("/so/qltaikhoan");
	}	catch(error)
	{
		res.send("Không thể tạo tài khoản!");
		console.error(error);
	}
};

controller.capnhatTaiKhoan = async (req, res) => {
	let { id, name, dob, email, mobile, loaitk, khuvuc } = req.body;
	try {
		await models.TaiKhoan.update({
			HoTen: name,
			NgaySinh: dob,
			Email: email,
			DienThoai: mobile,
			LoaiTaiKhoanId: loaitk,
			KhuVuc: khuvuc
		},
		{
			where: { id }
		});
		res.send("Tài khoản đã được cập nhật!");
	}
		catch (error) {
			res.send("Không thể cập nhật!");
			console.error(error);
		}
};

controller.xoaTaiKhoan  = async(req,res) => {
	let id = isNaN(req.params.id) ? 0 :parseInt(req.params.id);
	try
	{
		await models.TaiKhoan.destroy({where: {id}});
		res.send("Tài khoản đã bị xóa");
	}	catch(error){
		res.send("Không thể xóa tài khoản");
		console.error(error);
	}
};

module.exports = controller;