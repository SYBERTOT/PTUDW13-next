const express = require("express");
const app = express();
const port = 4000 | process.env.PORT;;
const expressHbs = require("express-handlebars");
const paginate = require('express-handlebars-paginate');

const cookieParser = require("cookie-parser");
const session = require("express-session");

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
				return new Date(date).toLocaleDateString(
					'vi-VN', {           
						year: 'numeric',           
						month: 'long',           
						day: 'numeric',         
					});       
				},    
			paginateHelper: paginate.createPagination, 
			json : (context) => {
				return JSON.stringify(context);
			},
			inc: (value) => {
				return parseInt(value) + 1;
			},
			eq: (a, b, opt) => {
				return (a == b) ? opt.fn(this) : opt.inverse(this);
			}

			},   
		}),
);
app.set("view engine","hbs");

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

app.use(cookieParser("COOKIE_SECRET"));

app.use(
	session({
	  secret: "SESSION_SECRET",
	  resave: false,
	  saveUninitialized: false,
	  cookie: {
		secure: false,  // if true only transmit cookie over https
		httpOnly: true, // prevent client side JS from reading the cookie
		maxAge: 20 * 60 * 1000, // 20 minutes
	  },
	})
);

app.use("/", require("./routes/authRouter"));

app.get('/sync', function(req,res){
	let models = require('./models');
	models.sequelize.sync().then(function(){
		res.send('Database sync completed');
	});
});

app.listen(port,() => console.log(`Example app listening on port ${port}`));