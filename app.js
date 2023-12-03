const express = require("express");
const app = express();
const port = 4000 || process.env.PORT;;
const expressHbs = require("express-handlebars");
const paginate = require('express-handlebars-paginate');

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

app.get("/", (req, res) => res.redirect("/trangchu"));
app.use("/trangchu", require("./routes/danRouter"));
app.use("/phuong", require("./routes/phuongRouter"));
app.use("/quan", require("./routes/quanRouter"));
app.use("/so", require("./routes/soRouter"));

app.listen(port,() => console.log(`Example app listening on port ${port}`));