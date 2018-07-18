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
/***************************Team @ 2 start**************************** */
/***************************Team @ 2 start**************************** */
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
router.get('/:uid/:pwd', (req, res, next) => {
    var u=req.params.usrid;
    db.any('select * from  fn_users_get_usrpwdid($1)',[u]).then(function (data) {
        res.send(data);
    })
})

/***************************Team @ 2 end**************************** */


//Getting particular school using school id
router.get('/school/:schid', (req, res, next) => {
    var i =req.params.schid;
    db.any('select * from fn_school_getbyid($1)', [i])
        .then((data) => {
            res.send(data);
        })
})
//Updating the school using school id
router.put('/school/:schid', (req, res, next) => {
    i = req.params.schid;
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

    db.none(
        'select * from fn_school_update($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)', [i,nm,ty,co,st,ci,add,con1,con2,im,sta,east,ema,admf,adml,reg]).then(() => {
            res.send({ "message": "Update success.." })
        })
})
/***************************Team @ 2 end**************************** */


module.exports = router ;