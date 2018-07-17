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
//post leaves
router.post('/leaves',(req,res,next)=>{
    var db=pgp(cs)
    var usid=req.body.usrid;
    var from=req.body.fromdate;
    var to=req.body.todate;
    var stat=req.body.sta;
db.any('select * from fn_add_leaves($1,$2,$3,$4)',[usid,from,to,stat]).then(()=>{
        res.send("Inserted Successfully")
    })
    pgp.end();  
})
//put using userid

router.put('/leaves/:usrid',(req,res,next)=>{
    var db=pgp(cs)
    usid=req.params.usrid;
    stat=req.body.sta;
db.any('select * from fn_updbyuserid_leaves($1,$2)',[usid,stat]).then(()=>{
        res.send("Updated Successfully")
    })
    pgp.end();
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

//to get studentachievements details by using branch id:
router.get('/ach/branch/:achbrnid', (req, res, next) => {
    var db = pgp(cs);
    var i = (req.params.achbrnid);
    console.log(i)
    db.any('select * from get_stdid_achstdid($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})

// to insert new achievements details
router.post('/', (req, res, next) => {
    var db = pgp(cs);

    var std = req.body.achvstdid;
    var dec = req.body.achvdescription;
    var rem = req.body.achvremarks;

    db.none("  select * from fn_add_achievements($1,$2,$3)", [std, dec, rem])
        .then(() => {
            res.send({ "message": "insert is  sucessssssssssssss::" });
        })
    pgp.end();
})
/*********************************************************************************************** */
/***************************************TEAM3-START********************************************** */
//GALLERY
//------------------------------------------------------------------------------------------------
//get galleryinfo by galleryid
router.get('/gallery/:gid', (req, res, next) => {
    var db = pgp(cs);
    var i= req.params.gid;
    console.log(i);
    console.log('displaying...................');
    db.any('select * from  fn_Get_Gallery_bygid($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
})
//get galleryinfo by schoolid
router.get('/gallery/school/:schid', (req, res, next) => {
    var db = pgp(cs);
    var i= req.params.schid;
    console.log(i);
    console.log('displaying...................');
    db.any('select * from  fn_Get_Gallery_byschld($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
})
//get galleryinfo by branchid
router.get('/gallery/branch/:brnid', (req, res, next) => {
    var db = pgp(cs);
    var i= req.params.brnid;
    console.log(i);
    console.log('displaying...................');
    db.any('select * from  fn_Get_Gallery_bybrnid($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
})
//adding gallery details
router.post('/gallery', (req, res, next) => {
    var db = pgp(cs);
    var si = req.body.a_schld;
    var brid = req.body.a_brnid;
    var gi = req.body.a_gimage;
    var gid = req.body.a_gimagdesc;
    var gd = req.body.a_gimgdate;

   
    db.any('select * from fn_Add_GalleryInfo($1,$2,$3,$4,$5)',[si,brid,gi,gid,gd]).then(()=> {
        console.log('Record Inserted ...')
        res.status(200).send({ message: "Inserted Success.." });
    })
    pgp.end();
}) 
//update gallery by galleryid
router.put('/gallery/:gid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.gid;
    var gimage = req.body.a_gimage;
    var gimgdesc = req.body.a_gimagdesc;
    var gimgdte = req.body.a_gimgdate;
  

    db.any('select * from fn_Upd_Galleryinfo_bygid($1,$2,$3,$4)', [i,gimage,gimgdesc,gimgdte]).then(()=>{
        console.log('Record Updated Success ...')
        res.status(200).send({ message: "Updated Succes.." })
    })
    pgp.end();
})
//update galleryinfo by schoolid
 router.put('/gallery/school/:schid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.schid;
    var gimage = req.body.a_gimage;
    var gimgdesc = req.body.a_gimagdesc;
    var gimgdte = req.body.a_gimgdate;
  

    db.any('select * from fn_Upd_Galleryinfo_byschld($1,$2,$3,$4)', [i,gimage,gimgdesc,gimgdte]).then(()=>{
        console.log('Record Updated Success ...')
        res.status(200).send({ message: "Updated Succes.." })
    })
    pgp.end();
})
//update galleryinfo by branchid
router.put('/gallery/branch/:brnchid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.brnchid;
    var gimage = req.body.a_gimage;
    var gimgdesc = req.body.a_gimagdesc;
    var gimgdte = req.body.a_gimgdate;
  

    db.any('select * from fn_Upd_Galleryinfo_bybrnid($1,$2,$3,$4)', [i,gimage,gimgdesc,gimgdte]).then(()=>{
        console.log('Record Updated Success ...')
        res.status(200).send({ message: "Updated Succes.." })
    })
    pgp.end();
})
//*******************************************TEAM3-END********************************************* */

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

//add student feedback
router.post('/studfeedback', (req, res, next) => {
    var db = pgp(cs);
    a = req.body.stdid;
    b = req.body.fdbkdesp;
    c = req.body.rate;
    
    db.none('select * from fn_add_studentfeedback($1,$2,$3)', [a, b, c]).then(() => {
        res.send('record Inserted Successfully...' )
    })
    pgp.end();
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
//get studentmarks by class id...
router.get('/studmarks/class/:clasid', (req, res, next) => {
    var db = pgp(cs);
    var i= req.params.clasid;
    console.log(i);
    console.log('displaying...................');
    db.any('select * from fn_Get_studentmarksbyclass($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end(); 

})
//get studentmarks by section id ....
router.get('/studmarks/section/:sctid', (req, res, next) => {
    var db = pgp(cs);
    var i= req.params.sctid;
    console.log(i);
    console.log('displaying...................');
    db.any('select * from fn_Get_studentmarksbysection($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end(); 
    
})


//add  studentmarks...
router.post('/studmarks', (req, res, next) => {
    var db = pgp(cs);
    var st = req.body.stdid;
    var exmtpe = req.body.exmtype;
    var sub1 = req.body.sub1score;
    var sub2 = req.body.sub2score;
    var sub3 = req.body.sub3score;
    var sub4 = req.body.sub4score;
    var sub5 = req.body.sub5score;
    var sub6 = req.body.sub6score;
    var sub7 = req.body.sub7score;
    db.any('select * from fn_add_studentmarks($1,$2,$3,$4,$5,$6,$7,$8,$9)',[st,exmtpe,sub1,sub2,sub3,sub4,sub5,sub6,sub7]).then(()=> {
        console.log('Record Inserted ...')
        res.status(200).send({ message: "Inserted Success.." });
    })
    pgp.end(); 
})
//update studentmarks by student id
router.put('/studmarks/:studentid', (req, res, next) => {
    var db = pgp(cs);
    var st = req.params.studentid;
    var exmtpe = req.body.exmtype;
    var sub1 = req.body.sub1score;
    var sub2 = req.body.sub2score;
    var sub3 = req.body.sub3score;
    var sub4 = req.body.sub4score;
    var sub5 = req.body.sub5score;
    var sub6 = req.body.sub6score;
    var sub7 = req.body.sub7score;
    db.any(' select * from fn_update_studentmarks($1,$2,$3,$4,$5,$6,$7,$8,$9)', [st,exmtpe,sub1,sub2,sub3,sub4,sub5,sub6,sub7]).then(()=>{
        console.log('Record Updated Success ...')
        res.status(200).send({ message: "Updated Succes.." })
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

//getting salary details by faculty id
router.get('/salary/faculty/:fclty', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.fclty;
    db.any('select * from  fn_Get_salary_infobyfacid($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end()
})

/******************************************** TEAM4 END********************************************** */

module.exports = router ;