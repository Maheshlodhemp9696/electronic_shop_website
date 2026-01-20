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

router.get("/", (req, res) => {
  res.render("admin/home.ejs");
});
router.get("/add_slider",function(req,res){
    res.render("home/add_slider.ejs");
});
router.post("/save_slider", function (req, res) {

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

    const sql = "INSERT INTO slider(image) VALUES (?)";

    exe(sql, [newFileName], function (err, result) {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }   
res.redirect("/admin/home/add_slider");
    });

  });
});

router.get("/view_slider", function (req, res) {

  const sql = "SELECT * FROM slider ORDER BY id DESC";

  exe(sql, function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    res.render("home/view_slider.ejs", { "sliders": result });
  });

});

router.get("/delete_slider/:id", function (req, res) {
  const id = req.params.id;
  const selectSql = "SELECT image FROM slider WHERE id = ?";

  exe(selectSql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    if (result.length === 0) {
      return res.send("Record not found");
    }
    const imageName = result[0].image;
    const imagePath = path.join(__dirname, "../public/uploads/", imageName);
    const deleteSql = "DELETE FROM slider WHERE id = ?";
    exe(deleteSql, [id], function (err) {
      if (err) {
        console.log(err);
        return res.send("Delete Error");
      }
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      res.redirect("/admin/home/view_slider");
    });
  });
});

router.get("/update_slider/:id", function(req, res) {

  const id = req.params.id;

  const sql = "SELECT * FROM slider WHERE id = ?";

  exe(sql, [id], function(err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    res.render("home/update_slider.ejs", {"slider": result[0]  });
  });
});



router.post("/save_update_image", function (req, res) {

  const id = req.body.id;

 
  if (!req.files || !req.files.image) {
    return res.redirect("/admin/home/view_slider");
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

    
    const selectSql = "SELECT image FROM slider WHERE id = ?";
    exe(selectSql, [id], function (err, result) {

      if (!err && result.length > 0) {
        const oldImage = result[0].image;
        const oldPath = path.join(__dirname, "../public/uploads/", oldImage);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

    
      const updateSql = "UPDATE slider SET image = ? WHERE id = ?";
      exe(updateSql, [newFileName, id], function (err) {
        if (err) {
          console.log(err);
          return res.send("Database Error");
        }
        res.redirect("/admin/home/view_slider");
      });
    });
  });
});


router.get("/add_about",(req,res)=>{
  res.render("home/add_about.ejs")
});

router.post("/save_about",(req,res)=>{
  if (!req.files || !req.files.image) {
    return res.send("No file uploaded");
  }
  const imageFile = req.files.image;
  const d = req.body;
  const ext = path.extname(imageFile.name);                
  const baseName = path.basename(imageFile.name, ext);    
  const newFileName = baseName + "_" + Date.now() + ext;  

const uploadPath = path.join(__dirname, "../public/uploads/", newFileName);
  imageFile.mv(uploadPath, function (err) {
    if (err) {
      console.log(err);
      return res.send("Image Upload Failed");
    }
    const sql = "INSERT INTO home_about(heading,text,image) VALUES (?,?,?)";

    exe(sql, [d.heading,d.text,newFileName], function (err, result) {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }
     res.redirect("/admin/home/add_about");

    });
  });
});

router.get("/view_about", function (req, res) {
const sql = "SELECT * FROM home_about ORDER BY id DESC";

  exe(sql, function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    res.render("home/view_about.ejs", { "about": result });
  });
});

router.get("/delete_about/:id", function (req, res) {
  const id = req.params.id;
  const selectSql = "SELECT image FROM home_about WHERE id = ?";
  exe(selectSql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    if (result.length === 0) {
      return res.send("Record not found");
    }
    const imageName = result[0].image;
    const imagePath = path.join(__dirname, "../public/uploads/", imageName);
    const deleteSql = "DELETE FROM home_about WHERE id = ?";

    exe(deleteSql, [id], function (err) {
      if (err) {
        console.log(err);
        return res.send("Delete Error");
      }
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      res.redirect("/admin/home/view_about");
    });
  });
});

router.get("/update_about/:id", function (req, res) {
  const id = req.params.id;

  const sql = "SELECT * FROM home_about WHERE id = ?";

  exe(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    if (result.length === 0) {
      return res.send("Record not found");
    }

    res.render("home/update_about.ejs", { about: result[0]
    });
  });
});



router.post("/save_update_about", function (req, res) {

  const d = req.body;
  const id = d.id;

  if (!req.files || !req.files.image) {

    const sql = "UPDATE home_about SET heading = ?, text = ? WHERE id = ?";

    exe(sql, [d.heading, d.text, id], function (err) {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }
      res.redirect("/admin/home/view_about");
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

     
      const selectSql = "SELECT image FROM home_about WHERE id = ?";
      exe(selectSql, [id], function (err, result) {

        if (!err && result.length > 0) {
          const oldImage = result[0].image;
          const oldPath = path.join(__dirname, "../public/uploads/", oldImage);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

      
        const updateSql =
          "UPDATE home_about SET heading = ?, text = ?, image = ? WHERE id = ?";

        exe(updateSql, [d.heading, d.text, newFileName, id], function (err) {
          if (err) {
            console.log(err);
            return res.send("Database Error");
          }
          res.redirect("/admin/home/view_about");
        });
      });
    });
  }
});


router.get("/add_categories",function(req,res){
  res.render("home/add_categories.ejs");
});

router.post("/save_categories",(req,res)=>{
  if (!req.files || !req.files.image) {
    return res.send("No file uploaded");
  }
  const imageFile = req.files.image;
  const d = req.body;
  const ext = path.extname(imageFile.name);                
  const baseName = path.basename(imageFile.name, ext);    
  const newFileName = baseName + "_" + Date.now() + ext;  

const uploadPath = path.join(__dirname, "../public/uploads/", newFileName);
  imageFile.mv(uploadPath, function (err) {
    if (err) {
      console.log(err);
      return res.send("Image Upload Failed");
    }
    const sql = "INSERT INTO categories(image,categories) VALUES (?,?)";

    exe(sql, [newFileName,d.categories], function (err, result) {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }
     
     res.redirect("/admin/home/add_categories");
    });
  });
});

router.get("/view_categories", function (req, res) {
const sql = "SELECT * FROM categories ORDER BY id DESC";

  exe(sql, function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    res.render("home/view_categories.ejs", { "categories": result });
  });
});

router.get("/delete_categories/:id", function (req, res) {
  const id = req.params.id;
  const selectSql = "SELECT image FROM categories WHERE id = ?";
  exe(selectSql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    if (result.length === 0) {
      return res.send("Record not found");
    }
    const imageName = result[0].image;
    const imagePath = path.join(__dirname, "../public/uploads/", imageName);
    const deleteSql = "DELETE FROM categories WHERE id = ?";

    exe(deleteSql, [id], function (err) {
      if (err) {
        console.log(err);
        return res.send("Delete Error");
      }
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      res.redirect("/admin/home/view_categories");
    });
  });
});

router.get("/update_categories/:id", function (req, res) {
  const id = req.params.id;

  const sql = "SELECT * FROM categories WHERE id = ?";

  exe(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    if (result.length === 0) {
      return res.send("Record not found");
    }

    res.render("home/update_categories.ejs", { categories: result[0]
    });
  });
});



router.post("/save_update_categories", function (req, res) {

  const d = req.body;
  const id = d.id;

  if (!req.files || !req.files.image) {

    const sql = "UPDATE categories SET categories  WHERE id = ?";

    exe(sql, [d.heading, d.text, id], function (err) {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }
      res.redirect("/admin/home/view_categories");
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
      const selectSql = "SELECT image FROM categories WHERE id = ?";
      exe(selectSql, [id], function (err, result) {

        if (!err && result.length > 0) {
          const oldImage = result[0].image;
          const oldPath = path.join(__dirname, "../public/uploads/", oldImage);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        const updateSql =
          "UPDATE categories SET  image = ?,categories = ? WHERE id = ?";
        exe(updateSql, [newFileName,d.categories,id], function (err) {
          if (err) {
            console.log(err);
            return res.send("Database Error");
          }
          res.redirect("/admin/home/view_categories");
        });
      });
    });
  }
});


router.get("/add_top_selling",function(req,res){
  res.render("home/add_top_selling.ejs");
});

router.post("/save_top_selling",(req,res)=>{
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
    const sql = "INSERT INTO top_selling(image) VALUES (?)";

    exe(sql, [newFileName], function (err, result) {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }
      // res.send("saved")
     res.redirect("/admin/home/add_top_selling");
    });
  });
});

router.get("/view_top_selling", function (req, res) {
const sql = "SELECT * FROM top_selling ORDER BY id DESC";

  exe(sql, function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    res.render("home/view_top_selling.ejs", { "top_selling": result });
  });
});



router.get("/delete_top_selling/:id", function (req, res) {
  const id = req.params.id;
  const selectSql = "SELECT image FROM top_selling WHERE id = ?";

  exe(selectSql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    if (result.length === 0) {
      return res.send("Record not found");
    }
    const imageName = result[0].image;
    const imagePath = path.join(__dirname, "../public/uploads/", imageName);
    const deleteSql = "DELETE FROM top_selling WHERE id = ?";
    exe(deleteSql, [id], function (err) {
      if (err) {
        console.log(err);
        return res.send("Delete Error");
      }
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      res.redirect("/admin/home/view_top_selling");
    });
  });
});

router.get("/update_top_selling/:id", function(req, res) {

  const id = req.params.id;

  const sql = "SELECT * FROM top_selling WHERE id = ?";

  exe(sql, [id], function(err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    res.render("home/update_top_selling.ejs", {"top_selling": result[0]  });
  });
});

router.post("/save_update_top_selling", function (req, res) {

  const id = req.body.id;

 
  if (!req.files || !req.files.image) {
    return res.redirect("/admin/home/view_top_selling");
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
    const selectSql = "SELECT image FROM top_selling WHERE id = ?";
    exe(selectSql, [id], function (err, result) {

      if (!err && result.length > 0) {
        const oldImage = result[0].image;
        const oldPath = path.join(__dirname, "../public/uploads/", oldImage);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const updateSql = "UPDATE top_selling SET image = ? WHERE id = ?";
      exe(updateSql, [newFileName, id], function (err) {
        if (err) {
          console.log(err);
          return res.send("Database Error");
        }
        res.redirect("/admin/home/view_top_selling");
      });
    });
  });
});




router.get("/add_products",function(req,res){
  res.render("home/add_products.ejs");
});

router.post("/save_products",(req,res)=>{
  if (!req.files || !req.files.image) {
    return res.send("No file uploaded");
  }
  const imageFile = req.files.image;
  const d = req.body;
  const ext = path.extname(imageFile.name);                
  const baseName = path.basename(imageFile.name, ext);    
  const newFileName = baseName + "_" + Date.now() + ext;  

const uploadPath = path.join(__dirname, "../public/uploads/", newFileName);
  imageFile.mv(uploadPath, function (err) {
    if (err) {
      console.log(err);
      return res.send("Image Upload Failed");
    }
    const sql = "INSERT INTO products(image,product_type,model_name,price) VALUES (?,?,?,?)";

    exe(sql, [newFileName,d.product_type,d.model_name,d.price], function (err, result) {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }
     
     res.redirect("/admin/home/add_products");
    });
  });
});

router.get("/view_products", function (req, res) {
const sql = "SELECT * FROM products ORDER BY id DESC";

  exe(sql, function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    res.render("home/view_products.ejs", { "products": result });
  });
});

router.get("/delete_products/:id", function (req, res) {
  const id = req.params.id;
  const selectSql = "SELECT image FROM products WHERE id = ?";
  exe(selectSql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    if (result.length === 0) {
      return res.send("Record not found");
    }
    const imageName = result[0].image;
    const imagePath = path.join(__dirname, "../public/uploads/", imageName);
    const deleteSql = "DELETE FROM products WHERE id = ?";
   exe(deleteSql, [id], function (err) {
      if (err) {
        console.log(err);
        return res.send("Delete Error");
      }
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      res.redirect("/admin/home/view_products");
    });
  });
});

router.get("/update_products/:id", function (req, res) {
  const id = req.params.id;

  const sql = "SELECT * FROM products WHERE id = ?";

  exe(sql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    if (result.length === 0) {
      return res.send("Record not found");
    }

    res.render("home/update_products.ejs", { products: result[0]
    });
  });
});

router.post("/save_update_products", function (req, res) {

  const d = req.body;
  const id = d.id;

  if (!req.files || !req.files.image) {

    const sql = "UPDATE products SET categories  WHERE id = ?";

    exe(sql, [d.product_type,d.model_name, d.price, id], function (err) {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }
      res.redirect("/admin/home/view_categories");
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
      const selectSql = "SELECT image FROM categories WHERE id = ?";
      exe(selectSql, [id], function (err, result) {

        if (!err && result.length > 0) {
          const oldImage = result[0].image;
          const oldPath = path.join(__dirname, "../public/uploads/", oldImage);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        const updateSql =
          "UPDATE products SET  image = ?,product_type =?, model_name =?,price  =? WHERE id = ?";
        exe(updateSql, [newFileName,d.product_type,d.model_name, d.price,id], function (err) {
          if (err) {
            console.log(err);
            return res.send("Database Error");
          }
          res.redirect("/admin/home/view_products");
        });
      });
    });
  }
});




router.get("/add_brands",function(req,res){
  res.render("home/add_brands.ejs");
});

router.post("/save_brands",(req,res)=>{
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
    const sql = "INSERT INTO brands(image) VALUES (?)";

    exe(sql, [newFileName], function (err, result) {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }
      // res.send("saved")
     res.redirect("/admin/home/add_brands");
    });
  });
});

router.get("/view_brands", function (req, res) {
const sql = "SELECT * FROM brands ORDER BY id DESC";

  exe(sql, function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    res.render("home/view_brands.ejs", { "brands": result });
  });
});



router.get("/delete_brands/:id", function (req, res) {
  const id = req.params.id;
  const selectSql = "SELECT image FROM brands WHERE id = ?";

  exe(selectSql, [id], function (err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    if (result.length === 0) {
      return res.send("Record not found");
    }
    const imageName = result[0].image;
    const imagePath = path.join(__dirname, "../public/uploads/", imageName);
    const deleteSql = "DELETE FROM brands WHERE id = ?";
    exe(deleteSql, [id], function (err) {
      if (err) {
        console.log(err);
        return res.send("Delete Error");
      }
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      res.redirect("/admin/home/view_brands");
    });
  });
});

router.get("/update_brands/:id", function(req, res) {

  const id = req.params.id;

  const sql = "SELECT * FROM brands WHERE id = ?";

  exe(sql, [id], function(err, result) {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }
    res.render("home/update_brands.ejs", {"brands": result[0]  });
  });
});

router.post("/save_update_brands", function (req, res) {

  const id = req.body.id;

 
  if (!req.files || !req.files.image) {
    return res.redirect("/admin/home/view_brands");
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
    const selectSql = "SELECT image FROM brands WHERE id = ?";
    exe(selectSql, [id], function (err, result) {

      if (!err && result.length > 0) {
        const oldImage = result[0].image;
        const oldPath = path.join(__dirname, "../public/uploads/", oldImage);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const updateSql = "UPDATE brands SET image = ? WHERE id = ?";
      exe(updateSql, [newFileName, id], function (err) {
        if (err) {
          console.log(err);
          return res.send("Database Error");
        }
        res.redirect("/admin/home/view_brands");
      });
    });
  });
});

module.exports = router;