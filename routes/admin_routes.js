const express = require("express");
const router = express.Router();
var exe = require('../db.js');
const bcrypt = require("bcryptjs");
const session = require("express-session");

// ================= SESSION =================
router.use(session({
  secret: "adminSecretKey",
  resave: false,
  saveUninitialized: true
}));


router.get("/", (req, res) => {
  res.render("admin/login.ejs")
});

router.get("/register", (req, res) => {
  res.render("admin/register.ejs", { error: null })
});

router.post("/save_register", async function (req, res) {
  try {
    const { name, email, mobile, password } = req.body;

    const rows = await exe(
      "SELECT * FROM register WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return res.render("admin/register.ejs", {
        error: "Email already exists"
      });
    }

    await exe(
      "INSERT INTO register (name, email, mobile, password) VALUES (?, ?, ?, ?)",
      [name, email, mobile, password]
    );

    res.redirect("/admin");

  } catch (err) {
    console.log(err);
    res.render("admin/register.ejs", {
      error: "Database Error"
    });
  }
});

router.post("/save_login", function (req, res) {
  const { email, password } = req.body;

  const sql = "SELECT * FROM register WHERE email = ? AND password = ?";
  exe(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    if (result.length === 0) {
      return res.send("Invalid Email or Password");
    };
    const user = result[0];

    // session set
    req.session.userId = user.id;
    req.session.email = user.email;

    res.redirect("/admin/dashboard");
  });
});


router.use(verifylogin = function (req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect("/admin");
  }
});


router.get("/dashboard", (req, res) => {
  const sql = "SELECT COUNT(*) AS total FROM inquiry";
  exe(sql, (err, result) => {
    if (err) {
      console.log("DB Error:", err);
      return res.send("Database Error");
    }

    const totalUsers = result.length > 0 ? result[0].total : 0;

    res.render("admin/dashboard.ejs", {
      "totalUsers": totalUsers
    });
  });
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
});

module.exports = router;
