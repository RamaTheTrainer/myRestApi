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

router.get('/schfeedback/school/:shlid', (req, res, next) => {
    var db = pgp(cs);

    var j = req.params.shlid;
    db.any('select * from fn_getbyschoolid_schoolfeedback($1)', [j]).then((data) => {
        res.send(data);
    })
    pgp.end()
})

module.exports = router;