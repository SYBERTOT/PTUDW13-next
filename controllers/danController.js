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


controller.dsBaoCao = async (req, res) => {
	const mySignedCookie = req.signedCookies.mySignedCookie;
    const BaoCaoDaGuis = (mySignedCookie && JSON.parse(mySignedCookie)) || [];

	try {
        for (let i = 0; i < BaoCaoDaGuis.length; i++) {
            const baoCao = BaoCaoDaGuis[i];
			if (baoCao.laDiemDat == null) {
				BaoCaoDaGuis[i].TenDiemDat = baoCao.DiaChi;
				BaoCaoDaGuis[i].TenBangQC = "Địa điểm";
			} else {
				BaoCaoDaGuis[i].TenDiemDat = "";
				BaoCaoDaGuis[i].TenBangQC = "Điểm đặt";
	
				if (baoCao.DiemDatId != null) {
					const diemDatInfo = await models.DiemDat.findByPk(baoCao.DiemDatId);
					BaoCaoDaGuis[i].TenDiemDat = diemDatInfo.DiaChi;
				}
	
				if (baoCao.BangQuangCaoId != null) {
					const bangQCInfo = await models.BangQuangCao.findByPk(baoCao.BangQuangCaoId);
					const loaiBangQC = await models.LoaiBangQuangCao.findByPk(bangQCInfo.LoaiBangQuangCaoId);
					BaoCaoDaGuis[i].TenBangQC = loaiBangQC.Ten;
				}
			}

			const hinhthucInfo = await models.HinhThucBaoCao.findByPk(baoCao.HinhThucBaoCaoId);
			BaoCaoDaGuis[i].HinhThucBaoCao = hinhthucInfo.Ten;

			const tinhtrangInfo = await models.BaoCao.findByPk(baoCao.id, {attributes: ['XuLy', ],});
			BaoCaoDaGuis[i].XuLy = tinhtrangInfo.XuLy;
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

	// console.log(BaoCaoDaGuis);
	res.render('dan_dsbaocao', { title: "Báo cáo đã gửi" , dsbaocao: true, BaoCaoDaGuis});
};

controller.dangnhap = (req, res) => {
	res.render('dangnhap', { title: "Đăng nhập" , dangnhap: true});
};

controller.guiBaoCao = async (req, res) => {
	// res.clearCookie('mySignedCookie');
	console.log(req.body);
	let { NoiDung, HoTen, Email, DienThoai, laDiemDat, HinhThucBaoCaoId, DiemDatId, BangQuangCaoId, DiaChiNgauNhien } = req.body;
	
	let DiaChi = DiaChiNgauNhien;
	if (laDiemDat == 'null') {
		laDiemDat = null;
		HinhThucBaoCaoId = parseInt(HinhThucBaoCaoId, 10);
    	DiemDatId = null;
    	BangQuangCaoId = null;
	} else {
		DiaChi = null;
		laDiemDat = laDiemDat === 'true'; // Convert 'true' to boolean true
		HinhThucBaoCaoId = parseInt(HinhThucBaoCaoId, 10);
		DiemDatId = DiemDatId ? parseInt(DiemDatId, 10) : null;
		BangQuangCaoId = BangQuangCaoId ? parseInt(BangQuangCaoId, 10) : null;
	}

	try {
		const BaoCao = {
            NoiDung,
            HoTen,
            Email,
            DienThoai,
            laDiemDat,
            HinhThucBaoCaoId,
            DiemDatId,
            BangQuangCaoId,
			DiaChi
        };
		console.log(BaoCao);

		const createdBaoCao = await models.BaoCao.create(BaoCao);
        const createdBaoCaoId = createdBaoCao.id;
		const createdBaoCaoDate = createdBaoCao.createdAt;

		const mySignedCookie = req.signedCookies.mySignedCookie;
        const BaoCaoDaGuis = (mySignedCookie && JSON.parse(mySignedCookie)) || [];
		BaoCaoDaGuis.push({ ...BaoCao, id: createdBaoCaoId, date: createdBaoCaoDate});

		const expirationDate = new Date('2028-01-19T03:14:07');
		res.cookie("mySignedCookie", JSON.stringify(BaoCaoDaGuis), {
			expires: expirationDate,
            // maxAge: 60 * 60 * 1000,
            httpOnly: true,
            signed: true,
        });
		res.send("Đã gửi báo cáo!");
	} catch (error) {
		res.send("Không thể tạo báo cáo!");
		console.error(error);
	}
};

module.exports = controller;