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
    res.render("admin/products.ejs")
})

router.get("/add_mobile",function(req,res){
  res.render("products/add_mobile.ejs");
});

router.post("/save_mobile",(req,res)=>{
  const d = req.body;
  const file = req.files.image;
    const imagePath = path.join(__dirname, '..', 'public', 'uploads', file.name);
    file.mv(imagePath, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("File Upload Error");
        }
    });
    const sql = "INSERT INTO mobile(mobile_name,mobile_model,price,image) VALUES (?,?,?,?)";
    exe(sql, [d.mobile_name,d.mobile_model,d.price,file.name], function (err, result) {
        if (err) {
        console.log(err);
        return res.send("Database Error");
        }
         res.redirect("/admin/products/add_mobile");
    });
    });
router.get("/view_mobile", function (req, res) {
const sql = "SELECT * FROM mobile ORDER BY id DESC";
    exe(sql, function (err, result) {
    if (err) {
        console.log(err);
        return res.send("Database Error");
    }
    res.render("products/view_mobile.ejs", { "mobiles": result });
    });
});
router.get("/delete_mobile/:id", function (req, res) {
    const id = req.params.id;
    const sql = "DELETE FROM mobile WHERE id = ?";
    exe(sql, [id], function (err, result) {
        if (err) {
        console.log(err);
        return res.send("Database Error");
        }
        res.redirect("/admin/products/view_mobile");
    });
});

router.get("/update_mobile/:id", function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM mobile WHERE id = ?";
    exe(sql, [id], function (err, result) {
        if (err) {
        console.log(err);
        return res.send("Database Error");
        }   
        res.render("products/update_mobile.ejs", { "mobile": result[0] });
    });
});
router.post("/save_update_mobile", function (req, res) {
    const d = req.body; 
    const id = d.id;
    if (!req.files || !req.files.image) {
        const sql = `
        UPDATE mobile 
        SET mobile_name = ?, mobile_model = ?, price = ?
        WHERE id = ?`;
        exe(sql, [d.mobile_name, d.mobile_model, d.price, id], function (err) {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        res.redirect("/admin/products/view_mobile");
        });
    } else {
        const file = req.files.image;
        const imagePath = path.join(__dirname, '..', 'public', 'uploads', file.name);
        file.mv(imagePath, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("File Upload Error");
            }
        });
        const sql = `
        UPDATE mobile 
        SET mobile_name = ?, mobile_model = ?, price = ?, image = ?
        WHERE id = ?`;
        exe(sql, [d.mobile_name, d.mobile_model, d.price, file.name, id], function (err) {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        res.redirect("/admin/products/view_mobile");
        });
    }
});

router.get("/add_refreigerator",function(req,res){
  res.render("products/add_refreigerator.ejs");
});

router.post("/save_refreigerator",(req,res)=>{
    const d = req.body;
    const file = req.files.image;
      const imagePath = path.join(__dirname, '..', 'public', 'uploads', file.name);
        file.mv(imagePath, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("File Upload Error");
            }
        });
        const sql = "INSERT INTO refreigerator(refreigerator_name,refreigerator_model,price,image) VALUES (?,?,?,?)";
        exe(sql, [d.refreigerator_name,d.refreigerator_model,d.price,file.name], function (err, result) {
            if (err) {
            console.log(err);
            return res.send("Database Error");
            }
                res.redirect("/admin/products/add_refreigerator");
        });
    });

    router.get("/view_refreigerator", function (req, res) {
    const sql = "SELECT * FROM refreigerator ORDER BY id DESC";
        exe(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        res.render("products/view_refreigerator.ejs", { "refrigerators": result });
        });
    });

    router.get("/delete_refreigerator/:id", function (req, res) {
        const id = req.params.id;
        const sql = "DELETE FROM refreigerator WHERE id = ?";
        exe(sql, [id], function (err, result) {
            if (err) {
            console.log(err);

            return res.send("Database Error");
            }
            res.redirect("/admin/products/view_refreigerator");
        });
    });
    router.get("/update_refreigerator/:id", function (req, res) {
        const id = req.params.id;
        const sql = "SELECT * FROM refreigerator WHERE id = ?";
        exe(sql, [id], function (err, result) {
            if (err) {
            console.log(err);
            return res.send("Database Error");
            }
            res.render("products/update_refreigerator.ejs", { "refrigerator": result[0] });
        });
    });
    
    router.post("/save_update_refreigerator", function (req, res) {
        const d = req.body; 
        const id = d.id;    
        if (!req.files || !req.files.image) {
            const sql = `
            UPDATE refreigerator 
            SET refreigerator_name = ?, refreigerator_model = ?, price = ?
            WHERE id = ?`;
            exe(sql, [d.refreigerator_name, d.refreigerator_model, d.price, id], function (err) {
            if (err) {
                console.log(err);
                return res.send("Database Error");
            }
            res.redirect("/admin/products/view_refreigerator");
            });
        } else {
            const file = req.files.image;
            const imagePath = path.join(__dirname, '..', 'public', 'uploads', file.name);
            file.mv(imagePath, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("File Upload Error");
                }
            });
            const sql = `
            UPDATE refreigerator 
            SET refreigerator_name = ?, refreigerator_model = ?, price = ?, image = ?
            WHERE id = ?`;
            exe(sql, [d.refreigerator_name, d.refreigerator_model, d.price, file.name, id], function (err) {
            if (err) {
                console.log(err);
                return res.send("Database Error");
            }
            res.redirect("/admin/products/view_refreigerator");
            }
            );
        }
    });

    router.get("/add_washing_machines",function(req,res){
      res.render("products/add_washing_machines.ejs");
    }); 

    // router.post("/save_washing_machines",(req,res)=>{
    //     const d = req.body;
    //     const file = req.files.image;
    //     const imagePath = path.join(__dirname, '..', 'public', 'uploads', file.name);
    //     file.mv(imagePath, (err) => {
    //         if (err) {
    //             console.log(err);
    //             return res.status(500).send("File Upload Error");
    //      }
    //     });
    //     const sql = "INSERT INTO washing_machines(brand,model,price,image) VALUES (?,?,?,?)";
    //     exe(sql, [d.brand,d.model ,d.price,file.name], function (err, result) {
    //             console.log(err);
    //             return res.send("Database Error");
    //         });
    //         res.redirect("/admin/products/add_washing_machines");
    //     });

router.post("/save_washing_machines", (req, res) => {
  const d = req.body;

  if (!req.files || !req.files.image) {
    return res.send("No image uploaded");
  }

  const file = req.files.image;
  const imagePath = path.join(__dirname, '..', 'public', 'uploads', file.name);

  file.mv(imagePath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("File Upload Error");
    }

    const sql = "INSERT INTO washing_machines (brand, model, price, image) VALUES (?, ?, ?, ?)";

    exe(sql, [d.brand, d.model, d.price, file.name], (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }

    
      return res.redirect("/admin/products/add_washing_machines");
    });

  });
});



    router.get("/view_washing_machines", function (req, res) {
    const sql = "SELECT * FROM washing_machines ORDER BY id DESC";
        exe(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }   
        res.render("products/view_washing_machines.ejs", { "washingMachines": result });
        });
    });

    router.get("/delete_washing_machines/:id", function (req, res) {
        const id = req.params.id;
        const sql = "DELETE FROM washing_machines WHERE id = ?";
        exe(sql, [id], function (err, result) {
            if (err) {
                console.log(err);
                return res.send("Database Error");
            }
            res.redirect("/admin/products/view_washing_machines");
        });
    });

    router.get("/update_washing_machines/:id", function (req, res) {
        const id = req.params.id;
        const sql = "SELECT * FROM washing_machines WHERE id = ?";
        exe(sql, [id], function (err, result) {
            if (err) {
                console.log(err);
                return res.send("Database Error");
            }
            res.render("products/update_washing_machines.ejs", { "washing_machine": result[0] });
        });
    });

    router.post("/save_update_washing_machines", function (req, res) {
        const d = req.body;
        const id = d.id;
        if (!req.files || !req.files.image) {
            const sql = `
            UPDATE washing_machines 
            SET brand = ?, model = ?, price = ?
            WHERE id = ?`;
            exe(sql, [d.brand, d.model, d.price, id], function (err) {
                if (err) {
                    console.log(err);
                    return res.send("Database Error");
                }
                res.redirect("/admin/products/view_washing_machines");
            });
        } else {
            const file = req.files.image;
            const imagePath = path.join(__dirname, '..', 'public', 'uploads', file.name);
            file.mv(imagePath, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("File Upload Error");
                }
            });
            const sql = `
            UPDATE washing_machines 
            SET brand = ?, model = ?, price = ?, image = ?
            WHERE id = ?`;
            exe(sql, [d.brand, d.model, d.price, file.name, id], function (err) {
                if (err) {
                    console.log(err);
                    return res.send("Database Error");
                }
                res.redirect("/admin/products/view_washing_machines");
            });
        }
    });

router.get("/add_earphones",function(req,res){
      res.render("products/add_earphones.ejs");
    });


router.post("/save_earphones", (req, res) => {
  const d = req.body;

  if (!req.files || !req.files.image) {
    return res.status(400).send("No Image Uploaded");
  }

  const file = req.files.image;
  const imagePath = path.join(__dirname, "..", "public", "uploads", file.name);
  file.mv(imagePath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("File Upload Error");
    }
    const sql = "INSERT INTO ear_phones (brand, model, price, image) VALUES (?, ?, ?, ?)";
    exe(sql, [d.brand, d.model, d.price, file.name], (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }
      return res.redirect("/admin/products/add_earphones");
    });
  });
});

router.get("/view_earphones", function (req, res) {
    const sql = "SELECT * FROM ear_phones ORDER BY id DESC";
    exe(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        res.render("products/view_earphones.ejs", { "earphones": result });
    });
});
router.get("/delete_earphones/:id", function (req, res) {
    const id = req.params.id;
    const sql = "DELETE FROM ear_phones WHERE id = ?";
    exe(sql, [id], function (err, result) {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        res.redirect("/admin/products/view_earphones");
    });
});
router.get("/update_earphones/:id", function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM ear_phones WHERE id = ?";
    exe(sql, [id], function (err, result) {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }
        res.render("products/update_earphones.ejs", { "earphone": result[0] });
    });
});

router.post("/save_update_earphones", function (req, res) {
    const d = req.body;
    const id = d.id;
    if (!req.files || !req.files.image) {
        const sql = `
        UPDATE ear_phones 
        SET brand = ?, model = ?, price = ?
        WHERE id = ?`;
        exe(sql, [d.brand, d.model, d.price, id], function (err) {
            if (err) {
                console.log(err);
                return res.send("Database Error");
            }
            res.redirect("/admin/products/view_earphones");
        });
    } else {
        const file = req.files.image;
        const imagePath = path.join(__dirname, '..', 'public', 'uploads', file.name);
        file.mv(imagePath, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("File Upload Error");
            }
        });
        const sql = `
        UPDATE ear_phones 
        SET brand = ?, model = ?, price = ?, image = ?
        WHERE id = ?`;
        exe(sql, [d.brand, d.model, d.price, file.name, id], function (err) {
            if (err) {
                console.log(err);
                return res.send("Database Error");
            }
            res.redirect("/admin/products/view_earphones");
        });
    }
});

module.exports = router;