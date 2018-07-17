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

//adding the leaves in leave master table
router.post('/leaves',(req,res,next)=>{
    var db=pgp(cs);
    var usid=req.body.usrid;
    var from=req.body.fromdate;
    var to=req.body.todate;

    db.any('select * from fn_add_leaves($1,$2,$3)',[usid,from,to]).then(()=>{
        res.send("Inserted Successfully")
    })
    pgp.end();
})
//Updating the users password
router.put('/users/:usrid', (req, res, next) => {
    var u = req.params.usrid;
    var p = req.body.usrpassword;
    db.any('select fn_users_update ($1,$2)', [u,p]).then(function () {
        res.status(200).send({
            message: "Updated succesfully..."
        });
    })
})
//to getby id achievements details
router.get('/ach/:achid', (req, res, next) => {
    var db = pgp(cs);

    var i = (req.params.achid);
    db.any('select * from fn_getbyid_achievements($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})


/****************************************TEAM3-START************************************************ */
//Class Subject master
//--------------------------------------------------------------------------------------------------
//get subjinfo by classid
router.get('/classsubject/class/:clsid', (req, res, next) => {
    
    var db = pgp(cs);
    var i = req.params.clsid
    console.log(i);
    db.any('select * from fn_GetSubj_byclassid($1)', i)
        .then((data) => {
            res.send(data);
        })
        pgp.end();
})
//get syllabus of a subject by subjid
router.get('/classsubject/subject/:subjidd', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.subjidd
    console.log(i);
    db.any('select * from fn_GetSubjsyllabus_bysubjid($1)', i)
        .then((data) => {
            res.send(data);
        })
        pgp.end();
})
/**********************************TEAM3-END*************************************************** */

/******************************************** TEAM4 START********************************************** */

// get examtimetable by school id
router.get('/extimetable/school/:exmsid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.exmsid
    db.any('select * from fn_get_examtimetablebyschool($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})

// get examtimetable by branch id
router.get('/extimetable/branch/:exmbid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.exmbid
    db.any('select * from fn_get_examtimetablebybranch($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})

// get examtimetable by class id
router.get('/extimetable/class/:exmcid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.exmcid
    db.any('select * from fn_get_examtimetablebyclass($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})

// retrieving holiday details by using branch id //

router.get('/holiday/branch/:hldybrnid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.hldybrnid;
    db.any('select * from fn_getbyhldybranchid_holiday($1)', [i]).then((data) => {
        res.send(data);
    })
    pgp.end()
}) 
// retrieving holiday details by using school id //

router.get('/holiday/school/:hldyshlid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.hldyshlid;
    db.any('select * from fn_getbyhldyschoolid_holiday($1)', [i]).then((data) => {
        res.send(data);
    })
    pgp.end()
}) 

//get studentmarks by studentid ......
router.get('/studmarks/student/:studentid', (req, res, next) => {
    var db = pgp(cs);
    var i= req.params.studentid;
    console.log(i);
    console.log('displaying...................');
    db.any('select * from fn_getbyid_studentmarks($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end(); 
})

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

// get student feedback by student id
router.get('/studfeedback/student/:stuid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.stuid
    db.any('select * from fn_get_studentfeedback($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})

//add facultyfeedback....
router.post('/facultyfeedback', (req, res, next) => {
    var db = pgp(cs);
    var i = req.body.uid;
    var fid = req.body.fctyid;
    var fbdsptn = req.body.fdbckdscrptn;
    var r = req.body.rtng;
    db.any('select * from fn_add_facultyfeedback($1,$2,$3,$4)',[i,fid,fbdsptn,r]).then(()=> {
        console.log('Record Inserted ...')
        res.status(200).send({ message: "Inserted Success.." });
    })
    pgp.end();
})


// retrieving feepayment details by using student id //
router.get('/feepayment/student/:stdid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.stdid;
    db.any('select * from fn_Get_feepaymentbyst($1)', i).then((data) => {
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



/******************************************** TEAM4 END********************************************** */

module.exports = router ;