const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const router = express.Router();
router.use(fileUpload());
var exe = require('../db.js');
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { route } = require("./admin_routes.js");
const { verify } = require("crypto");

router.use(verifylogin = function (req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect("/admin");
  }
});

router.use(express.static('public/'));

router.get("/",function(req,res){
    res.render("admin/about.ejs")
})



router.get("/add_services",function(req,res){
  res.render("about/add_services.ejs");
});

router.post("/save_services",(req,res)=>{
  const d = req.body;

    const sql = "INSERT INTO services(service,service_discription) VALUES (?,?)";

    exe(sql, [d.service,d.service_discription], function (err, result) {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }
     
     res.redirect("/admin/about/add_services");
    });
  });

router.get("/view_services", function (req, res) {
const sql = "SELECT * FROM services ORDER BY id DESC";

  exe(sql, function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    res.render("about/view_services.ejs", { "services": result });
  });
});


router.get("/delete_services/:id", function (req, res) {
  const id = req.params.id;

  const sql = "DELETE FROM services WHERE id = ?";

  exe(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    if (result.affectedRows === 0) {
      return res.send("Record not found");
    }

    res.redirect("/admin/about/view_services");
  });
});



router.get("/update_services/:id", function (req, res) {
  const id = req.params.id;

  const sql = "SELECT * FROM services WHERE id = ?";

  exe(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    if (result.length === 0) {
      return res.send("Record not found");
    }

    res.render("about/update_services.ejs", { services: result[0]
    });
  });
});



router.post("/save_update_services", function (req, res) {

  const d = req.body;
  const id = d.id;
    const sql = "UPDATE services SET service=?,service_discription=?  WHERE id = ?";

    exe(sql, [d.service,d.service_discription, id], function (err) {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }
      res.redirect("/admin/about/view_services");
    });
});


router.get("/add_owner",function(req,res){
  res.render("about/add_owner.ejs");
});



router.post("/save_owner", function(req, res){

  const { owner_name, owner_discription } = req.body;

  if (!req.files || !req.files.image) {
    return res.send("Image is required");
  }
  const originalName = path.parse(req.files.image.name).name;
  const extension = path.extname(req.files.image.name);
  const time = Date.now();
  const newImageName = `${originalName}_${time}${extension}`;

  const sql = `
    INSERT INTO owner (owner_name, owner_discription,image)
    VALUES (?, ?, ?)
  `;
  exe(sql, [owner_name, owner_discription, newImageName], function(err){
    if(err){
      console.log(err);
      return res.send("Database Insert Error");
    }
    res.redirect("/admin/about/view_owner");
  });
});

router.get("/view_owner", function (req, res) {
    const sql = "SELECT * FROM owner ORDER BY id DESC";
    exe(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        res.render("about/view_owner.ejs", { "owner": result });
    });
});

router.get("/delete_owner/:id", function (req, res) {
    const id = req.params.id;
    const sql = "DELETE FROM owner WHERE id = ?";
    exe(sql, [id], function (err, result) {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        if (result.affectedRows === 0) {
            return res.send("Record not found");
        }
        res.redirect("/admin/about/view_owner");
    });
});

router.get("/update_owner/:id", function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM owner WHERE id = ?"; 
    exe(sql, [id], function (err, result) {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        if (result.length === 0) {
            return res.send("Record not found");
        }
        res.render("about/update_owner.ejs", { owner: result[0] });
    });
});

router.post("/save_update_owner", function (req, res) {

  const d = req.body;
  const id = d.id;

  if (!req.files || !req.files.image) {

    const sql = "UPDATE owner SET owner_name = ?, owner_discription = ? WHERE id = ?";

    exe(sql, [d.owner_name, d.owner_discription, id], function (err) {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }
      res.redirect("/admin/about/view_owner");
    });

  } else {

   
    const imageFile = req.files.image;

    const ext = path.extname(imageFile.name);
    const baseName = path.basename(imageFile.name, ext);
    const newFileName = baseName + "_" + Date.now() + ext;

    const uploadPath = path.join(__dirname, "../public/uploads/", newFileName);

    imageFile.mv(uploadPath, function (err) {
      if (err) {
        console.log(err);
        return res.send("Image Upload Failed");
      }
      const selectSql = "SELECT image FROM owner WHERE id = ?";
      exe(selectSql, [id], function (err, result) {

        if (!err && result.length > 0) {
          const oldImage = result[0].image;
          const oldPath = path.join(__dirname, "../public/uploads/", oldImage);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        const updateSql =
          "UPDATE owner SET image = ?, owner_name = ?, owner_discription = ? WHERE id = ?";
        exe(updateSql, [newFileName, d.owner_name, d.owner_discription, id], function (err) {
          if (err) {
            console.log(err);
            return res.send("Database Error");
          }
          res.redirect("/admin/about/view_owner");
        });
      });
    });
  }
});




module.exports = router;