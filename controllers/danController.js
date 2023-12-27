const controller = {};

controller.show = (req, res) => {
	res.render('index', { title: "Trang chủ" , trangchu: true});
}

controller.dsBaoCao = (req, res) => {
	res.render('dan_dsbaocao', { title: "Báo cáo đã gửi" , dsbaocao: true});
}

controller.dangnhap = (req, res) => {
	res.render('dangnhap', { title: "Đăng nhập" , dangnhap: true});
}

module.exports = controller;