var express = require("express");
var app = express();
var user_route = require("./routes/user_routes");
var admin_route = require("./routes/admin_routes");
var home_route = require("./routes/home_routes");
var about_route = require("./routes/about_routes");
var products_route = require("./routes/products_routes");
var offers_route = require("./routes/offers_routes");
var gallery_route = require("./routes/gallery_routes");
const bodyparser = require("body-parser");
const session = require("express-session");

app.use(express.static('public'));

app.use(bodyparser.json());

require('dotenv').config();

app.use(bodyparser.urlencoded({extended:true}));

app.use("/",user_route);
app.use("/admin",admin_route);
app.use("/admin/home",home_route);
app.use("/admin/about",about_route);
app.use("/admin/products",products_route);
app.use("/admin/offers",offers_route);
app.use("/admin/gallery",gallery_route);

app.listen(process.env.PORT || 1100);