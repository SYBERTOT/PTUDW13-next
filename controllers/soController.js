const controller = {};

controller.qldiemdat = (req, res) => {
	res.render('qldiemdat', { title: "Quản lý điểm đặt" , quanly: true , layout: "layoutso"});
}

controller.qlbangqc = (req, res) => {
	res.render('qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , layout: "layoutso"});
}

controller.qltaikhoan = (req, res) => {
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
	let {TenTaiKhoan, MatKhau, LoaiTaiKhoanId, KhuVuc} = req.body;
	try{
		await models.Taikhoan.create({
			TenTaiKhoan,
			MatKhau,
			LoaiTaiKhoanId,
			KhuVuc
		});
	}	catch(error)
	{
		res.send("Không thể tạo tài khoản!");
		console.error(error);
	}
};

controller.xoaTaiKhoan  = async(req,res) => {
	let id = isNaN(req.params.id) ? 0 :parseInt(req.params.id);
	try
	{
		await models.Taikhoan.destroy({where: {id}});
		res.send("Tài khoản đã bị xóa");
	}	catch(error){
		res.send("Không thể xóa tài khoản");
		console.error(error);
	}
};

module.exports = controller;