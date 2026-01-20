const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const router = express.Router();
router.use(fileUpload());
var exe = require('../db.js');
const bcrypt = require("bcryptjs");
const fs = require("fs");
router.use(express.static('public/'));

router.get("/",function(req,res){
    res.render("admin/offers.ejs")
});

router.get("/add_offers",function(req,res){
  res.render("offers/add_offers.ejs");
});

router.post("/save_offers",(req,res)=>{
  const d = req.body;   
 if (!req.files || !req.files.image) {
     return res.send("No file uploaded");
   }
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
       const sql = `
        INSERT INTO offers(image,discount,name,model,offer_price)
        VALUES (?, ?, ?, ?, ?)
      `;
      exe(sql, [newFileName, d.discount, d.name, d.model, d.offer_price], function (err, result) {
        if (err) {
          console.error(err);
          return res.status(500).send("Database Error");
        }
        res.redirect("/admin/offers/add_offers");
      });
    });
});

router.get("/view_offers", function (req, res) {
const sql = "SELECT * FROM offers ORDER BY id DESC";
    exe(sql, function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    res.render("offers/view_offers.ejs", { "offers": result });
    });
});

router.get("/delete_offers/:id", function (req, res) {
    const id = req.params.id;
    const sql = "DELETE FROM offers WHERE id = ?";
    exe(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    if (result.affectedRows === 0) {
        return res.send("No record found with the given ID");
    }   
    res.redirect("/admin/offers/view_offers");
    });
});

router.get("/update_offers/:id", function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM offers WHERE id = ?";
    exe(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    if (result.length === 0) {
        return res.send("No record found with the given ID");
    }
    res.render("offers/update_offers.ejs", { "offers": result[0] });
    });
});

router.post("/save_update_offers/:id", function (req, res) {
    const id = req.params.id;
    const d = req.body;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const image = req.files.image;
    const image_path = "uploads/" + image.name;
    image.mv(path.join(__dirname, '../public/', image_path), function(err) {
        if (err)
            return res.status(500).send(err);
        const sql = `
            UPDATE offers
            SET image = ?, discount = ?, name = ?, model = ?, offer_price = ?
            WHERE id = ?
        `;
        exe(sql, [image_path, d.discount, d.name, d.model, d.offer_price, id], function (err, result) {
            if (err) {
                console.error(err);
                return res.status(500).send("Database Error");
            }
            res.redirect("/admin/offers/view_offers");
        });
    });
});

router.get("/add_sales",function(req,res){
  res.render("offers/add_sales.ejs");
});

router.post("/save_add_sales",(req,res)=>{
  const d = req.body;  
    const sql = `insert into sales (discount, offer_product, offer_details, valid) values(?, ?, ?, ?)`;
        exe(sql, [d.discount, d.offer_product, d.offer_details, d.valid], function (err, result) {
        if (err) {
          console.error(err);
          return res.status(500).send("Database Error");
        }
        res.redirect("/admin/offers/add_sales");
        });
});
router.get("/view_sales", function (req, res) {
  const sql = "SELECT * FROM sales ORDER BY id DESC";

  exe(sql, function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    res.render("offers/view_sales.ejs", { sales: result });
  });
});

router.get("/delete_sales/:id", function (req, res) {
    const id = req.params.id;
    const sql = "DELETE FROM sales WHERE id = ?";
    exe(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    if (result.affectedRows === 0) {
        return res.send("No record found with the given ID");
    }
    res.redirect("/admin/offers/view_sales");
    });
});

router.get("/update_sales/:id", function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM sales WHERE id = ?";
    exe(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }   
    if (result.length === 0) {
        return res.send("No record found with the given ID");
    }
    res.render("offers/update_sales.ejs", { sales: result[0] });
    });
});

router.post("/save_update_sales/:id", function (req, res) {
  const d = req.body;
  const sql = `
    UPDATE sales
    SET discount = ?, offer_product = ?, offer_details = ?, valid = ?
    WHERE id = ?
  `;
  exe(sql, [d.discount, d.offer_product, d.offer_details, d.valid, d.id], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send("Database Error");
    }
    // res.send(d.valid);
    res.redirect("/admin/offers/view_sales");
  });
});

module.exports = router;