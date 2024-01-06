const express = require("express");
const app = express();
const port = 4000 | process.env.PORT;;
const expressHbs = require("express-handlebars");
const paginate = require('express-handlebars-paginate');

const cookieParser = require("cookie-parser");
const session = require("express-session");

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const YOUR_APP_ID = "1363610574264678";
const YOUR_APP_SECRET = "b35089f5d08347d5302206f1a0851782";

const TaiKhoan = require("./models").TaiKhoan;
const LoaiTaiKhoan = require("./models").LoaiTaiKhoan;

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
app.use(passport.initialize());
app.use(passport.session());
passport.use(new FacebookStrategy({
    clientID: YOUR_APP_ID,
    clientSecret: YOUR_APP_SECRET,
    callbackURL: 'http://localhost:4000/dangnhap/facebook/callback',
	profileFields: ['id', 'emails', 'displayName'],
	profileFields: ['emails'],
	// request the user's email
    scope: ['email'],
}, async (accessToken, refreshToken, profile, done) => {
	let Email = profile.emails[0].value;
	console.log(Email);
	const taikhoan = await TaiKhoan.findOne({ 
		attributes: [ "id", "Email", "TenTaiKhoan", "MatKhau", "LoaiTaiKhoanId",],
		where: { Email },
		include: [{ model: LoaiTaiKhoan, attributes: ["HoTen"] }]
	});

	if (taikhoan) {

		return done(null, taikhoan);

	} else {
		return done(null, null);

	}

}));
passport.serializeUser((user, done) => {
    // Serialize user information to store in the session
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    // Deserialize user from the session
    done(null, obj);
});

app.get('/dangnhap/facebook', passport.authenticate('facebook'));
app.get('/dangnhap/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: 'localhost:4000/dangnhap' }),
    (req, res) => {
		console.log(req.user);
		if (req.user) {
			req.session.taikhoan = req.user;
			return res.redirect("/");
		}
		return res.redirect("/dangnhap");

    }
);
app.use("/", require("./routes/authRouter"));

app.get('/sync', function(req,res){
	let models = require('./models');
	models.sequelize.sync().then(function(){
		res.send('Database sync completed');
	});
});

app.listen(port,() => console.log(`Example app listening on port ${port}`));