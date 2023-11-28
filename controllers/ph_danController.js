const controller = {};

controller.show = (req, res) => {
	res.render("index")
}

controller.dsBaoCao = (req, res) => {
	res.render("dsbaocao")
}

controller.formBaoCao = (req, res) => {
	res.render("guibaocao")
}
module.exports = controller;