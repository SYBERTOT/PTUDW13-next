const express = require("express");
const app = express();
const port = 4000 || process.env.PORT;;
const expressHbs = require("express-handlebars");

app.use(express.static(__dirname +"/html"));

app.engine(
    "hbs",
    expressHbs.engine({
        layoutsDir: __dirname + "/views/layouts",
        partialsDir:__dirname +"/views/partials",
        extname:"hbs",
        defaultLayout: "layout",
    })
);
app.set("view engine","hbs");

app.get("/", (req, res) => res.redirect("/trangchu"));
app.use("/trangchu", require("./routes/ph_danRouter"))

app.listen(port,() => console.log(`Example app listening on port ${port}`));