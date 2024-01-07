const controller = {};
const models = require("../models");
const { Op } = require('sequelize');


controller.show = async (req, res) => {
	let khuvuc = req.session.taikhoan.KhuVuc;
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
		],
		where: {
			KhuVuc: {
				[Op.endsWith]: khuvuc
			}
		}
	});

	diemdats.forEach(diemdat => {
		diemdatsArray.push(diemdat);
	});
	res.locals.diemdats = diemdatsArray;
	res.render('index', { title: "Trang chủ" , trangchu: true , layout: "layoutquan"});
}

controller.qldiemdat = async (req, res) => {
	let khuvuc = req.session.taikhoan.KhuVuc;
	let loaitk = req.session.taikhoan.LoaiTaiKhoanId;
	let search = req.query.search;
	let phuong = req.query.phuong;
	let tenQuan = '';

	res.locals.loaidiemdats = await models.LoaiDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.hinhthucdiemdats = await models.HinhThucDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});

	if (loaitk === 2)
	{
		let quan = await models.Quan.findOne({
			attributes: [ "id", "Ten"],
			where: {
				Ten: khuvuc
			}
		});
		tenQuan = quan.Ten;
		res.locals.phuongs = await models.Phuong.findAll({
			attributes: [ "id", "Ten", "QuanId"],
			where: {
				QuanId: quan.id
			}
		});
	}
	
	if (search) {
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
			where: {
				KhuVuc: {
					[Op.endsWith]: khuvuc
				},
				DiaChi: {
					[Op.iRegexp]: search
				}
			}
		});
		res.render('canbo_qldiemdat', { title: "Quản lý điểm đặt" , quanly: true , layout: "layoutquan", checkedPhuongs: []});
	}
	else if (phuong) {
		let phuongArray = [];
		if (Array.isArray(phuong)) {
			phuongArray = phuong;
		}
		else {
			phuongArray.push(phuong);
		}
		let getPhuongs = await models.Phuong.findAll({
			attributes: [ "id", "Ten"],
			where: {
				id: {
					[Op.in]: phuongArray
				}
			}
		});
		let phuongTens = [];
		if (Array.isArray(getPhuongs)) {
			phuongTens = getPhuongs.map(ph => ph.Ten + `, ${tenQuan}`);
		}
		else {
			phuongTens.push(getPhuongs.Ten);
		}
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
			where: {
				KhuVuc: {
					[Op.in]: phuongTens 
				}
			}
		});
		req.session.checkedPhuongs = phuongArray;
		res.render('canbo_qldiemdat', { title: "Quản lý điểm đặt" , quanly: true , layout: "layoutquan", checkedPhuongs: req.session.checkedPhuongs});
	}
	else {	
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
			where: {
				KhuVuc: {
					[Op.endsWith]: khuvuc
				}
			}
		});
		res.render('canbo_qldiemdat', { title: "Quản lý điểm đặt" , quanly: true , layout: "layoutquan", checkedPhuongs: []});
	}
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
	let khuvuc = req.session.taikhoan.KhuVuc;
	let loaitk = req.session.taikhoan.LoaiTaiKhoanId;
	let search = req.query.search;
	let phuong = req.query.phuong;
	let diemdat = req.query.diemdat;
	let tenQuan = '';
	
	res.locals.loaidiemdats = await models.LoaiDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.hinhthucdiemdats = await models.HinhThucDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.loaibangquangcaos = await models.LoaiBangQuangCao.findAll({
		attributes: [ "id", "Ten"]
	});
	if (loaitk === 2)
	{
		let quan = await models.Quan.findOne({
			attributes: [ "id", "Ten"],
			where: {
				Ten: khuvuc
			}
		});
		tenQuan = quan.Ten;
		res.locals.phuongs = await models.Phuong.findAll({
			attributes: [ "id", "Ten", "QuanId"],
			where: {
				QuanId: quan.id
			}
		});
	}

	if (search) {
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
			where: {
				KhuVuc: {
					[Op.endsWith]: khuvuc
				},
				DiaChi: {
					[Op.iRegexp]: search
				}
			}
		  });
		var diemdatIds = res.locals.diemdats.map(diemdat => diemdat.id);

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
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				},

			}
		});
		res.render('canbo_qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , layout: "layoutquan", checkedPhuongs: []});
	} 
	else if (phuong) {
		let phuongArray = [];
		if (Array.isArray(phuong)) {
			phuongArray = phuong;
		}
		else {
			phuongArray.push(phuong);
		}
		let getPhuongs = await models.Phuong.findAll({
			attributes: [ "id", "Ten"],
			where: {
				id: {
					[Op.in]: phuongArray
				}
			}
		});
		let phuongTens = [];
		if (Array.isArray(getPhuongs)) {
			phuongTens = getPhuongs.map(ph => ph.Ten + `, ${tenQuan}`);
		}
		else {
			phuongTens.push(getPhuongs.Ten);
		}

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
			where: {
				KhuVuc: {
					[Op.in]: phuongTens
				},
			}
		  });
		var diemdatIds = res.locals.diemdats.map(diemdat => diemdat.id);

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
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				},

			}
		});
		req.session.checkedPhuongs = phuongArray;
		res.render('canbo_qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , layout: "layoutquan", checkedPhuongs: req.session.checkedPhuongs});
	}
	else if (diemdat) {
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
			where: {
				id: diemdat
			}
		  });
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
			where: {
				DiemDatId: diemdat
			}
		});
		res.render('canbo_qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , layout: "layoutquan", checkedPhuongs: []});
	}
	else {
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
			where: {
				KhuVuc: {
					[Op.endsWith]: khuvuc
				}
			}
		  });
		var diemdatIds = res.locals.diemdats.map(diemdat => diemdat.id);
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
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				}
			}
		});
		res.render('canbo_qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , layout: "layoutquan", checkedPhuongs: []});
	}

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

controller.xlbaocao = async (req, res) => {
	let khuvuc = req.session.taikhoan.KhuVuc;
	let loaitk = req.session.taikhoan.LoaiTaiKhoanId;
	let search = req.query.search;
	let phuong = req.query.phuong;
	let tenQuan = '';

	res.locals.hinhthucbaocaos = await models.HinhThucBaoCao.findAll({
		attributes: [ "id", "Ten"]
	});
	if (loaitk === 2)
	{
		let quan = await models.Quan.findOne({
			attributes: [ "id", "Ten"],
			where: {
				Ten: khuvuc
			}
		});
		tenQuan = quan.Ten;
		res.locals.phuongs = await models.Phuong.findAll({
			attributes: [ "id", "Ten", "QuanId"],
			where: {
				QuanId: quan.id
			}
		});
	}
	if (search) {
		res.locals.diemdats = await models.DiemDat.findAll({
			attributes: [ "id", "DiaChi", "KhuVuc"],
			where: {
				KhuVuc: {
					[Op.endsWith]: khuvuc
				},
				DiaChi: {
					[Op.iRegexp]: search
				}
			}
		});
		var diemdatIds = res.locals.diemdats.map(diemdat => diemdat.id);
		res.locals.bangquangcaos = await models.BangQuangCao.findAll({
			attributes: [ "id", "LoaiBangQuangCaoId", "KichThuoc", "DiemDatId"],
			include: [
				{ model: models.LoaiBangQuangCao }
			],
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				}
			}
		});
		res.locals.baocaos = await models.BaoCao.findAll({
			attributes: [ "id", "createdAt", "NoiDung", "HoTen", "Email", "DienThoai", "laDiemDat", "HinhThucBaoCaoId", "DiemDatId", "BangQuangCaoId", "XuLy", "TaiKhoanId"],
			include: [
				{ model: models.DiemDat },
				{
					model: models.BangQuangCao,
					include: [{
						model: models.LoaiBangQuangCao,
						attributes: ["id", "Ten"]
					}]
				},
				{ model: models.HinhThucBaoCao },
			],
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				},
			}
		});
		res.render('xlbaocao', { title: "Xử lý báo cáo" , xuly: true , layout: "layoutquan", checkedPhuongs: []});
	}
	else if (phuong) {
		let phuongArray = [];
		if (Array.isArray(phuong)) {
			phuongArray = phuong;
		}
		else {
			phuongArray.push(phuong);
		}
		let getPhuongs = await models.Phuong.findAll({
			attributes: [ "id", "Ten"],
			where: {
				id: {
					[Op.in]: phuongArray
				}
			}
		});
		let phuongTens = [];
		if (Array.isArray(getPhuongs)) {
			phuongTens = getPhuongs.map(ph => ph.Ten + `, ${tenQuan}`);
		}
		else {
			phuongTens.push(getPhuongs.Ten);
		}
		res.locals.diemdats = await models.DiemDat.findAll({
			attributes: [ "id", "DiaChi", "KhuVuc"],
			where: {
				KhuVuc: {
					[Op.in]: phuongTens
				}
			}
		});
		var diemdatIds = res.locals.diemdats.map(diemdat => diemdat.id);
		res.locals.bangquangcaos = await models.BangQuangCao.findAll({
			attributes: [ "id", "LoaiBangQuangCaoId", "KichThuoc", "DiemDatId"],
			include: [
				{ model: models.LoaiBangQuangCao }
			],
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				}
			}
		});
		res.locals.baocaos = await models.BaoCao.findAll({
			attributes: [ "id", "createdAt", "NoiDung", "HoTen", "Email", "DienThoai", "laDiemDat", "HinhThucBaoCaoId", "DiemDatId", "BangQuangCaoId", "XuLy", "TaiKhoanId"],
			include: [
				{ model: models.DiemDat },
				{
					model: models.BangQuangCao,
					include: [{
						model: models.LoaiBangQuangCao,
						attributes: ["id", "Ten"]
					}]
				},
				{ model: models.HinhThucBaoCao },
			],
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				},
			}
		});
		req.session.checkedPhuongs = phuongArray;
		res.render('xlbaocao', { title: "Xử lý báo cáo" , xuly: true , layout: "layoutquan", checkedPhuongs: req.session.checkedPhuongs});
	}
	else {
		res.locals.diemdats = await models.DiemDat.findAll({
			attributes: [ "id", "DiaChi", "KhuVuc"],
			where: {
				KhuVuc: {
					[Op.endsWith]: khuvuc
				}
			}
		});
		var diemdatIds = res.locals.diemdats.map(diemdat => diemdat.id);
		res.locals.bangquangcaos = await models.BangQuangCao.findAll({
			attributes: [ "id", "LoaiBangQuangCaoId", "KichThuoc", "DiemDatId"],
			include: [
				{ model: models.LoaiBangQuangCao }
			],
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				}
			}
		});
		res.locals.baocaos = await models.BaoCao.findAll({
			attributes: [ "id", "createdAt", "NoiDung", "HoTen", "Email", "DienThoai", "laDiemDat", "HinhThucBaoCaoId", "DiemDatId", "BangQuangCaoId", "XuLy", "TaiKhoanId"],
			include: [
				{ model: models.DiemDat },
				{
					model: models.BangQuangCao,
					include: [{
						model: models.LoaiBangQuangCao,
						attributes: ["id", "Ten"]
					}]
				},
				{ model: models.HinhThucBaoCao },
			],
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				},
			}
		});
		res.render('xlbaocao', { title: "Xử lý báo cáo" , xuly: true , layout: "layoutquan", checkedPhuongs: []});
	}
	
}

controller.capnhatCachThucXuLy = async (req, res) => {
	let { id, cachthuc } = req.body;
	try {
		await models.BaoCao.update({
			XuLy: true,
			HinhThucXuLy: cachthuc
		},
		{
			where: { id }
		});
		res.send("Báo cáo đã được cập nhật!");
	}
		catch (error) {
			res.send("Không thể cập nhật!");
			console.error(error);
		}
};

controller.xlcapphep = async (req, res) => {
	let khuvuc = req.session.taikhoan.KhuVuc;
	let loaitk = req.session.taikhoan.LoaiTaiKhoanId;
	let search = req.query.search;
	let phuong = req.query.phuong;
	let tenQuan = '';
	if (loaitk === 2)
	{
		let quan = await models.Quan.findOne({
			attributes: [ "id", "Ten"],
			where: {
				Ten: khuvuc
			}
		});
		tenQuan = quan.Ten;
		res.locals.phuongs = await models.Phuong.findAll({
			attributes: [ "id", "Ten", "QuanId"],
			where: {
				QuanId: quan.id
			}
		});
	}
	if (search) {
		res.locals.diemdats = await models.DiemDat.findAll({
			attributes: [ "id", "DiaChi", "KhuVuc"],
			where: {
				KhuVuc: {
					[Op.endsWith]: khuvuc
				},
				DiaChi: {
					[Op.iRegexp]: search
				}
			}
		});
		var diemdatIds = res.locals.diemdats.map(diemdat => diemdat.id);
		res.locals.bangquangcaos = await models.BangQuangCao.findAll({
			attributes: [ "id", "LoaiBangQuangCaoId", "KichThuoc", "DiemDatId"],
			include: [
				{ model: models.LoaiBangQuangCao }
			],
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				}
			}
		});
		res.locals.capphepquangcaos = await models.CapPhepQuangCao.findAll({
			attributes: [ "id", "createdAt", "NoiDung", "DiaChiAnh", "TenCongTy", "Email", "DienThoai", "DiaChiCongTy", "DiemDatId", "BangQuangCaoId", "NgayBatDau", "NgayKetThuc" , "TinhTrang"],
			include: [
				{ model: models.DiemDat },
				{
					model: models.BangQuangCao,
					include: [{
						model: models.LoaiBangQuangCao,
						attributes: ["id", "Ten"]
					}]
				},
			],
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				},
			}
		});
		res.render('xlcapphep', { title: "Xử lý cấp phép" , xuly: true , layout: "layoutquan", checkedPhuongs: []});
	}
	else if (phuong) {
		let phuongArray = [];
		if (Array.isArray(phuong)) {
			phuongArray = phuong;
		}
		else {
			phuongArray.push(phuong);
		}
		let getPhuongs = await models.Phuong.findAll({
			attributes: [ "id", "Ten"],
			where: {
				id: {
					[Op.in]: phuongArray
				}
			}
		});
		let phuongTens = [];
		if (Array.isArray(getPhuongs)) {
			phuongTens = getPhuongs.map(ph => ph.Ten + `, ${tenQuan}`);
		}
		else {
			phuongTens.push(getPhuongs.Ten);
		}
		res.locals.diemdats = await models.DiemDat.findAll({
			attributes: [ "id", "DiaChi", "KhuVuc"],
			where: {
				KhuVuc: {
					[Op.in]: phuongTens
				}
			}
		});
		var diemdatIds = res.locals.diemdats.map(diemdat => diemdat.id);
		res.locals.bangquangcaos = await models.BangQuangCao.findAll({
			attributes: [ "id", "LoaiBangQuangCaoId", "KichThuoc", "DiemDatId"],
			include: [
				{ model: models.LoaiBangQuangCao }
			],
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				}
			}
		});
		req.session.checkedPhuongs = phuongArray;
		res.locals.capphepquangcaos = await models.CapPhepQuangCao.findAll({
			attributes: [ "id", "createdAt", "NoiDung", "DiaChiAnh", "TenCongTy", "Email", "DienThoai", "DiaChiCongTy", "DiemDatId", "BangQuangCaoId", "NgayBatDau", "NgayKetThuc" , "TinhTrang"],
			include: [
				{ model: models.DiemDat },
				{
					model: models.BangQuangCao,
					include: [{
						model: models.LoaiBangQuangCao,
						attributes: ["id", "Ten"]
					}]
				},
			],
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				},
			}
		});
		res.render('xlcapphep', { title: "Xử lý cấp phép" , xuly: true , layout: "layoutquan", checkedPhuongs: req.session.checkedPhuongs});
	}
	else {
		res.locals.diemdats = await models.DiemDat.findAll({
			attributes: [ "id", "DiaChi", "KhuVuc"],
			where: {
				KhuVuc: {
					[Op.endsWith]: khuvuc
				}
			}
		});
		var diemdatIds = res.locals.diemdats.map(diemdat => diemdat.id);
		res.locals.bangquangcaos = await models.BangQuangCao.findAll({
			attributes: [ "id", "LoaiBangQuangCaoId", "KichThuoc", "DiemDatId"],
			include: [
				{ model: models.LoaiBangQuangCao }
			],
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				}
			}
		});
		res.locals.capphepquangcaos = await models.CapPhepQuangCao.findAll({
			attributes: [ "id", "createdAt", "NoiDung", "DiaChiAnh", "TenCongTy", "Email", "DienThoai", "DiaChiCongTy", "DiemDatId", "BangQuangCaoId", "NgayBatDau", "NgayKetThuc" , "TinhTrang"],
			include: [
				{ model: models.DiemDat },
				{
					model: models.BangQuangCao,
					include: [{
						model: models.LoaiBangQuangCao,
						attributes: ["id", "Ten"]
					}]
				},
			],
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				},
			}
		});
		res.render('xlcapphep', { title: "Xử lý cấp phép" , xuly: true , layout: "layoutquan", checkedPhuongs: []});
	}

}

controller.xoaCapPhep  = async(req,res) => {
	let id = isNaN(req.params.id) ? 0 :parseInt(req.params.id);
	try
	{
		await models.CapPhepQuangCao.destroy({where: {id}});
		res.send("Cấp phép đã bị xóa");
	}	catch(error){
		res.send("Không thể xóa tài khoản");
		console.error(error);
	}
};

controller.taoCapPhep = async(req, res) => {
	let { diemdat, bangqc, noidung, tencongty, diachicongty, email, dienthoai, ngaybatdau, ngayketthuc } = req.body;

	try{
		await models.CapPhepQuangCao.create({
			NoiDung: noidung,
			TenCongTy: tencongty,
			Email: email,
			DienThoai: dienthoai,
			DiaChiCongTy: diachicongty,
			NgayBatDau: ngaybatdau,
			NgayKetThuc: ngayketthuc,
			BangQuangCaoId: bangqc,
			DiemDatId: diemdat
		});
		res.redirect("/quan/xlcapphep");
	}	catch(error)
	{
		res.send("Không thể tạo cấp phép!");
		console.error(error);
	}
};

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