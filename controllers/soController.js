const controller = {};
const models = require("../models");
const { Op } = require('sequelize');
const axios = require('axios');

controller.qldiemdat = async (req, res) => {
	res.locals.loaidiemdats = await models.LoaiDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.hinhthucdiemdats = await models.HinhThucDiemDat.findAll({
		attributes: [ "id", "Ten"]
	})
	res.locals.diemdats = await models.DiemDat.findAll({
		attributes: [
		  "id",
		  "DiaChi",
		  "KhuVuc",
		  "DiaChiAnh",
		  "QuyHoach",
		  "HinhThucDiemDatId",
		  "LoaiDiemDatId",
		],
		order: [["createdAt", "DESC"]],
		include: [
			{ model: models.LoaiDiemDat },
			{ model: models.HinhThucDiemDat}
		],
	  });
	res.render('qldiemdat', { title: "Quản lý điểm đặt" , quanly: true , layout: "layoutso"});
}

controller.taoDiemDat = async(req, res) => {
	let { diachi, khuvuc, ploai, hthuc } = req.body;

	try{
		let response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
			params: {
				address: diachi,
				key: 'AIzaSyDt120eTlsyh12W98U99SiSpaSfSs4XOvE' 
			}
		});
		let location = response.data.results[0].geometry.location;
		await models.DiemDat.create({
			DiaChi: diachi, 
			KhuVuc: khuvuc,
			LoaiDiemDatId: ploai,
			HinhThucDiemDatId: hthuc,
			KinhDo: toString(location.lng),
			ViDo: toString(location.lat)
		});
		res.redirect("/so/qldiemdat");
	}	catch(error)
	{
		res.send("Không thể tạo điểm!");
		console.error(error);
	}
};

controller.capnhatDiemDat = async (req, res) => {
	let { id, diachi, khuvuc, ploai, hthuc, quyhoach } = req.body;
	try {
		await models.DiemDat.update({
			DiaChi: diachi,
			KhuVuc: khuvuc,
			LoaiDiemDatId: ploai,
			HinhThucDiemDatId: hthuc,
			QuyHoach: quyhoach ? true : false
		},
		{
			where: { id }
		});
		res.send("Điểm đặt đã được cập nhật!");
	}
		catch (error) {
			res.send("Không thể cập nhật!");
			console.error(error);
		}
};

controller.xoaDiemDat  = async(req,res) => {
	let id = isNaN(req.params.id) ? 0 :parseInt(req.params.id);
	try
	{
		await models.DiemDat.destroy({where: {id}});
		res.send("Điểm đặt đã bị xóa");
	}	catch(error){
		res.send("Không thể xóa tài khoản");
		console.error(error);
	}
};

controller.qlbangqc = async (req, res) => {
	res.locals.loaidiemdats = await models.LoaiDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.hinhthucdiemdats = await models.HinhThucDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.diemdats = await models.DiemDat.findAll({
		attributes: [
		  "id",
		  "DiaChi",
		  "KhuVuc",
		  "DiaChiAnh",
		  "QuyHoach",
		  "HinhThucDiemDatId",
		  "LoaiDiemDatId",
		],
		include: [
			{ model: models.LoaiDiemDat },
			{ model: models.HinhThucDiemDat}
		],
	  });
	res.locals.loaibangquangcaos = await models.LoaiBangQuangCao.findAll({
		attributes: [ "id", "Ten"]
	})
	res.locals.bangquangcaos = await models.BangQuangCao.findAll({
		attributes: [
			"id",
			"KichThuoc",
			"DiaChiAnh",
			"NgayHetHan",
			"DiemDatId",
			"LoaiBangQuangCaoId"
		],
		include: [
			{ model: models.DiemDat },
			{ model: models.LoaiBangQuangCao}
		],
	});
	res.render('qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , layout: "layoutso"});
}

controller.taoBangQC = async(req, res) => {
	let { diemdat, ploai, kichthuoc, ngayhethan } = req.body;

	try{
		await models.BangQuangCao.create({
			KichThuoc: kichthuoc,
			LoaiBangQuangCaoId: ploai,
			NgayHetHan: ngayhethan,
			DiemDatId: diemdat
		});
		res.redirect("/so/qlbangqc");
	}	catch(error)
	{
		res.send("Không thể tạo bảng quảng cáo!");
		console.error(error);
	}
};

controller.capnhatBangQC = async (req, res) => {
	let { id, diemdat, ploai, kichthuoc, ngayhethan } = req.body;
	try {
		await models.BangQuangCao.update({
			KichThuoc: kichthuoc,
			LoaiBangQuangCaoId: ploai,
			NgayHetHan: ngayhethan,
			DiemDatId: diemdat
		},
		{
			where: { id }
		});
		res.send("Bảng quảng cáo đã được cập nhật!");
	}
		catch (error) {
			res.send("Không thể cập nhật!");
			console.error(error);
		}
};

controller.xoaBangQC  = async(req,res) => {
	let id = isNaN(req.params.id) ? 0 :parseInt(req.params.id);
	try
	{
		await models.BangQuangCao.destroy({where: {id}});
		res.send("Bảng quảng cáo đã bị xóa");
	}	catch(error){
		res.send("Không thể xóa!");
		console.error(error);
	}
};

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