const controller = {};

controller.show = (req, res) => {
	res.render('index', { title: "Trang chủ" , trangchu: true , layout: "layoutphuong"});
}

controller.qldiemdat = (req, res) => {
	res.render('qldiemdat', { title: "Quản lý điểm đặt" , quanly: true , layout: "layoutphuong"});
}

controller.qlbangqc = (req, res) => {
	res.render('qlbangqc', { title: "Quản lý bảng quảng cáo" , quanly: true , layout: "layoutphuong"});
}

controller.xlbaocao = (req, res) => {
	res.render('xlbaocao', { title: "Xử lý báo cáo" , xuly: true , layout: "layoutphuong"});
}

controller.xlcapphep = (req, res) => {
	res.render('xlcapphep', { title: "Xử lý cấp phép" , xuly: true , layout: "layoutphuong"});
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