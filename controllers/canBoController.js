const controller = {};
const models = require("../models");
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const sendAnnouncementEmail = require('../html/js/sendAnnouncementEmail');

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
	res.render('index', { title: "Trang chủ" , trangchu: true , layout: "layoutcanbo"});
}

controller.qldiemdat = async (req, res) => {
	let khuvuc = req.session.taikhoan.KhuVuc;
	let loaitk = req.session.taikhoan.LoaiTaiKhoanId;
	let search = req.query.search;
	let phuong = req.query.phuong;
	let tenQuan = '';
	let isQuan = false;
	res.locals.loaidiemdats = await models.LoaiDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.hinhthucdiemdats = await models.HinhThucDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});

	if (loaitk === 2)
	{
		isQuan = true;
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
		res.render('canbo_qldiemdat', { title: "Quản lý điểm đặt" , quanly: true , laQuan: isQuan, layout: "layoutcanbo", checkedPhuongs: []});
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
		res.render('canbo_qldiemdat', { title: "Quản lý điểm đặt" , quanly: true, laQuan: isQuan , layout: "layoutcanbo", checkedPhuongs: req.session.checkedPhuongs});
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
		res.render('canbo_qldiemdat', { title: "Quản lý điểm đặt" , quanly: true, laQuan: isQuan , layout: "layoutcanbo", checkedPhuongs: []});
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
		res.redirect("/canbo/qldiemdat");
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
	let isQuan = false;
	
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
		isQuan = true;
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
		res.render('canbo_qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , laQuan: isQuan, layout: "layoutcanbo", checkedPhuongs: []});
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
		res.render('canbo_qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , laQuan: isQuan , layout: "layoutcanbo", checkedPhuongs: req.session.checkedPhuongs});
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
		res.render('canbo_qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , laQuan: isQuan, layout: "layoutcanbo", checkedPhuongs: []});
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
		res.render('canbo_qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true ,laQuan: isQuan, layout: "layoutcanbo", checkedPhuongs: []});
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
		res.redirect("/canbo/qlbangqc");
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
	let isQuan = false;
	res.locals.hinhthucbaocaos = await models.HinhThucBaoCao.findAll({
		attributes: [ "id", "Ten"]
	});
	if (loaitk === 2)
	{
		isQuan = true
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
			attributes: [ "id", "createdAt", "NoiDung", "HoTen", "Email", "DienThoai", "laDiemDat", "HinhThucBaoCaoId", "DiemDatId", "BangQuangCaoId", "XuLy", "TaiKhoanId", "HinhThucXuLy", "DiaChi"],
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
				[Op.or]: {
					DiemDatId: {
						[Op.in]: diemdatIds
					},
					DiaChi: {
						[Op.like]: `%${search}%`
					}
				  }
			}
		});
		res.render('xlbaocao', { title: "Xử lý báo cáo" , xuly: true , layout: "layoutcanbo", laQuan: isQuan, checkedPhuongs: []});
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
		const parseDiaChi = phuongTens.map(phuongTen => {
			return {
			  [Op.like]: `%${phuongTen}%`
			};
		});
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
				},
			}
		});
		res.locals.baocaos = await models.BaoCao.findAll({
			attributes: [ "id", "createdAt", "NoiDung", "HoTen", "Email", "DienThoai", "laDiemDat", "HinhThucBaoCaoId", "DiemDatId", "BangQuangCaoId", "XuLy", "TaiKhoanId", "DiaChi"],
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
				[Op.or]: {
					DiemDatId: {
						[Op.in]: diemdatIds
					},
					DiaChi: {
						[Op.or]: parseDiaChi
					}
				}
			}
		});
		req.session.checkedPhuongs = phuongArray;
		res.render('xlbaocao', { title: "Xử lý báo cáo" , xuly: true , layout: "layoutcanbo", laQuan: isQuan, checkedPhuongs: req.session.checkedPhuongs});
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
			attributes: [ "id", "createdAt", "NoiDung", "HoTen", "Email", "DienThoai", "laDiemDat", "HinhThucBaoCaoId", "DiemDatId", "BangQuangCaoId", "XuLy", "TaiKhoanId", "DiaChi"],
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
				[Op.or]: {
					DiemDatId: {
						[Op.in]: diemdatIds
					},
					DiaChi: {
						[Op.like]: `%${khuvuc}%`
					}
				  }
			}
		});
		res.render('xlbaocao', { title: "Xử lý báo cáo" , xuly: true , layout: "layoutcanbo", laQuan: isQuan, checkedPhuongs: []});
	}
	
}

controller.capnhatCachThucXuLy = async (req, res) => {
	let { id, cachthuc, email } = req.body;
	try {
		await models.BaoCao.update({
			XuLy: true,
			HinhThucXuLy: cachthuc,
			TaiKhoanId: req.session.taikhoan.id
		},
		{
			where: { id }
		});

		const baocao = await models.BaoCao.findOne({
			include: [
				{ model: models.HinhThucBaoCao },
				{ model: models.DiemDat},
				{ model: models.BangQuangCao,
					include: [ models.LoaiBangQuangCao ]
				 },
			],
			where: {id}
		});

		let bangqc = "(Điểm đặt)";
		if (baocao.BangQuangCao) {
			bangqc = `(${baocao.BangQuangCao.LoaiBangQuangCao.Ten})`;
		}
		let ngayUpdate = new Date(baocao.updatedAt).toLocaleString('vi-VN', {
			day: 'numeric',
			month: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		});
		let ngayCreate = new Date(baocao.createdAt).toLocaleString('vi-VN', {
			day: 'numeric',
			month: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		});

		let subject = 'Thông báo về tình trạng xử lý của báo cáo bạn đã gửi';
		let content = `<p>Chào bạn ${baocao.HoTen},</p>
		<p>Chúng tôi xin gửi lời chào thân ái đến bạn. Bạn đang nhận được thông báo này vì bạn đã gửi một báo cáo và chúng tôi đã tiến hành xử lý nó. Dưới đây là thông tin chi tiết về báo cáo mà bạn đã gửi:</p>
		<p><strong>Ngày gửi</strong>: ${ngayCreate}</p>
		<p><strong>Hình thức báo cáo</strong>: ${baocao.HinhThucBaoCao.Ten}</p>
		<p><strong>Điểm đặt bị báo cáo</strong>: ${baocao.DiemDat.DiaChi} ${bangqc}</p>
		<p><strong>Nội dung báo cáo</strong>: </p>
		<p>${baocao.NoiDung}</p>

		<p><strong>Hình thức xử lý</strong>: ${cachthuc}</p>
		<p><strong>Ngày xử lý</strong>: ${ngayUpdate}</p>
		<p>Chúng tôi xin cảm ơn sự hợp tác của bạn trong việc gửi báo cáo. Nếu bạn có bất kỳ câu hỏi hoặc cần thêm thông tin, đừng ngần ngại liên hệ với chúng tôi qua email này.</p>
		<p>Trân trọng,<br><strong>PTUDW-13</strong></p>`;

		await sendAnnouncementEmail(email, subject, content);
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
	let isQuan = false;
	if (loaitk === 2)
	{
		isQuan = true;
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
		res.render('xlcapphep', { title: "Xử lý cấp phép" , xuly: true , layout: "layoutcanbo", laQuan: isQuan, checkedPhuongs: []});
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
		res.render('xlcapphep', { title: "Xử lý cấp phép" , xuly: true , layout: "layoutcanbo", laQuan: isQuan, checkedPhuongs: req.session.checkedPhuongs});
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
		res.render('xlcapphep', { title: "Xử lý cấp phép" , xuly: true , layout: "layoutcanbo", laQuan: isQuan, checkedPhuongs: []});
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
	let hinhanh = req.file.path;
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
			DiemDatId: diemdat,
			DiaChiAnh: hinhanh
		});
		res.redirect("/canbo/xlcapphep");
	}	catch(error)
	{
		res.send("Không thể tạo cấp phép!");
		console.error(error);
	}
};

controller.taoCapPhepTuBangQC = async(req, res) => {
	let { bangqcid, diemdatid, noidung, tencongty, diachicongty, email, dienthoai, ngaybatdau, ngayketthuc } = req.body;
	let hinhanh = req.file.path;
	try{
		await models.CapPhepQuangCao.create({
			NoiDung: noidung,
			TenCongTy: tencongty,
			Email: email,
			DienThoai: dienthoai,
			DiaChiCongTy: diachicongty,
			NgayBatDau: ngaybatdau,
			NgayKetThuc: ngayketthuc,
			BangQuangCaoId: bangqcid,
			DiemDatId: diemdatid,
			DiaChiAnh: hinhanh
		});
		res.redirect("/canbo/qlbangqc");
	}	catch(error)
	{
		res.send("Không thể tạo cấp phép!");
		console.error(error);
	}
};

controller.thongTin = async (req, res) => {
    let taikhoan = await models.TaiKhoan.findOne({
        attributes: [ "id", "HoTen", "TenTaiKhoan", "Email", "MatKhau", "KhuVuc", "DienThoai", "NgaySinh"],
        where: { id: res.locals.taikhoan.id },
    });
	taikhoan.NgaySinh.value = new Date(taikhoan.NgaySinh).toISOString().split('T')[0];
    res.render("thongtin", {layout: "layoutcanbo", taikhoan});
};

controller.CapNhatThongTin = async (req, res) =>{
	let{id, HoTen, Email, DienThoai, NgaySinh} = req.body;
	try {
		await models.TaiKhoan.update({
			HoTen,
			Email,
			DienThoai,
			NgaySinh
		}, {where:{id: id}});
		res.json({msg: 'true'});
	} 	catch(error)
	{
		console.error(error);
		res.json({msg: 'false'});
	}
}

controller.doiMatKhau = async (req, res) => {
    let { id, MkCu, MkMoi } = req.body;
	let tk = await models.TaiKhoan.findOne({
        attributes: ["MatKhau"],
        where: { id: id },
    });
	if(tk){
		const match = await bcrypt.compare(MkCu, tk.MatKhau);
		if(match){
			const hashedPassword = await bcrypt.hash(MkMoi, 10);
			try {
				await models.TaiKhoan.update({
					MatKhau: hashedPassword,
				},
				{
					where: {id: id}
				});
				res.json({msg: 'true'});
			}
			catch (error) {
					console.error(error);
					 res.json({msg: 'false'});
			}
		} else res.json({msg: 'oldpsw'});
	} else res.json({msg: 'false'});
};

module.exports = controller;

