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


//All Schools Info
router.get('/school', (req, res) => {
    db.any('select * from fn_school_getall()').then((data) => {
        res.send(data);
    })
})

module.exports = router ;