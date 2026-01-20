const express = require("express");
var exe = require('../db.js')
var app = express();
app.use(express.urlencoded({ extended: true }));
const router = express.Router();



router.get("/",async (req, res) => {
    var sql1 = `select * from slider`;
    var slider = await  exe(sql1,[]);
    var sql2 = `select * from home_about`;
    var about= await  exe(sql2,[]);
    var sql3 = `select * from categories`;
    var categories = await exe(sql3,[]);
    var sql4 = `select * from top_selling`;
    var top_selling = await exe(sql4,[]); 
     var sql5 = `select * from products`;
    var products = await exe(sql5,[]); 
     var sql6 = `select * from brands`;
    var  brands= await exe(sql6,[]); 

     var packet = {slider,about,categories,top_selling,products,brands};
    res.render("user/home.ejs",packet);
});
router.get("/about",async function(req,res){
     var sql1 = `select * from home_about`;
    var  about= await exe(sql1,[]); 
    var sql2 = `select * from services`;
    var  services= await exe(sql2,[]); 
    var sql3 = `select * from owner`;
    var  owner= await exe(sql3,[]); 
     var packet = {about,services,owner};
    res.render("user/about.ejs",packet);
})

router.get("/products",async function(req,res){

    var sql1 = `select * from mobile`;
    var mobiles = await exe(sql1,[]);
    var sql2 = `select * from refreigerator`;
    var refrigerators = await exe(sql2,[]);
    var sql3 = `select * from washing_machines`;
    var washing_machines = await exe(sql3,[]);
    var sql4 = `select * from ear_phones`;
    var earphones = await exe(sql4,[]);
    res.render("user/products.ejs",{mobiles,refrigerators,washing_machines,earphones});
})

router.get("/gallery",async function(req,res){
    var sql1 = `select * from gallery`;
    var gallery = await exe(sql1,[]);
    res.render("user/gallery.ejs",{gallery});
});
router.get("/contact",function(req,res){
    res.render("user/contact.ejs")
});

router.get("/offer",async function(req,res){
    var sql1 = `select * from offers`;
    var offers = await exe(sql1,[]);
    var sql2 = `select * from sales`;
    var sales = await exe(sql2,[]);
    res.render("user/offer.ejs",{offers,sales});
});



// router.post("/save_enquiry", function (req, res) {
//     const d = req.body;

//     const sql = `
//         INSERT INTO inquiry 
//         (name, mobile, email, city, category, brand, model, purpose, budget)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     exe( sql, [d.name,   d.mobile, d.email, d.city, d.category, d.brand, d.model, d.purpose, d.budget ],
//     function (err, result) {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send("Database Error");
//             }
//              res.redirect("/contact");
//    });
// });

router.post("/save_enquiry", function (req, res) {
  const d = req.body;

  const checkSql = "SELECT id FROM inquiry WHERE email = ?";

  exe(checkSql, [d.email], function (err, rows) {
    if (err) {
      console.error(err);
      return res.redirect("/contact?status=error");
    }

    if (rows.length > 0) {
     
      return res.redirect("/contact?status=duplicate");
    }

    const insertSql = `
      INSERT INTO inquiry
      (name, mobile, email, city, category, brand, model, purpose, budget)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    exe(
      insertSql,
      [
        d.name,
        d.mobile,
        d.email,
        d.city,
        d.category,
        d.brand,
        d.model,
        d.purpose,
        d.budget
      ],
      function (err, result) {
        if (err) {
          console.error(err);
          return res.redirect("/contact?status=error");
        }

        // ✅ Success
        return res.redirect("/contact?status=success");
      }
    );
  });
});





module.exports = router;
