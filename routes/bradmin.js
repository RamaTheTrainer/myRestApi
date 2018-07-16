var express = require('express');
var bb = require('bluebird');
var bodyparser = require('body-parser');
var fs = require('fs')
var path = require('path')
var router = express.Router()

var options = {
    promiseLib: bb
}
router.use(express.static(path.resolve(__dirname, './public')));
router.use(bodyparser.urlencoded({ extended: true }));
router.use(bodyparser.json());

var pgp = require('pg-promise')(options)
var cs = 'postgres://postgres:root@192.168.0.238:5432/infobyt'

/**********************    team 4 16-07-2018 *************** */

// adding schoolfeedback details //

router.post('/schfeedback', (req, res, next) => {
    var db = pgp(cs);


    var si=req.body.shlid;
    var bi=req.body.brnid;
    var ui=req.body.user_id;
    var ff=req.body.feedback;
    var rr=req.body.schrating;

   db.any('select * from fn_add_schoolfeedback($1, $2, $3,$4,$5)', [si,bi,ui,ff,rr])
       .then(() => {
           res.send({ "message": "insert is  sucessssssssssssss::" });
       })
       pgp.end()
})


// retrieving schoolfeedback details by using brnid //

router.get('/schfeedback/branch/:brnid', (req, res, next) => {
    var db = pgp(cs);

    var i = req.params.brnid;
    db.any('select * from fn_getbybranchid_schoolfeedback($1)', [i]).then((data) => {
        res.send(data);
    })
    pgp.end()
}) 





//get fees by schoolid


router.get('/feeinfo/school/:fschid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.fschid;
    db.any('select  * from  fn_getfeesbyschid($1)',i).then((data) => {
        res.send(data)
    })
    pgp.end()
})
//get fees by branchid
router.get('/feeinfo/branch/:fbrnid', (req, res, next) => {
    var db = pgp(cs);
    var b =req.params.fbrnid
    db.any('select  * from    fn_getfeesbybrnid($1)',b).then((data) => {
        res.send(data)
    })
    pgp.end()
})
//get fees by classid
router.get('/feeinfo/class/:fclsid', (req, res, next) => {
    var db = pgp(cs);
    var a = req.params.fclsid;
    db.any('select  * from  fn_getfeesbyclsid($1)',a).then((data) => {
        res.send(data)
    })
    pgp.end()
})
// insert fees info

router.post('/feeinfo', (req, res, next) => {
    var db = pgp(cs);

    var si = req.body.fschid;
    var bi = req.body.fbrnid;
    var cc = req.body.fclsid;
    var aa = req.body.famnt;

    db.any('select * from fn_addfeesinfo($1,$2,$3,$4)', [si, bi, cc, aa])
        .then(() => {
            res.send({ "message": "insert is  sucessssssssssssss::" });
        })
        pgp.end()
})
// update fees structure by classid
router.put('/feeinfo/class/:fclsid', (req, res, next) => {
    var db = pgp(cs);
    
    
    
    var cc = req.body.fschid;
    var fi = req.body.fbrnid;
    var i = req.params.fclsid;
    var aa = req.body.famnt;
   
    db.any('select * from  fn_updatefees($1,$2,$3,$4)', [  cc,fi,i, aa]).then(() => {
        res.send({ "message": "update is sucesss" });
    })
    pgp.end()
})



//getting salary details by schoolid
router.get('/salary/school/:schid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.schid;
    db.any('select  * from fn_Get_salary_infobysch($1)', i).then((data) => {
        res.send(data)
    })
    pgp.end()
})

//getting salary details by branchid
router.get('salary/branch/:brnid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.brnid;
    db.any('select * from  fn_Get_salary_infobybrn($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end()
})

// inserting salary details
router.post('/salary', (req, res, next) => {
    var db = pgp(cs);

    var fi = req.body.salfid;
    var sali = req.body.salsal;
    var ss = req.body.salalw;
    var sd = req.body.saldedc;

    db.any('select * from fn_addsalary_info($1,$2,$3,$4)', [fi, sali, ss, sd])
        .then(() => {
            res.send({ "message": "insert is  sucessssssssssssss::" });
        })
    pgp.end()
})

//updating salary details by facultyid
router.put('/salary/faculty/:salfid', (req, res, next) => {
    var db = pgp(cs);

    var i = req.params.salfid;

    var fi = req.body.salsal;
    var cc = req.body.salalw;
    var aa = req.body.saldedc;

    db.any("select * from  fn_updsalaryinfo_byfacid($1,$2,$3,$4)", [i, fi, cc, aa]).then(() => {
        res.send({ "message": "update is sucesss" });
    })
    pgp.end()
})


//   for adding feepayment details //                           
router.post('/feepayment', (req, res, next) => {
    var db = pgp(cs);
    var ti=req.body.stdid;
    var pp=req.body.pa;
    var pi=req.body.pd;
    var rr=req.body.re;
db.any('select * from fn_add_feepayinfo($1, $2, $3,$4)', [ti,pp,pi,rr])
       .then(() => {
           res.send({ "message": "insert is  sucessssssssssssss::" });
       })
       pgp.end()
})
// updating feepayment details by using stdid //
router.put('/feepayment/:stdid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.stdid;
    var pp=req.body.pa;
    var pi=req.body.pd;
    var rr=req.body.re;
   
   
   
    db.none("select * from fn_feepaymentmaster_update($1,$2,$3,$4)", [i,pp,pi,rr]).then(() => {
        res.send({ "message": "update is sucesss" });
    })
    pgp.end()
})

// retrieving feepayment details by using stdid //
router.get('/feepayment/student/:stdid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.stdid;
    db.any('select * from fn_feepaymentmaster_selectbyid($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end()
})

// retrieving feepayment details by using brnid //
router.get('/feepayment/branch/:brnhid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.brnhid;
    db.any('select * from fn_Get_feepaymentbybrn($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end()
})

// retrieving feepayment details by using schlid //
router.get('/feepayment/school/:schlid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.schlid;
    db.any('select * from fn_Get_feepaymentbysch($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end()
})

// adding holiday details //
router.post('/holiday', (req, res, next) => {
    var db = pgp(cs);
    var si=req.body.hldyshlid;
    var bi=req.body.hldybrnid;
    var hd=req.body.hldydt;                                                                                                                                                                                                                                                                                                                                      
    var ho=req.body.hldyocc;

   db.none('select * from fn_add_holiday($1, $2, $3,$4)', [si,bi,hd,ho])
       .then(() => {
           res.send({ "message": "insert is  sucessssssssssssss::" });
       })
       pgp.end()
})

// updating holiday details by using hldyshlid //

router.put('/holiday/school/:hldyshlidid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.hldyshlidid;
   var hb=req.body.hldybrnid;
    var hh=req.body.hldydt;
    var ho=req.body.hldyocc;
    db.none("select * from fn_update_holiday($1,$2,$3,$4)", [i,hb,hh,ho]).then(() => {
        res.send({ "message": "update is sucesss" });
    })
    pgp.end()
})
// retrieving holiday details by using hldybrnid //

router.get('/holiday/branch/:hldybrnid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.hldybrnid;
    db.any('select * from fn_getbyhldybranchid_holiday($1)', [i]).then((data) => {
        res.send(data);
    })
    pgp.end()
}) 
// retrieving holiday details by using hldyshlid //

router.get('/holiday/school/:hldyshlid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.hldyshlid;
    db.any('select * from fn_getbyhldyschoolid_holiday($1)', [i]).then((data) => {
        res.send(data);
    })
    pgp.end()
})

/* *****************************team4 end***************************************************/
module.exports = router;