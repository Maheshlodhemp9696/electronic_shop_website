const express = require("express");
const util = require("util");
const mysql2 = require("mysql2");

require('dotenv').config();

var conn = mysql2.createConnection({
    host:process.env.HOST || localhost,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE

})
var exe = util.promisify(conn.query).bind(conn);

module.exports = exe ; 

// HOST=localhost
// USER=root
// PASSWORD=root
// DATABASE= electronic_shop
// PORT= 1000