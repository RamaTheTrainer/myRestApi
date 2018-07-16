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