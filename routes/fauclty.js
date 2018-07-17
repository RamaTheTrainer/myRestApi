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

module.exports = router ;