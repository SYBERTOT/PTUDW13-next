const controller = {};
const models = require("../models");
const { Op } = require('sequelize');
const axios = require('axios');

const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt hashing

controller.qldiemdat = async (req, res) => {
	let quan = req.query.quan;
	let phuong = req.query.phuong;
	res.locals.loaidiemdats = await models.LoaiDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.hinhthucdiemdats = await models.HinhThucDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.quans = await models.Quan.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.phuongs = await models.Phuong.findAll({
		attributes: [ "id", "Ten", "QuanId"]
	});
	if(quan)
	{
		let tenQuan = await models.Quan.findOne({
			attributes: [ "id", "Ten"],
			where: {
				id: quan
			}
		});
		let khuvuc = tenQuan.Ten;
		if (phuong && phuong !='#') {
			let tenPhuong = await models.Phuong.findOne({
				attributes: [ "id", "Ten"],
				where: {
					id: phuong
				}
			});
			khuvuc = tenPhuong.Ten + ', ' + tenQuan.Ten;
		};
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
		res.render('qldiemdat', { title: "Quản lý điểm đặt" , quanly: true , layout: "layoutso"});
	}
	else{
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
	res.render('qldiemdat', { title: "Quản lý điểm đặt" , quanly: true , layout: "layoutso"});}
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
		res.send("Không thể xóa điểm đặt");
		console.error(error);
	}
};

controller.qlbangqc = async (req, res) => {
	let diemdat = req.query.diemdat;
	let quan = req.query.quan;
	let phuong = req.query.phuong;
	res.locals.loaidiemdats = await models.LoaiDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.hinhthucdiemdats = await models.HinhThucDiemDat.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.quans = await models.Quan.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.phuongs = await models.Phuong.findAll({
		attributes: [ "id", "Ten", "QuanId"]
	});
	if (diemdat) {
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
			where: {
				DiemDatId: diemdat
			}
		});
		res.render('qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , layout: "layoutso"});
	}
	else if(quan)
	{
		let tenQuan = await models.Quan.findOne({
			attributes: [ "id", "Ten"],
			where: {
				id: quan
			}
		});
		let khuvuc = tenQuan.Ten;
		if (phuong && phuong !='#') {
			let tenPhuong = await models.Phuong.findOne({
				attributes: [ "id", "Ten"],
				where: {
					id: phuong
				}
			});
			khuvuc = tenPhuong.Ten + ', ' + tenQuan.Ten;
		};

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
				"LoaiBangQuangCaoId"],
			include: [
				{model : models.DiemDat},
				{ model: models.LoaiBangQuangCao }
			],
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				}
			}
		});
		res.render('qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , layout: "layoutso"});
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
	let quan = req.query.quanSearch;
	let phuong = req.query.phuongSearch;
	
	res.locals.loaitaikhoans = await models.LoaiTaiKhoan.findAll({
		attributes: [ "id", "HoTen"],
		where: {
			id: {
				[Op.ne]: 3
			}
		}
	});
	res.locals.quans = await models.Quan.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.phuongs = await models.Phuong.findAll({
		attributes: [ "id", "Ten", "QuanId"]
	});
	
	if(quan)
	{
		let tenQuan = await models.Quan.findOne({
			attributes: [ "id", "Ten"],
			where: {
				id: quan
			}
		});
		let khuvuc = tenQuan.Ten;
		if (phuong && phuong !='#') {
			let tenPhuong = await models.Phuong.findOne({
				attributes: [ "id", "Ten"],
				where: {
					id: phuong
				}
			});
			khuvuc = tenPhuong.Ten + ', ' + tenQuan.Ten;
		};
		res.locals.taikhoans = await models.TaiKhoan.findAll({
			attributes: [
			  "id",
			  "HoTen",
			  "NgaySinh",
			  "Email",
			  "DienThoai",
			  "KhuVuc",
			  "TenTaiKhoan",
			  "LoaiTaiKhoanId",
			],
			order: [["createdAt", "DESC"]],
			include: [
				{ model: models.LoaiTaiKhoan}
			],
			where: {
				LoaiTaiKhoanId: {
					[Op.ne]: 3
				},
				KhuVuc:{
				[Op.endsWith]: khuvuc
			}
			}
		  });
		res.render('qltaikhoan', { title: "Quản lý tài khoản" , quanly: true , layout: "layoutso"});
	}
	else 
	{
		res.locals.taikhoans = await models.TaiKhoan.findAll({
		attributes: [
		  "id",
		  "HoTen",
		  "NgaySinh",
		  "Email",
		  "DienThoai",
		  "KhuVuc",
		  "TenTaiKhoan",
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
	res.render('qltaikhoan', { title: "Quản lý tài khoản" , quanly: true , layout: "layoutso"});}
}
controller.taoTaiKhoan = async(req, res) => {
	let { username, loaitk, phuong, quan } = req.body;
	let MatKhau = await bcrypt.hash("123", saltRounds);
	let tenphuong = await models.Phuong.findOne({
		attributes: ["id", "Ten"],
		where: {
			id: {
				[Op.eq]: phuong
			}
		}
	});
	let tenquan = await models.Quan.findOne({
		attributes: ["id", "Ten"],
		where: {
			id: {
				[Op.eq]: quan
			}
		}
	});
	let khuvuc = '';
	if (loaitk == 1) {
		khuvuc = tenphuong.Ten + ', ' + tenquan.Ten;
	}
	else if (loaitk ==2) {
		khuvuc = tenquan.Ten;
	}
	try{
		await models.TaiKhoan.create({
			TenTaiKhoan: username, 
			LoaiTaiKhoanId: loaitk,
			KhuVuc: khuvuc,
			MatKhau: MatKhau,
		});
		res.redirect("/so/qltaikhoan");
	}	catch(error)
	{
		res.send("Không thể tạo tài khoản!");
		console.error(error);
	}
};
controller.capnhatTaiKhoan = async (req, res) => {
	let { id, loaitk, tenphuong, tenquan } = req.body;
	let khuvuc = '';
	if (loaitk == 1) {
		khuvuc = tenphuong + ', ' + tenquan;
	}
	else if (loaitk ==2) {
		khuvuc = tenquan;
	}
	try {
		await models.TaiKhoan.update({
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

controller.qlquanphuong = async (req, res) => {
	res.locals.quans = await models.Quan.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.phuongs = await models.Phuong.findAll({
		attributes: [ "id", "Ten", "QuanId"]
	});
	res.render('qlquanphuong', { title: "Quản lý quận, phường" , quanly: true , layout: "layoutso"});
}

controller.pheduyet = async (req, res) => {
	res.locals.diemdats = await models.DiemDat.findAll({
		attributes: [ "id", "DiaChi", "KhuVuc"],
	});
	var diemdatIds = res.locals.diemdats.map(diemdat => diemdat.id);
	res.locals.bangquangcaos = await models.BangQuangCao.findAll({
		attributes: [ "id", "LoaiBangQuangCaoId", "KichThuoc", "DiemDatId"],
		include: [
			{ model: models.LoaiBangQuangCao }
		],
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
			TinhTrang: null
		}
	});
	res.render('pheduyet', { title: "Phê duyệt" , pheduyet: true , layout: "layoutso"});
}

controller.capnhatPheDuyetCapPhep = async (req, res) => {
	let { id, tinhtrang } = req.body;
	try {
		await models.CapPhepQuangCao.update({
			TinhTrang: tinhtrang
		},
		{
			where: { id }
		});
		res.send("Phê duyệt đã được cập nhật!");
	}
		catch (error) {
			res.send("Không thể cập nhật!");
			console.error(error);
		}
}

controller.thongke = async (req, res) => {
	let quan = req.query.quan;
	let phuong = req.query.phuong;
	res.locals.quans = await models.Quan.findAll({
		attributes: [ "id", "Ten"]
	});
	res.locals.phuongs = await models.Phuong.findAll({
		attributes: [ "id", "Ten", "QuanId"]
	});
	res.locals.hinhthucbaocaos = await models.HinhThucBaoCao.findAll({
		attributes: [ "id", "Ten"]
	});

	if (quan) {
		let tenQuan = await models.Quan.findOne({
			attributes: [ "id", "Ten"],
			where: {
				id: quan
			}
		});
		let khuvuc = tenQuan.Ten;
		if (phuong && phuong !='#') {
			let tenPhuong = await models.Phuong.findOne({
				attributes: [ "id", "Ten"],
				where: {
					id: phuong
				}
			});
			khuvuc = tenPhuong.Ten + ', ' + tenQuan.Ten;
		};
		
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
			attributes: [ "id", "createdAt", "NoiDung", "HoTen", "Email", "DienThoai", "laDiemDat", "HinhThucBaoCaoId", "DiemDatId", "BangQuangCaoId", "XuLy", "TaiKhoanId", "HinhThucXuLy"],
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
				{ model: models.TaiKhoan}
			],
			where: {
				DiemDatId: {
					[Op.in]: diemdatIds
				}
			}
		});
		res.render('thongke', { title: "Thống kê" , thongke: true , layout: "layoutso"});
	}
	else {
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
				{ model: models.TaiKhoan}
			],
		});
		res.render('thongke', { title: "Thống kê" , thongke: true , layout: "layoutso"});
	}
}

controller.thongTin = async (req, res) => {
    let taikhoan = await models.TaiKhoan.findOne({
        attributes: [ "id", "HoTen", "TenTaiKhoan", "Email", "MatKhau", "KhuVuc", "DienThoai", "NgaySinh"],
        where: { id: res.locals.taikhoan.id },
    });
	taikhoan.NgaySinh.value = new Date(taikhoan.NgaySinh).toISOString().split('T')[0];
    res.render("thongtin_so", {layout: "layoutso", taikhoan});
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

controller.qldanhsach = async(req,res) => {
	res.locals.hinhthucdiemdats = await models.HinhThucDiemDat.findAll({
		attributes: ["id", "Ten"]
	});
	res.locals.hinhthucbaocaos = await models.HinhThucBaoCao.findAll({
		attributes: ["id", "Ten"]
	});
	res.render('qldanhsach', {title:"Quản lý danh sách", quanly: true, layout: "layoutso"})
}

controller.themQuan = async(req,res) => {
	let { tenquan } = req.body;

	try{
		await models.Quan.create({
			Ten: tenquan
		});
		res.redirect("/so/qlquanphuong");
	}	catch(error)
	{
		res.send("Không thể tạo quận!");
		console.error(error);
	}
}

controller.themPhuong = async(req,res) => {
	let { tenphuong, idquan } = req.body;

	try{
		await models.Phuong.create({
			Ten: tenphuong,
			QuanId: idquan
		});
		res.redirect("/so/qlquanphuong");
	}	catch(error)
	{
		res.send("Không thể tạo phường!");
		console.error(error);
	}
}

controller.xoaQuan = async(req,res) => {
	let id = isNaN(req.params.id) ? 0 :parseInt(req.params.id);
	try
	{
		await models.Quan.destroy({where: {id}});
		res.send("Điểm đặt đã bị xóa");
	}	catch(error){
		res.send("Không thể xóa điểm đặt");
		console.error(error);
	}
}

controller.xoaPhuong = async(req,res) => {
	let id = isNaN(req.params.id) ? 0 :parseInt(req.params.id);
	try
	{
		await models.Phuong.destroy({where: {id}});
		res.send("Điểm đặt đã bị xóa");
	}	catch(error){
		res.send("Không thể xóa điểm đặt");
		console.error(error);
	}
}

controller.capnhatQuan = async(req,res) => {
	let { idquan, tenquan } = req.body;
	try {
		await models.Quan.update({
			Ten: tenquan
		},
		{
			where: { id: idquan }
		});
		res.send("Tên quận đã được cập nhật!");
	}
		catch (error) {
			res.send("Không thể cập nhật!");
			console.error(error);
		}
}

controller.capnhatPhuong = async(req,res) => {
	let { idphuong, tenphuong } = req.body;
	try {
		await models.Phuong.update({
			Ten: tenphuong
		},
		{
			where: { id: idphuong }
		});
		res.send("Tên phường đã được cập nhật!");
	}
		catch (error) {
			res.send("Không thể cập nhật!");
			console.error(error);
		}
}


module.exports = controller;