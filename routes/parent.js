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





/* team4 start*/
// retrieving schoolfeedback details by using schlid //
router.get('/schfeedback/school/:shlid', (req, res, next) => {
    var db = pgp(cs);

    var j = req.params.shlid;
    db.any('select * from fn_getbyschoolid_schoolfeedback($1)', [j]).then((data) => {
        res.send(data);
    })
    pgp.end()
})
/* team4 end*/

module.exports = router ;