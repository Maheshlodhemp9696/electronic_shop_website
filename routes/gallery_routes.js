const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const router = express.Router();
router.use(fileUpload());
var exe = require('../db.js');
const bcrypt = require("bcryptjs");
const fs = require("fs");
router.use(express.static('public/'));


router.use(verifylogin = function (req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect("/admin");
  }
});

router.get("/",function(req,res){
    res.render("admin/gallery.ejs")
});

router.get("/add_gallery",function(req,res){
  res.render("gallery/add_gallery.ejs");
});

router.post("/save_gallery",(req,res)=>{
  const d = req.body;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const imageFile = req.files.image;
    const uploadPath = path.join(__dirname, '../public/uploads/', imageFile.name);
    imageFile.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);

    const sql = "INSERT INTO gallery(image,caption) VALUES (?,?)";
    exe(sql, [imageFile.name,d.caption], function (err, result) {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }
        res.redirect("/admin/gallery/add_gallery");
    });
  });
});
router.get("/view_gallery", function (req, res) {
const sql = "SELECT * FROM gallery ORDER BY id DESC";
    exe(sql, function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }  
    res.render("gallery/view_gallery.ejs", { "gallery": result });
    });
});

router.get("/delete_gallery/:id", function (req, res) {
    const id = req.params.id;
    const sql = "DELETE FROM gallery WHERE id = ?";
    exe(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    if (result.affectedRows === 0) {
        return res.send("No record found with the given ID");
    }
    res.redirect("/admin/gallery/view_gallery");
    });
});

router.get("/update_gallery/:id", function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM gallery WHERE id = ?";
    exe(sql, [id], function (err, result) {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        if (result.length === 0) {
            return res.send("No record found with the given ID");
        }
        res.render("gallery/update_gallery.ejs", { "gallery": result[0] });
    });
});

router.post("/save_update_gallery/:id", function (req, res) {
    const id = req.params.id;
    const d = req.body;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const imageFile = req.files.image;
    const uploadPath = path.join(__dirname, '../public/uploads/', imageFile.name);
    imageFile.mv(uploadPath, function(err) {
        if (err)
            return res.status(500).send(err);

        const sql = "UPDATE gallery SET image=?, caption=? WHERE id=?";
        exe(sql, [imageFile.name, d.caption, id], function (err, result) {
            if (err) {
                console.log(err);
                return res.send("Database Error");
            }
            res.redirect("/admin/gallery/view_gallery");
        });
    });
});

module.exports = router;