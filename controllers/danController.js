const controller = {};

controller.show = (req, res) => {
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
	let { hinhthuc, hoten, email, sdt, noidung} = req.body;
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