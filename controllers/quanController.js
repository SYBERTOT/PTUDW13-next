const controller = {};
const models = require("../models");

controller.show = async (req, res) => {
	let diemdatsArray = []; // Initialize an empty array

	res.locals.loaidiemdats = await models.LoaiDiemDat.findAll({
		attributes: ["id", "Ten"]
	});
	res.locals.hinhthucdiemdats = await models.HinhThucDiemDat.findAll({
		attributes: ["id", "Ten"]
	});

	res.locals.loaibangquangcaos = await models.LoaiBangQuangCao.findAll({
		attributes: [ "id", "Ten"]
	});

	res.locals.bangquangcaos = await models.BangQuangCao.findAll({
		attributes: [ "id", "KichThuoc"],
		include: [
			{ model: models.LoaiBangQuangCao },
			{ model: models.DiemDat}
		]
	})

	// Fetch diemdats from the database
	const diemdats = await models.DiemDat.findAll({
		attributes: [
		  "id",
		  "DiaChi",
		  "KinhDo",
		  "ViDo",
		  "KhuVuc",
		  "DiaChiAnh",
		  "QuyHoach",
		],
		include: [
			{ model: models.LoaiDiemDat},
			{ model: models.HinhThucDiemDat},
			{ model: models.BangQuangCao },
		]
	});

	diemdats.forEach(diemdat => {
		diemdatsArray.push(diemdat);
	});

	res.locals.diemdats = diemdatsArray;
	res.render('index', { title: "Trang chủ" , trangchu: true , layout: "layoutquan"});
}

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
	res.render('canbo_qldiemdat', { title: "Quản lý điểm đặt" , quanly: true , layout: "layoutquan"});
}

controller.taoYCCSdiemdat = async(req, res) => {
	let { id, diachi, khuvuc, ploai, hthuc, quyhoach, ngaychinhsua, lydo } = req.body;

	try{
		await models.YeuCauChinhSuaThongTin.create({
			DiemDatId: id,
			DiaChi: diachi,
			KhuVuc: khuvuc,
			LoaiDiemDatId: ploai,
			HinhThucDiemDatId: hthuc,
			QuyHoach: quyhoach,
			ThoiDiemXin: ngaychinhsua,
			LyDo: lydo,
			LoaiChinhSua: false
		});
		res.redirect("/quan/qldiemdat");
	}	catch(error)
	{
		res.send("Không thể tạo yêu cầu chỉnh sửa");
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
	res.render('canbo_qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , layout: "layoutquan"});
}

controller.taoYCCSbangqc = async(req, res) => {
	let { id, diemdat, ploai, kichthuoc, ngaychinhsua, lydo } = req.body;

	try{
		await models.YeuCauChinhSuaThongTin.create({
			BangQuangCaoId: id,
			DiemDatId: diemdat,
			LoaiBangQuangCaoId: ploai,
			KichThuoc: kichthuoc,
			ThoiDiemXin: ngaychinhsua,
			LyDo: lydo,
			LoaiChinhSua: true
		});
		res.redirect("/quan/qlbangqc");
	}	catch(error)
	{
		res.send("Không thể tạo yêu cầu chỉnh sửa");
		console.error(error);
	}
};

controller.xlbaocao = (req, res) => {
	res.render('xlbaocao', { title: "Xử lý báo cáo" , xuly: true , layout: "layoutquan"});
}

controller.xlcapphep = (req, res) => {
	res.render('xlcapphep', { title: "Xử lý cấp phép" , xuly: true , layout: "layoutquan"});
}

controller.CapNhatThongTin = async (req, res) =>{
	let{id, HoTen, NgaySinh, Email, DienThoai} = req.body;
	try {
		await models.TaiKhoan.update({
			HoTen,
			NgaySinh,
			Email,
			DienThoai
		}, {where:{id}});
		res.send("Tài khoản đã được cập nhật");
	} 	catch(error)
	{
		res.send("Không thể cập nhật tài khoản");
		console.error(error);
	}
}

module.exports = controller;