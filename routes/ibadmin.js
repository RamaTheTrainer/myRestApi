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
//Registering the school
router.post('/school', (req, res, next) => {

    nm = req.body.schname;
    ty = req.body.schtype;
    co = req.body.schcountry;
    st =req.body.schstate;
    ci =req.body.schcity;
    add=req.body.schaddrline;
    con1=req.body.schcontactnum1;
    con2=req.body.schcontactnum2;
    im =req.body.schimage;
    sta=req.body.schstatus;
    east=req.body.schestablishedyr;
    ema=req.body.schemail;
    admf=req.body.schadminfname;
    adml=req.body.schadminlname;
    reg =req.body.schregdate;


 
    db.any('select * from fn_school_getschid($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)', [nm, ty,co,st,ci,add,con1,con2,im,sta,east,ema,admf,adml,reg]).then(() => {
        res.send({ "message": "record Inserted Successfully..." })
    })
})
//Login with userid and password
router.get('/uidpwd', (req, res, next) => {
    var u=req.params.usrid;
    db.any('select * from  fn_users_get_usrpwdid($1)',[u]).then(function (data) {
        res.send(data);
    })
})

//All Schools Info
router.get('/school', (req, res) => {
    db.any('select * from fn_school_getall()').then((data) => {
        res.send(data);
    })
})



module.exports = router ;