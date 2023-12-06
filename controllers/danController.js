const controller = {};

controller.show = (req, res) => {
	res.render('index', { title: "Trang chủ" , trangchu: true});
}

controller.dsBaoCao = (req, res) => {
	res.render('dan_dsbaocao', { title: "Báo cáo đã gửi" , dsbaocao: true});
}

controller.formBaoCao = (req, res) => {
	res.render("dan_guibaocao")
}

controller.dangnhap = (req, res) => {
	res.render("dangnhap");
}

module.exports = controller;