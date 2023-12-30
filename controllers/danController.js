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
	res.render('index', { title: "Trang chủ" , trangchu: true});
};


controller.dsBaoCao = (req, res) => {
	res.render('dan_dsbaocao', { title: "Báo cáo đã gửi" , dsbaocao: true});
};

controller.dangnhap = (req, res) => {
	res.render('dangnhap', { title: "Đăng nhập" , dangnhap: true});
};

controller.guiBaoCao = async (req, res) => {
	console.log(req.body);
	let { hinhthuc, hoten, email, sdt, noidung, laDiemDat, idBiBaoCao} = req.body;
	// try {
	// 	await models.?.create({
	// 	});
	// 	res.redirect('/'); //thay vi render lai
	// } catch (error) {
	// 	res.send("Không thể tạo báo cáo!");
	// 	console.error(error);
	// }
};

module.exports = controller;