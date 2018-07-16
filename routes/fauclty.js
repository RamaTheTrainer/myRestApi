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



module.exports = router ;