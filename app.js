const express = require("express");
const app = express();
const port = 4000 | process.env.PORT;;
const expressHbs = require("express-handlebars");
const paginate = require('express-handlebars-paginate');

const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./passport');

app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



app.use(express.static(__dirname +"/html"));
app.engine(
    "hbs",
    expressHbs.engine({
        layoutsDir: __dirname + "/views/layouts",
        partialsDir:__dirname +"/views/partials",
        extname:"hbs",
        defaultLayout: "layoutdan",
		runtimeOptions: {       
			allowProtoPropertiesByDefault: true,     
		}, 
		helpers: {       
			showDate: (date) => {          
				return date.toLocaleDateString(
					'en-US', {           
						year: 'numeric',           
						month: 'long',           
						day: 'numeric',         
					});       
				},    
			paginateHelper: paginate.createPagination, 

			},   
		}),
);
app.set("view engine","hbs");

//	MIDDLEWARE
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
	  return next();
	}
	res.redirect('/trangchu/dangnhap');
}

app.get("/", (req, res) => res.redirect("/trangchu"));
app.use("/trangchu", require("./routes/danRouter"));

app.use("/phuong", ensureAuthenticated, require("./routes/phuongRouter"));
app.use("/quan", ensureAuthenticated, require("./routes/quanRouter"));
app.use("/so", ensureAuthenticated, require("./routes/soRouter"));


app.post('/trangchu/dangnhap', passport.authenticate('local', {
		failureRedirect: '../trangchu/dangnhap',
		failureFlash: true,
	}), (req, res) => {
		if (req.user.role === 'phuong') {
			res.redirect('../phuong');
		} else if (req.user.role === 'quan') {
			res.redirect('../quan');
		} else if (req.user.role === 'so'){
			res.redirect('../so');
		} else {
			res.redirect('/trangchu');
		}
	}
);

// app.get('/logout', (req, res) => {
// 	req.logout();
// 	res.redirect('/');
// });

app.get('/sync', function(req,res){
	let models = require('./models');
	models.sequelize.sync().then(function(){
		res.send('Database sync completed');
	});
});
app.listen(port,() => console.log(`Example app listening on port ${port}`));