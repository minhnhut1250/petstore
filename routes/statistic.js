var express = require('express');
var router = express.Router();

var Cart = require('../model/Cart.js');
var Cate = require('../model/Cate.js');
var Product = require('../model/Product');

router.get('/', checkAdmin, function (req, res) {
	res.redirect('/admin/san-pham/qly-san-pham')
});

// router.get('/thongketop10', checkAdmin, function(req, res) {
//     res.render("admin/main/index", {
//       user: req.user,
//   });
// });

// router.post('/admin/top10', isAdminLoggedin, function(req, res) {
//   var type =req.body.type;
//   chitiethoadon.chitiethoadonGroup(function(result) {
//     result.sort((a, b) => b.tongso - a.tongso);
//     var kq;
//     if(type=="all"){
//       kq = result;
//     } else{
//       kq = result.filter(x => x._id.loaisp === type);
//     }
//     res.render("manage", {
//       user: req.user,
//       top10Product: kq,
//       n: kq.length<=10 ? kq.length : 10,
//       body: "staff/top10.ejs",
//     });
//   });
// });

// router.get('/admin/top10Type', isAdminLoggedin, function(req, res) {
//   chitiethoadon.chitiethoadonGroupType(function(result) {
//     result.sort((a, b) => b.tongso - a.tongso);
//     res.render("manage", {
//       user: req.user,
//       top10Type: result,
//       n: result.length<=10 ? result.length : 10,
//       body: "staff/top10Type.ejs",
//     });
//   });
// });

// var doanhthuTheoNam;
// router.get('/admin/chart', isAdminLoggedin, function(req, res) {
//   thongke.TongDoanhThu(function(result) {
//     tongdoanhthu = result
//   });
//   thongke.DoanhThuThangInYear(2018, function(result) {
//     doanhthuTheoNam = result;
//   })
//   setTimeout(function() {
//     res.render("staff/chart", {
//       tongdoanhthu: tongdoanhthu,
//       doanhthuTheoNam: doanhthuTheoNam,
//       user: req.user
//     })
//   }, 3000);

// });

function thongKe(danhsach, type) {
  var count = 0;
  var temp = danhsach.filter(x => x.item.type === type);
  for (var j = 0; j < temp.length; j++) {
    count = temp[j].quantity;
  }
  return count
}

function TongDoanhThu(callback) {
  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("3dwebsite");
    dbo.collection("hoadon").find().toArray(function(err, result) {
      if (err) {
        throw err;
        console.log(err);
      } else if (result.length > 0) {
        var tongket = {
          giadung: 0,
          fashion: 0,
          mebe: 0,
          thucung: 0,
          xe: 0,
          dientu: 0,
        }
        for (var i = 0; i < result.length; i++) {
          var danhsach = result[i].danhsachsanpham;
          tongket["giadung"] += parseInt(thongKe(danhsach, "giadung"));
          tongket["fashion"] += parseInt(thongKe(danhsach, "fashion"));

          tongket["thucung"] += parseInt(thongKe(danhsach, "thucung"));
          tongket["xe"] += parseInt(thongKe(danhsach, "xe"));

          tongket["dientu"] += parseInt(thongKe(danhsach, "dientu"));
          tongket["mebe"] += parseInt(thongKe(danhsach, "mebe"));
        }
        var sum = 0;
        for (var each in tongket) {
          sum += tongket[each]
        }
        var result = {
          tongSP: sum,
          tongket: tongket
        }
        callback(result);
      }
    });
    db.close();
  });
}

router.get('/admin/thongke', checkAdmin, function(req, res) {
  thongke.TongDoanhThu(function(result) {
    res.render("manage", {
      tongdoanhthu: result,
      user: req.user,
      body: "staff/thongke.ejs",
    });
  });
});

router.post('/admin/thongkedoanhso', checkAdmin, function(req, res) {
  var type = req.body.loai;
  var ngay = req.body.bday;
  var thang = req.body.bmonth;
  var nam = req.body.byear;
  console.log(type+" "+ngay+" "+thang+" "+nam);
  if(type=="none")
  {
    thongke.TongDoanhThu(function(result) {
      res.render("manage", {
        tongdoanhthu: result,
        user: req.user,
        body: "staff/thongke.ejs",
      });
    });
  }
  else if(type=="ngay")
  {
    thongke.thongKeTheoNgay(ngay,function(result) {
      console.log(result);
      res.render("manage", {
        tongdoanhthu: result,
        user: req.user,
        body: "staff/thongkedoanhso.ejs",
      });
    });
  }
  else if(type=="thang")
  {
    thongke.thongKeTheoThang(thang,function(result) {
      console.log(result);
      res.render("manage", {
        tongdoanhthu: result,
        user: req.user,
        body: "staff/thongkedoanhso.ejs",
      });
    });
  }
  else if(type=="nam")
  {
    thongke.thongKeTheoNam(nam,function(result) {
      console.log(result);
      res.render("manage", {
        tongdoanhthu: result,
        user: req.user,
        body: "staff/thongkedoanhso.ejs",
      });
    });
  }
});

router.post('/getUser', checkAdmin, function (req, res) {
	res.json(req.user);
});


function checkAdmin(req, res, next) {

	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/admin');
	}
}

module.exports = router;
