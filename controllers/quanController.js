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
		where: {
			KhuVuc: {
				[Op.endsWith]: khuvuc
			}
		}
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
	let khuvuc = req.session.taikhoan.KhuVuc;
	let search = req.query.search;
	res.locals.loaidiemdats = await models.LoaiDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.hinhthucdiemdats = await models.HinhThucDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.loaibangquangcaos = await models.LoaiBangQuangCao.findAll({
		attributes: [ "id", "Ten"]
	})

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
		res.render('canbo_qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , layout: "layoutquan"});
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
		res.render('canbo_qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , layout: "layoutquan"});
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
	res.locals.hinhthucbaocaos = await models.HinhThucBaoCao.findAll({
		attributes: [ "id", "Ten"]
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
	res.render('xlbaocao', { title: "Xử lý báo cáo" , xuly: true , layout: "layoutquan"});
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
		},
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
	res.render('xlcapphep', { title: "Xử lý cấp phép" , xuly: true , layout: "layoutquan"});
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