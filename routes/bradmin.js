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
//getting particular school using school id

router.get('/school/:schid', (req, res, next) => {
    var i =req.params.schid;
    db.any('select * from fn_school_getbyid($1)', [i])
        .then((data) => {
            res.send(data);
        })
})
//getting particular userid from users table
router.get('/users/user/:usrid', (req, res, next) => {
    var t=req.params.usrid;
    db.any('select * from fn_users_getbyid($1)',[t]).then(function (data) {
        res.send(data);
    })
}) 

//get brnid in users by userbranchtable//
router.get('/users/branch/:brnid', (req, res, next) => {
    var t=req.params.brnid;
    db.any('select * from fn_Get_byuserbranchmaster($1)',[t]).then(function (data) {
        res.send(data);
    })
}) 


//get transport routes by branch id
router.get('/transroute/branch/:brnid', (req, res, next) => {
    var db = pgp(cs)
    bid = req.params.brnid;
    db.any('select * from fn_gettransportroutes_bybrnchid($1)', bid).then((data) => {
        res.send(data)
    })
    pgp.end();
})

/* get transport route details by route bus id */

router.get('/transroute/routebus/:rbusid', (req, res, next) => {
    var db = pgp(cs)
    bid = req.params.rbusid;
    db.any('select * from fn_gettransportroutes_byroutebusid($1)', bid).then((data) => {
        res.send(data)
    })
    pgp.end();
})

/* get transport route details By routeId */
router.get('/transroute/route/:rid', (req, res, next) => {
    var db = pgp(cs)
    bid = req.params.rid;
    db.any('select * from fn_gettransportroutes_byrouteid($1)', bid).then((data) => {
        res.send(data)
    })
    pgp.end();
})
//Adding the transport info
router.post('/transroute', (req, res, next) => {
    var db = pgp(cs);
    name = req.body.rname;
    from = req.body.rfrom;
    to = req.body.rto;
    busid = req.body.rbusid;
    db.any('select * from fn_add_transport_routes($1,$2,$3,$4)', [name, from, to, busid]).then(() => {
        res.send("Inserted Successfully")
    })
    pgp.end();
})
//Updating the transport info by route id
router.put('/transroute/route/:rid', (req, res, next) => {
    var db = pgp(cs)
    id = req.params.rid;
    name = req.body.rname;
    from = req.body.rfrom;
    to = req.body.rto;
    busid = req.body.rbusid;
    db.any('select * from fn_updtransportroutes_byrouteid($1,$2,$3,$4,$5)', [id, name, from, to, busid]).then(() => {
        res.send("Updated Successfully")
    })
    pgp.end();
})

//transport stop details using branch id
router.get('/transportstop/branch/:brnchid',(req,res,next)=>{
    var db = pgp(cs)
    bid = req.params.brnid;
    db.any('select * from fn_gettransportstop_bybrnchid($1)', bid).then((data) => {
        res.send(data)
    })
    pgp.end();
    
})

/* get transport stop details by stop route id */

router.get('/transportstop/sroute/:strid', (req, res, next) => {
    var db = pgp(cs)
    id = req.params.strid;
    db.any('select * from fn_gettransportstop_bystoprouteid($1)', id).then((data) => {
        res.send(data)
    })
    pgp.end();
})

/* get transport stop details By stopId */
router.get('/transportstop/stop/:sid', (req, res, next) => {
    var db = pgp(cs)
    id = req.params.sid;
    db.any('select * from fn_gettransportstop_bystopid($1)', id).then((data) => {
        res.send(data)
    })
    pgp.end();
})
//Adding the transport stop info
router.post('/transportstop',(req,res,next)=>{
    var db=pgp(cs);
    name=req.body.stname;
    details=req.body.stdetails;
    chrg=req.body.stchrg;
    routid=req.body.stroutid;
    db.any('select * from fn_add_transport_stops($1,$2,$3,$4)',[name,details,chrg,routid]).then(()=>{
        res.send("Inserted Successfully")
    })
    pgp.end();
})

//Updating the transport stop info by route id
router.put('/transportstop/stop/:stid',(req,res,next)=>{
    var db=pgp(cs)
    id=req.params.stid;
    name=req.body.stname;
    details=req.body.stdetails;
    chrg=req.body.stchrg;
    routid=req.body.stroutid;
db.any('select * from fn_updtransportstop_bystopid($1,$2,$3,$4,$5)',[id,name,details,chrg,routid]).then(()=>{
        res.send("Updated Successfully")
    })
    pgp.end();
})


//to return schoolbranch details by branchid
router.get('/schbrn/branch/:brnid', (req, res, next) => {

    var db = pgp(cs);

    var i = (req.params.brnid);

    db.any(' select * from fn_getschoolbranch_bybranchid_($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})

//to return all branch details by school_id
router.get('/schbrn/school/:brnschid', (req, res, next) => {

    var db = pgp(cs);

    var i = (req.params.brnschid);

    db.any(' select * from fn_getschoolbranch_byschid_($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})




// to insert new school_branch 
router.post('/schbrn', (req, res, next) => {
    var db = pgp(cs);


    var fnm = req.body.brnfname;
    var lnm = req.body.brnlname;
    var sch = req.body.brnschid;
    var cun = req.body.bnrcountry;
    var st = req.body.brnstate;
    var cty = req.body.brncity;
    var adl = req.body.brnaddline;
    var con1 = req.body.brncontact1;
    var con2 = req.body.brncontact2;
    var dat = req.body.brnstartdate;
    var stu = req.body.brnstatus;
    var img = req.body.brnimage;


    db.any(" select * from fn_add_schoolbranch($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",
        [fnm, lnm, sch, cun, st, cty, adl, con1, con2, dat, stu, img])
        .then(() => {
            res.send({ "message": "insert is  sucessssssssssssss::" });
        })
    pgp.end();
})


//to update  school_branch by id
router.put('/schbrn/branch/:brnid', (req, res, next) => {

    var db = pgp(cs);
    var i = (req.params.brnid);
    var fnm = req.body.brnfname;
    var lnm = req.body.brnlname;
    var sch = req.body.brnschid;
    var cun = req.body.bnrcountry;
    var st = req.body.brnstate;
    var cty = req.body.brncity;
    var adl = req.body.brnaddline;
    var con1 = req.body.brncontact1;
    var con2 = req.body.brncontact2;
    var dat = req.body.brnstartdate;
    var stu = req.body.brnstatus;
    var img = req.body.brnimage;


    db.any("select * from fn_updschoolbranch_bybranchid ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
        [i, fnm, lnm, sch, cun, st, cty, adl, con1, con2, dat, stu, img])
        .then(() => {
            res.send({ "message": "update is sucesss" });
        })
    pgp.end();
})



//get userbranch details by user id

router.get('/userbranch/user/:uid',(req,res,next)=>{
    var db=pgp(cs)
    id=req.params.uid;
    db.any('select * from fn_getuserbranchinfo_byuserid($1)',id).then((data)=>{
        res.send(data)
    })
    pgp.end();
})
//get userbranch details by branchid 
router.get('/userbranch/branch/:brnid',(req,res,next)=>{
    var db=pgp(cs)
    id=req.params.brnid;
    db.any('select * from fn_getuserbranch_bybranchid($1)',id).then((data)=>{
        res.send(data)
    })
    pgp.end();
})

//get leaves by userid 
router.get('/leaves/user/:usrid',(req,res,next)=>{
    var db=pgp(cs)
    usid=req.params.usrid;
    db.any('select * from fn_getleavesbyuserid($1)',usid).then((data)=>{
        res.send(data)
    })
    pgp.end();
})
//get leaves by branch id 
router.get('/leaves/branch/:brnid',(req,res,next)=>{
    var db=pgp(cs)
    bid=req.params.brnid;
    db.any('select * from fn_getleavesbybrnid($1)',bid).then((data)=>{
        res.send(data)
    })
    pgp.end();
})
//update the status of the leaves of faculty
router.put('/leaves/user/:usrid',(req,res,next)=>{
    var db=pgp(cs)
    usid=req.params.usrid;
    stat=req.body.sta;
db.any('select * from fn_updleavesbyuserid($1,$2)',[usid,stat]).then(()=>{
        res.send("Updated Successfully")
    })
    pgp.end();
})

    //get studentid using userid

    router.get('/stdparent/user/:usrid',(req,res,next)=>{
        var db=pgp(cs)
        uid=req.params.usrid;
        db.any('select * from fn_getstdprntinfo_byuserid($1)',uid).then((data)=>{
            res.send(data);
        })
        pgp.end()
    })
    //get userid using studentid

    router.get('/stdparent/student/:sid',(req,res,next)=>{
        var db=pgp(cs)
        id=req.params.sid;
        db.any('select * from fn_getstdprntinfo_bystdid($1)',id).then((data)=>{
            res.send(data);
        })
        pgp.end()
    })
//get timetable by schl id
router.get('/timetable/school/:schid',(req,res,next)=>{
    var db=pgp(cs)
    sid=req.params.schid;
    db.any('select * from fn_gettimetables_byschid($1)',sid).then((data)=>{
        res.send(data)
    })
    pgp.end();
})
//get timetable by brn id
router.get('/timetable/branch/:bid',(req,res,next)=>{
    var db=pgp(cs)
    id=req.params.bid;
    db.any('select * from fn_gettimetables_bybrnid($1)',id).then((data)=>{
        res.send(data)
    })
    pgp.end();
})
//get timetable by class id
router.get('/timetable/class/:classid',(req,res,next)=>{
    var db=pgp(cs)
    cid=req.params.classid;
    db.any('select * from fn_gettimetables_byclassid($1)',cid).then((data)=>{
        res.send(data)
    })
    pgp.end();
})
//adding timetable 
router.post('/timetable',(req,res,next)=>{
    var db=pgp(cs);
        sid=req.body.schid;
        bid=req.body.brnid;
        type=req.body.ttype;
        turl=req.body.tturl;
        re=req.body.rem;
        db.any('select * from fn_add_timetables($1,$2,$3,$4,$5)',[sid,bid,type,turl,re]).then(()=>{
            res.send("Inserted Successfully")
        })
        pgp.end();
    })
    //updating time table
    router.put('timetable/school/:schid',(req,res,next)=>{
        var db=pgp(cs)
        sid=req.params.schid;
        bid=req.body.brnid;
        type=req.body.ttype;
        turl=req.body.tturl;
        re=req.body.rem;
        db.any('select * from fn_updtimetables_byschid($1,$2,$3,$4,$5,$6)',[sid,bid,type,turl,re]).then(()=>{
            res.send("Updated Successfully")
        })
        pgp.end();
    })

    
//to get businfo details by bus_brnid 
router.get('/bus/branch/:busbrnid', (req, res, next) => {

    var db = pgp(cs);
    var i = (req.params.busbrnid);
    db.any(' select * from fn_getbusinfo_bybrnid_($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})


//to get businfo details by busid 
router.get('/bus/:bid', (req, res, next) => {

    var db = pgp(cs);
    var i = (req.params.bid);
    db.any(' select * from fn_getbusinfo_bybusid($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})


//to insert a new businfo details
router.post('/bus', (req, res, next) => {

    var db = pgp(cs);

    var brid = req.body.busbrnid;
    var reg = req.body.busregnum;
    var dec = req.body.busdescription;

    db.none("select fn_add_businfo($1,$2,$3)", [brid, reg, dec])
        .then(() => {
            res.send({ "message": "insert is  sucessssssssssssss::" });
        })
    pgp.end();
})

//to update the businfo by busid
router.put('/bus/:busid', (req, res, next) => {
    var db = pgp(cs);

    var i = (req.params.busid);

    var brid = req.body.busbrnid;
    var reg = req.body.busregnum;
    var dec = req.body.busdescription;

    db.none("select * from fn_updbusinfo_bybusid($1,$2,$3,$4)", [i, brid, reg, dec]).then(() => {
        res.send({ "message": "update is sucesss" });
    })
    pgp.end();
})


/***************************Team @ 2 end**************************** */



/********************************TEAM3-START********************************************* */
/************************************GALLERY*********************************************** */
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
//--------------------------------------------------------------------------------------------------
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
//add subject and syllabus details of class subjectmaster
router.post('/classsubject/class', (req, res, next) => {
    var db = pgp(cs);
    sid = req.body.schidd;
    cid = req.body.clsidd;
    siid = req.body.subjidd;
    sbs = req.body.syllabuss;
  /*   console.log(clsid);
    console.log(schid);
    console.log(subjid);
    console.log(syllabus);
 */   
    db.any('select fn_Add_ClassSubj_info($1,$2,$3,$4)', [sid, cid, siid, sbs]).then(() => {
        res.send({ "message": "record Inserted Succexxx..." })
    })
    pgp.end();
})
//update syllabus by subjid
router.put('/classsubject/subject/:subjidd', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.subjidd;
    var upd = req.body.syllabuss;
    console.log(i);
    console.log(upd);
    db.any('select fn_Upd_Syllabus_bysubjid($1,$2)',[i, upd]).then(() => {
        res.send({ "message": "Update success.." })
    })
    pgp.end();
})
//--------------------------------------------------------------------------------------------
//Faculty
//--------------------------------------------------------------------------------------------
//fn_GetAllFacinfo_byBrnid
router.get('/faculty/branch/:brnid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.brnid;
    db.any('select * from fn_GetAllFacinfo_byBrnid($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
})
//add faculty details
router.post('/faculty', (req, res, next) => {
    
    var db = pgp(cs);
    var schid = req.body.schidd;
    var brnid= req.body.brnidd;
    var facfname = req.body.facfnamee;
    var faclname= req.body.faclnamee;
    var gender = req.body.genderr;
    var dob = req.body.dobb;
    var doj = req.body.dojj;
    var experience = req.body.experiencee;
    var image = req.body.imagee;
    var contactno1 = req.body.contactno1e;
    var contactno2 = req.body.contactno2e;
    var emailid = req.body.emailidd;
    var address = req.body.addresss;
    var city = req.body.cityy;
    var fstate = req.body.fstatee;
    var country= req.body.countryy;
    var status = req.body.statuss;

    var contactno1 = req.body.contactno1e;
    var emailid = req.body.emailidd;
    db.any('select fn_Gen_Add_Faculty($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)', [schid, brnid,facfname, faclname, gender, dob, doj, experience, image, contactno1, contactno2, emailid, address,city,fstate,country,status])
        .then(function () {
            res.status(200).send({ message: "Record Inserted Success.." });
        })
        pgp.end();
})
//update totalfaculty info
router.put('/faculty/:facid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.facid;
    var facfnme= req.body.facfnamee;
    var faclnme = req.body.faclnamee;
    var gender=req.body.genderr;
    var dob=req.body.dobb;
    var doj=req.body.dojj;
    var experience=req.body.experiencee;
    var image=req.body.imagee;
     var contct1 = req.body.contactno1e;
    var contct2=req.body.contactno2e;
    var emailid=req.body.emailidd;
    var address=req.body.addresss;
    var city=req.body.cityy;
    var fstate=req.body.fstatee;
    var country=req.body.countryy;
    var status=req.body.statuss;

    db.any('select * from fn_Upd_Facinfo_byfacid($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)', [i, facfnme, faclnme,gender,dob,doj,experience,image,contct1,contct2,
        emailid,address,city,fstate,country,status]).then(function () {
        console.log('Record Updated Success ...')
        res.status(200).send({ message: "Updated Succes.." })
    })
    pgp.end();
})
//-------------------------------------------------------------------------------------------
//SchoolClassSectionMaster
//-------------------------------------------------------------------------------------------
//get schoolclasssecmstr info by schid
router.get('/schclssec/school/:stdid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.stdid;
    db.any('select * from fn_Get_Schoolclasssecmstrinfo_by_Stdid($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
})
//get schoolclasssecmstr info by brnid
router.get('/schclssec/branch/:brnid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.brnid;
    db.any('select * from fn_Get_Schoolclasssecmstrinfo_by_brnid($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
})
//get schoolclasssecmstr info by clsid
router.get('/schclssec/class/:clsid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.clsid;
    db.any('select * from fn_Get_Schoolclasssecmstrinfo_by_clsid($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
})
//add schoolclasssecmstrinfo
router.post('/schclssec', (req, res, next) => {
    var db = pgp(cs);
    var sectschid = req.body.sctschidd;
    var sectbrnid = req.body.sctbrnidd;
    var sectclsid = req.body.sctclsidd;
    var sectnme = req.body.sctnamee;
    var sectid = req.body.sctidd;
    db.any('select fn_Add_ClassSectioninfo($1,$2,$3,$4,$5)', [sectschid, sectbrnid, sectclsid, sectnme, sectid])
        .then(function () {
            res.status(200).send({ message: "Record Inserted Success.." });
        })
        pgp.end();
})
//update schoolclasssecmstrname by secid
router.put('/schclssec/section/:id', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.id;
    var sectnme = req.body.sctnamee;
    console.log(i);
    console.log(sectnme);
    db.any('select fn_Upd_ClassSectionname_bysectid($1,$2)',[i,sectnme]).then(function () {
        console.log('Record Updated Success ...')
        res.status(200).send({ message: "Updated Succes.." })
    })
    pgp.end();
})
//-------------------------------------------------------------------------------
//classtechermaster
//----------------------------------------------------------------------------
//get classteacherinfo by classid
router.get('/clsteach/class/:id', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.id
    db.any('select * from fn_Get_ClassTeacher_byclsid($1)', i)
        .then(function (data) {
            res.send(data);
        })
        pgp.end();
})
//get classteacherinfo by branchid
router.get('/clsteach/branch/:id', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.id
    db.any('select * from fn_Get_ClassTeacherinfo_bybrnid($1)', i)
        .then(function (data) {
            res.send(data);
        })
        pgp.end();
})
//get classteacherinfo by facid
router.get('/clsteach/faculty/:id', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.id
    db.any('select * from fn_Get_ClassTeacherinfo_byfacid($1)', i)
        .then(function (data) {
            res.send(data);
        })
        pgp.end();
})
//add classteacher details
router.post('/clsteach', (req, res, next) => {
    var db = pgp(cs);
    console.log(req.body);
   
    var SId = req.body.schidd;
    var BId = req.body.brnidd;
    var FId = req.body.facidd;
    var BtId = req.body.btcidd;
    db.any('select fn_Add_ClassTeacher($1,$2,$3,$4)',[SId,BId,FId,BtId])
        .then(function () {
            res.status(200).send({"message" : "insertEd Succes..."});
        })
        pgp.end();
})
//update classteacher status with facid
router.put('/clsteach/faculty/:id', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.id;
    var sts = req.body.Status;
    db.any('select * from fn_Upd_ClassteacherStatus_byfacid($1,$2)', [sts,i]).then(function () {
        console.log('Record Updated Success ...')
        res.status(200).send({ message: "Updated Succes.." })
    })
    pgp.end();
})
//-------------------------------------------------------------------------
//Batchmaster
//--------------------------------------------------------------------------------
//get batch details by schid
router.get('/batch/school/:id', (req, res, next) => {
    var db = pgp(cs);
    var i= req.params.id;
    console.log(i);
    console.log('displaying...................');
    db.any('select * from  fn_Getbatchbybtcschid($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
})
//get batch details by brnid
router.get('/batch/branch/:id', (req, res, next) => {
    var db = pgp(cs);
    var i= req.params.id;
    console.log(i);
    console.log('displaying...................');
    db.any('select * from  fn_Getbatchbybtcbrnid($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
})
//get batch details by sectid
router.get('/batch/section/:id', (req, res, next) => {
    var db = pgp(cs);
    var i= req.params.id;
    console.log(i);
    console.log('displaying...................');
    db.any('select * from  fn_Getbatchbybtcsctid($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
})
//get batch details by sectid
router.get('/batch/btc/:id', (req, res, next) => {
    var db = pgp(cs);
    var i= req.params.id;
    console.log(i);
    console.log('displaying...................');
    db.any('select * from  fn_Getbatchbyid($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
})
//adding batch details 
router.post('/batch', (req, res, next) => {
    var db = pgp(cs);
    var i = req.body.btcidd;
    var schidd = req.body.btcschidd;
    var brnidd = req.body.btcbrnidd;
    var sctidd = req.body.btcsctidd;
    var startdatee=req.body.btcstartdatee;
    var enddatee = req.body.btcenddatee;
    var classidd = req.body.btcclassidd;
    var secnamee = req.body.btcsecnamee;
   var statuss = req.body.btcstatuss;

    db.any('select * from fn_gen_AddBatch($1,$2,$3,$4,$5,$6,$7,$8)',[schidd,brnidd,
        sctidd,startdatee,enddatee,classidd,secnamee,statuss]).then(()=> {
        console.log('Record Inserted ...')
        res.status(200).send({ message: "Inserted Success.." });
    })
    pgp.end();
})
//update batch details using brnid
router.put('/batch/btc/:id', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.id;
    var bed = req.body.btcenddatee;
    var sts = req.body.btcstatuss;
    console.log('end date  :  '+bed)
    console.log('status  :  '+sts)
    db.any('select * from fn_Upd_batchbyid($1,$2,$3)', [i,bed,sts]).then(function () {
        console.log('Record Updated Success ...')
        res.status(200).send({ message: "Updated Succes.." })
    })
    pgp.end();
})
//--------------------------------------------------------------------
//student batch master
//-----------------------------------------------------------------
// get studentbatchid by btcid
router.get('/studbatch/batch/:btcid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.btcid;
    db.any('select * from fn_Get_StudentBatchID_by_btcid($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
})
// get studentbatchid by stdid
router.get('/studbatch/student/:id', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.id;
    db.any('select * from fn_Get_StudentBatchID_by_Stdid($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
})
//-----------------------------------------------------------------
//facultysubjectmaster
//------------------------------------------------------------------
//get facultysubjectsinfo by facid
router.get('/facsubj/faculty/:id', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.id
    db.any('select * from fn_FacultySubjectmaster_get_subjid_byfacid($1)', i)
        .then(function (data) {
            res.send(data);
        })
        pgp.end();
})
//get facultysubjectsinfo by subjid
router.get('/facsubj/subj/:id', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.id
    db.any('select * from fn_FacultySubjectmaster_get_facid_bysubjid($1)', i)
        .then(function (data) {
            res.send(data);
        })
        pgp.end();
})

/********************************************TEAM3-end************************************** */


/*******************************Team 1 start*************************** */


//for getting all bus details 
router.get('/busmaster', (req, res, next) => {
    var db = pgp(cs);

    db.any('select * from fn_GetAll_busdrivermaster()').then((data) => {
        res.send(data);
    })
    pgp.end();
})

//getting  bus details by busid
router.get('/busmaster/:BdaBusId', (req, res, next) => {
    var db = pgp(cs);

    var i = req.params.BdaBusId

    db.any('select * from fn_Get_busdrivermaster_bybdabusid($1)', i)
        .then((data) => {
            res.send(data);
        })
        pgp.end();
})


// add or allocating the bus driver to bus  
router.post('/busmaster', (req, res, next) => {
    var db = pgp(cs);

    bdid = req .body.a_bdabusid;
    bddrid = req.body.a_bdadrvid;
    bddate = req.body.a_bdadate;
    


    db.any('select fn_add_busdrivermaster($1,$2,$3)',[bdid, bddrid, bddate]).then(() => {
        res.send({ "message": "record Inserted Success..." })
    })
    pgp.end()
})




 // updating the bus driver details using bus id
 router.put('/busmaster/:a_bdabusid', (req, res, next) => {
    var db = pgp(cs);

    var i = req.params.a_bdabusid;
    bddrid = req.body.a_bdadrvid;
    bddate = req.body.a_bdadate;
    
    db.any(
        'select fn_Upd_busdrivermaster($1,$2,$3)', [i, bddrid, bddate]).then(() => {
            res.send({ "message": "Update success.." })
        })
        pgp.end();
})

//*************************driver information******************************** */

//getting all driver information
router.get('/driver', (req, res, next) => {
    var db = pgp(cs);
    db.any('select * from fn_GetAll_driverinfo()').then((data) => {
        res.send(data);
    })
    pgp.end();
})


// getting  driver details by driver id
router.get('/driver/:drvid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.drvid

    db.any('select * from fn_Get_driverinfo_bydrvid($1)', i)
        .then((data) => {
            res.send(data);
        })
    pgp.end();
})


//adding the drivers details

router.post('/driver', (req, res, next) => {
    var db = pgp(cs);
    /* drvid = req.body.drvid; */
    drvn = req.body.a_drvname;
    drvd = req.body.a_drvdob;
    drva = req.body.a_drvaddress;
    drvc1 = req.body.a_drvcontact1;
    drvc2 = req.body.a_drvcontact2;
    drvi= req.body.a_drvimage;
    drvl = req.body.a_drvlicencenum;
   

    db.any('select fn_Add_driverinfo($1,$2,$3,$4,$5,$6,$7)', [drvn, drvd,drva,drvc1,drvc2,drvi,drvl]).then(() => {
        res.send({ "message": "record Inserted Succexxx..." })
    })
    pgp.end();
})



// updating the driver details by driverid 

router.put('/driver/:drvid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.drvid;

    drvN = req.body.a_drvname;
    drvD= req.body.a_drvdob;
    drvA = req.body.a_drvaddress;
    drvC2 = req.body.a_drvcontact1;
    drvC1 = req.body.a_drvcontact2;
    drvI = req.body.a_drvimage;
    drvL = req.body.a_drvlicencenum;
    
    db.any(
        'select fn_Upd_driverinfo_bydrvid($1,$2,$3,$4,$5,$6,$7,$8)', [i, drvN, drvD,drvA,drvC2,drvC1,drvI,drvL]).then(() => {
            res.send({ "message": "Update success.." })
        })
        pgp.end();
})
//***************************school class master********************************* */
//getting all class details of school
router.get('/schclass', (req, res, next) => {
    var db = pgp(cs);
    db.any('select * from fn_GetAll_Classdetails()').then(function (data) {
        res.send(data);
    })
    pgp.end();
})


//getting class details by using class id
router.get('/schclass/class/:clsid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.clsid
    db.any('select * from fn_Get_Classdetails_by_Clsid($1)', i)
        .then(function (data) {
            res.send(data);
        })
        pgp.end();
})


//getting class details by using branch id
router.get('/schclass/branch/:brnid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.brnid
    db.any('select * from fn_Get_Classdetails_by_Brnid($1)', i)
        .then(function (data) {
            res.send(data);
        })
        pgp.end();
})


// getting class details by using school id
router.get('/schclass/school/:schid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.schid
    db.any('select * from fn_Get_Classdetails_by_Schid($1)', i)
        .then(function (data) {
            res.send(data);
        })
        pgp.end();
})


// adding class details for schools
router.post('/schclass', (req, res, next) => {
    var db = pgp(cs);
    console.log(req.body);
    var si = req.body.c_schid;
    var bi = req.body.c_brnid;
    var cn = req.body.c_clsname;
    var cm = req.body.c_clsmedium;
    db.any('select fn_Add_Classdetails($1,$2,$3,$4)',[si,bi,cn,cm])
 .then(function () {
            res.status(200).send({"message" : "insertEd Succes..."});
        })
        pgp.end();   
})

// updating class details by class id 
router.put('/schclass/:c_cid',(req,res,next)=>{
    var db = pgp(cs);
    var ci = req.params.c_cid;
    var cn = req.body.c_clsname;
    var cm = req.body.c_clsmedium;


    db.any('select fn_Upd_Classdetails_by_Clsid($1,$2,$3)',[ci,cn,cm])
    .then(function(){
        res.status(200).send({message:"Updated Succes...."})
    })
    pgp.end();
})

//***********************student details***************************** */
// getting all student details of school
router.get('/student', (req, res, next) => {
    var db = pgp(cs);
    db.any('select * from fn_GetAll_Studentdetails() ').then((data) => {
        res.send(data);
    })
    pgp.end();
})

// getting student details by student id
router.get('/student/:stdid', (req, res, next) => { 
    var db = pgp(cs);
    var i = req.params.stdid
    console.log(i)
    db.any('select * from fn_Get_StudentDetails_By_StId($1) ', i)
        .then((data) => {
            console.log(data)
            res.send(data);
        })
        pgp.end();
})

//getting  student details by branch id
router.get('/student/branch/:brnid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.brnid
    console.log(i)
    db.any('select * from fn_Get_StudentDetails_By_Brnid($1) ', i)
        .then((data) => {
            console.log(data)
            res.send(data);
        })
        pgp.end();
})
//getting student details by school id
router.get('/student/school/:schid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.schid
    console.log(i)
    db.any('select * from fn_Get_StudentDetails_By_schid($1) ', i)
        .then((data) => {
            console.log(data)
            res.send(data);
        })
        pgp.end();
})


//add student details 
router.post('/student',(req,res,next) => {
    var db = pgp(cs);
    ssid = req.body.s_stdschid;
    ssbid =req.body.s_stdschbrnid
    sfn = req.body.s_stdfname
    sln = req.body.s_stdlname
    sam = req.body.s_stdadmissionnum
    sdob =req.body.s_stddob
    sg=req.body.s_stdgender
    sfan = req.body.s_stdfathername
    smon =req.body.s_stdmothername 
    sfo=req.body.s_stdfatheroccupation
    sc =req.body.s_stdcaste
    ssc=req.body.s_stdsubcaste
    sr=req.body.s_stdreligion
    sn =req.body.s_stdnationality
    sem=req.body.s_stdemail
    sc=req.body.s_stdcountry
    ss =req.body.s_stdstate
    sci =req.body.s_stdcity
    sa =req.body.s_stdaddress
    sadhr =req.body.s_stdaadhar
    simg =req.body.s_stdimage
    scn1 =req.body.s_stdcontactnum1
    scn2 =req.body.s_stdcontactnum2
    ss =req.body.s_stdstatus
    
  



     db.any('select  fn_Add_Studentdetails($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)',
      [
        ssid, ssbid,sfn ,sln,sam ,sdob,sg,sfan ,smon ,sfo,sc ,ssc,sr,sn,sem,sc,ss,sci,sa ,sadhr ,simg ,scn1 ,scn2 ,ss ]).then(() => {
        res.send('record Inserted Succexxx...');

    })
    pgp.end();
})


//updating student details by student id
router.put('/student/:s_stdid',(req,res,next)=>{
    var db = pgp(cs);
    sid =req.params.s_stdid;
    ssid = req.body.s_stdschid;
    ssbid =req.body.s_stdschbrnid
    sfn = req.body.s_stdfname
    sln = req.body.s_stdlname
    sam = req.body.s_stdadmissionnum
    sdob =req.body.s_stddob
    sg=req.body.s_stdgender
    sfan = req.body.s_stdfathername
    smon =req.body.s_stdmothername 
    sfo=req.body.s_stdfatheroccupation
    sc =req.body.s_stdcaste
    ssc=req.body.s_stdsubcaste
    sr=req.body.s_stdreligion
    sn =req.body.s_stdnationality
    sem=req.body.s_stdemail
    sc=req.body.s_stdcountry
    ss =req.body.s_stdstate
    sci =req.body.s_stdcity
    sa =req.body.s_stdaddress
    sadhr =req.body.s_stdaadhar
    simg =req.body.s_stdimage
    scn1 =req.body.s_stdcontactnum1
    scn2 =req.body.s_stdcontactnum2
    ss =req.body.s_stdstatus
    db.any('select  fn_Upd_Studentdetails_by_Stid($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)',
    [sid,ssid, ssbid,sfn ,sln,sam ,sdob,sg,sfan ,smon ,sfo,sc ,ssc,sr,sn,sem,sc,ss,sci,sa ,sadhr ,simg ,scn1 ,scn2 ,ss ])
     .then(function(){
        res.status(200).send({message:"Updated Succes...."})
    })
    pgp.end();
})
//***********************subjectmaster********************************* */

// getting subject details 
router.get('/subject', (req, res, next) => {
    var db = pgp(cs);
    db.any('select * from fn_GetAll_Subjdetails()').then(function (data) {
        res.send(data);
    })
    pgp.end();
})


// getting subject details by subject id
router.get('/subject/:subjid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.subjid;
    db.any('select * from fn_Get_SubjDetails_by_Subid($1)', i)
        .then(function (data) {
            res.send(data);
        })
        pgp.end();
})

//getting subject details by branch id
router.get('/subject/branch/:brnid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.brnid;
    db.any('select * from fn_Get_SubjDetails_by_Brnid($1)', i)
        .then(function (data) {
            res.send(data);
        })
        pgp.end();
})

//adding  subject details 
router.post('/subject', (req, res, next) => {
    var db = pgp(cs);
    console.log(req.body);
    var schid=req.body.s_schid;
    var brnid=req.body.s_brnid;
    var sn = req.body.s_subjname;
    var sm = req.body.s_subjmedium;
    db.any('select fn_Add_SubjDetails  ($1,$2,$3,$4)',[schid,brnid,sn,sm])
 .then(function () {
            res.status(200).send({"message" : "insertEd Succes..."});
        })
        pgp.end();
})

//updating subject details by subject id
router.put('/student/:s_subjid',(req,res,next)=>{
    var db = pgp(cs);
    var si = req.params.s_subjid
    var sn = req.body.s_subjname;
    var sm = req.body.s_subjmedium;

    db.any('select fn_Upd_Subjdetails_bySubid($1,$2,$3)',[si,sn,sm])
    .then(function(){
        res.status(200).send({message:"Updated Succes...."})
    })
    pgp.end();
})

//*************************user transport**************************** */
//getting all details of user transport 
router.get('/usertransportmaster', (req, res, next) => {
    var db=pgp(cs)
    db.any('select * from fn_GetAll_usertransportdetails()').then((data) => {
        res.send(data);
    })
    pgp.end();
})

// getting usertransport details by usertransportuserid(utuserid)
router.get('/usertransportmaster/:utuserid', (req, res, next) => {
    var db=pgp(cs)
    var i = req.params.utuserid

    db.any('select * from fn_Get_usertransportdetails_byutuserid($1)', i)
        .then((data) => {
            res.send(data);
        })
        pgp.end();
})
//getting usertransport details by using stop id
router.get('/usertransportmaster/stop/:utstpid', (req, res, next) => {
    var db=pgp(cs)
    var i = req.params.utstpid;

    db.any('select * from fn_Get_usertransportdetails_bystpid($1)', i)
        .then((data) => {
            res.send(data);
        })
        pgp.end();
})

//adding user transport details 
router.post('/usertransportmaster', (req, res, next) => {

    var db=pgp(cs)
    uid = req.body.a_utuserid;
    stid = req.body.a_utstpid;
   


    db.any('select fn_Add_usertransportdetails($1,$2)', [ uid, stid]).then(() => {
        res.send({ "message": "record Inserted Succexxx..." })
    })
    pgp.end();
})


//updating user transport details by user transport userid
router.put('/usertransportmaster/:a_utuserid', (req, res, next) => {
    var db=pgp(cs)

    var i = req.params.a_utuserid;
    stid = req.body.a_utstpid;
    
    db.any(
        'select fn_Upd_usertransportdetails($1,$2)', [i,  stid]).then(() => {
            res.send({ "message": "Update success.." })
        })
        pgp.end();
})


//*************************user transport pay master***************************** */
//getting  all usertransport pay details 
router.get('/usertransportpaymaster', (req, res, next) => {
    var db=pgp(cs)
    db.any('select * from fn_GetAll_usertransportpaydetails()').then((data) => {
        res.send(data);
    })
    pgp.end();
})

//getting usertransport  pay details by user transort pay user id
router.get('/usertransportpaymaster/:id', (req, res, next) => {
    var db=pgp(cs)
    var i = req.params.id

    db.any('select * from fn_Get_usertransportpaydetails_byutpuserid($1)', i)
        .then((data) => {
            res.send(data);
        })
        pgp.end();
})

//adding usertransport pay details
router.post('/usertransportpaymaster', (req, res, next) => {

    var db=pgp(cs)
    uid = req.body.a_utpuserid;
    upa = req.body.a_utpaidamount;
    upd = req.body.a_utpaiddate;
    urb = req.body.a_utbal;
    ups = req.body.a_utstatus;


    db.any('select fn_Add_usertransportpaydetails($1,$2,$3,$4,$5)', [uid,upa, upd,urb,ups]).then(() => {
        res.send({ "message": "record Inserted Succexxx..." })
    })
    pgp.end();
})




//updating user transport pay details by usertransport pay user id
router.put('/usertransportpaymaster/:utpuserid', (req, res, next) => {
    var db=pgp(cs)

    var i = req.params.utpuserid;

    upa = req.body.a_utpaidamount;
    upd = req.body.a_utpaiddate;
    urb = req.body.a_utbal;
    ups = req.body.a_utstatus;
    
    db.any('select fn_Upd_usertransportpaydetails($1,$2,$3,$4,$5)', [i,upa, upd,urb,ups]).then(() => {
            res.send({ "message": "Update success.." })
        })
        pgp.end();
})

/***************************team1 end**************************** */

/************************************************* team4 start*****************************************/

// adding holiday details //
router.post('/holiday', (req, res, next) => {
    var db = pgp(cs);
    var si=req.body.hldyshlid;
    var bi=req.body.hldybrnid;
    var hd=req.body.hldydt;                                                                                                                                                                                                                                                                                                                                      
    var ho=req.body.hldyocc;

   db.none('select * from fn_add_holiday($1, $2, $3,$4)', [si,bi,hd,ho])
       .then(() => {
           res.send({ "message": "insert is  sucessssssssssssss::" });
       })
       pgp.end()
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

// updating holiday details by using school id //

router.put('/holiday/school/:hldyshlidid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.hldyshlidid;
   var hb=req.body.hldybrnid;
    var hh=req.body.hldydt;
    var ho=req.body.hldyocc;
    db.none("select * from fn_update_holiday($1,$2,$3,$4)", [i,hb,hh,ho]).then(() => {
        res.send({ "message": "update is sucesss" });
    })
    pgp.end()
})

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

// add exam timetable
router.post('/extimetable', (req, res, next) => {
    var db = pgp(cs);
    a = req.body.exsid;
    b = req.body.exbid;
    c = req.body.excid;
    d = req.body.exfrmdt;
    e = req.body.extodt;
    f = req.body.url;
    g = req.body.exst;
  
    db.none('select * from fn_add_examtimetable($1,$2,$3,$4,$5,$6,$7)', [a, b, c, d, e,f,g]).then(() => {
        res.send({ message: 'record Inserted Successfully...' })
    })
    pgp.end();
})


// update exam timetable using branch id
 router.put('/extimetable/branch/:exbid', (req, res, next) => {
    var db = pgp(cs);
    var pi = req.params.exbid;
    a = req.body.exsid;

    c = req.body.excid;
    d = req.body.exfrmdt;
    e = req.body.extodt;
    f = req.body.url;
    g = req.body.exst;
    db.none("select * from fn_update_examtimetablebybranch($1, $2, $3, $4, $5, $6, $7)", [a,pi, c, d, e, f, g]).then(() => {
            res.send('Updated Success');
        })
        pgp.end();
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
//get fees by branchid
router.get('/feeinfo/branch/:fbrnid', (req, res, next) => {
    var db = pgp(cs);
    var b =req.params.fbrnid
    db.any('select  * from    fn_getfeesbybrnid($1)',b).then((data) => {
        res.send(data)
    })
    pgp.end()
})
//get fees by classid
router.get('/feeinfo/class/:fclsid', (req, res, next) => {
    var db = pgp(cs);
    var a = req.params.fclsid;
    db.any('select  * from  fn_getfeesbyclsid($1)',a).then((data) => {
        res.send(data)
    })
    pgp.end()
})
// insert fees info

router.post('/feeinfo', (req, res, next) => {
    var db = pgp(cs);

    var si = req.body.fschid;
    var bi = req.body.fbrnid;
    var cc = req.body.fclsid;
    var aa = req.body.famnt;

    db.any('select * from fn_addfeesinfo($1,$2,$3,$4)', [si, bi, cc, aa])
        .then(() => {
            res.send({ "message": "insert is  sucessssssssssssss::" });
        })
        pgp.end()
})
// update fees structure by classid
router.put('/feeinfo/class/:fclsid', (req, res, next) => {
    var db = pgp(cs);
    var cc = req.body.fschid;
    var fi = req.body.fbrnid;
    var i = req.params.fclsid;
    var aa = req.body.famnt;
   
    db.any('select * from  fn_updatefees($1,$2,$3,$4)', [  cc,fi,i, aa]).then(() => {
        res.send({ "message": "update is sucesss" });
    })
    pgp.end()
})

//get facultyfeedback by facultyid.....
router.get('/facfeedback/faculty/:id', (req, res, next) => {
    var db = pgp(cs);
    var i= req.params.id;
    console.log(i);
    console.log('displaying...................');
    db.any('select * from fn_getbyfacultyfeedbackfclty($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
})

//get facultyfeedback by branchid......
router.get('/facfeedback/branch/:brnid', (req, res, next) => {
    var db = pgp(cs);
    var i= req.params.brnid;
    console.log(i);
    console.log('displaying...................');
    db.any('select * from fn_Get_facultyfeedbackbybranch($1)', i).then(function (data) {
        res.send(data);
    })
    pgp.end();
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

// get student feedback by branch id
router.get('/studfeedback/branch/:brnchid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.brnchid
    db.any('select * from fn_get_studentfeedbackbybranch($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})

// retrieving schoolfeedback details by using school id //

router.get('/schfeedback/school/:shlid', (req, res, next) => {
    var db = pgp(cs);

    var j = req.params.shlid;
    db.any('select * from fn_getbyschoolid_schoolfeedback($1)', [j]).then((data) => {
        res.send(data);
    })
    pgp.end()
})

//   for adding feepayment details //                           
router.post('/feepayment', (req, res, next) => {
    var db = pgp(cs);
    var ti=req.body.stdid;
    var pp=req.body.pa;
    var pi=req.body.pd;
    var rr=req.body.re;
db.any('select * from fn_add_feepayinfo($1, $2, $3,$4)', [ti,pp,pi,rr])
       .then(() => {
           res.send({ "message": "insert is  sucessssssssssssss::" });
       })
       pgp.end()
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

// retrieving feepayment details by using branch id //
router.get('/feepayment/branch/:brnhid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.brnhid;
    db.any('select * from fn_Get_feepaymentbybrn($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end()
})

// retrieving feepayment details by using school id//
router.get('/feepayment/school/:schlid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.schlid;
    db.any('select * from fn_Get_feepaymentbysch($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end()
})

// updating feepayment details by using student id //
router.put('/feepayment/:stdid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.stdid;
    var pp=req.body.pa;
    var pi=req.body.pd;
    var rr=req.body.re;
   
   
   
    db.none("select * from fn_feepaymentmaster_update($1,$2,$3,$4)", [i,pp,pi,rr]).then(() => {
        res.send({ "message": "update is sucesss" });
    })
    pgp.end()
})

//getting salary details by schoolid
router.get('/salary/school/:schid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.schid;
    db.any('select  * from fn_Get_salary_infobysch($1)', i).then((data) => {
        res.send(data)
    })
    pgp.end()
})

//getting salary details by branchid
router.get('/salary/branch/:brnid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.brnid;
    db.any('select * from  fn_Get_salary_infobybrn($1)', i).then((data) => {
        res.send(data);
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


// inserting salary details
router.post('/salary', (req, res, next) => {
    var db = pgp(cs);

    var fi = req.body.salfid;
    var sali = req.body.salsal;
    var ss = req.body.salalw;
    var sd = req.body.saldedc;

    db.any('select * from fn_addsalary_info($1,$2,$3,$4)', [fi, sali, ss, sd])
        .then(() => {
            res.send({ "message": "insert is  sucessssssssssssss::" });
        })
    pgp.end()
})

//updating salary details by facultyid
router.put('/salary/faculty/:salfid', (req, res, next) => {
    var db = pgp(cs);

    var i = req.params.salfid;

    var fi = req.body.salsal;
    var cc = req.body.salalw;
    var aa = req.body.saldedc;

    db.any("select * from  fn_updsalaryinfo_byfacid($1,$2,$3,$4)", [i, fi, cc, aa]).then(() => {
        res.send({ "message": "update is sucesss" });
    })
    pgp.end()
})

// get salary payment by school id
router.get('/salpay/school/:schlid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.schlid
    db.any('select * from fn_Get_salarypaymentbyschool($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})

// get salary payment by branch id
router.get('/salpay/branch/:brnhid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.brnhid
    db.any('select * from fn_Get_salarypaymentbybranch($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})

// get salary payment by faculty id
router.get('/salpay/faculty/:facltyid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.facltyid
    db.any('select * from fn_Get_salarypaymentbyfaculty($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})

// insert into salary payment master
router.post('/salpay', (req, res, next) => {
    var db = pgp(cs);
    a = req.body.salfid;
    b = req.body.salpyamt;
    c = req.body.salpydt;
    d = req.body.salpydu;
    e = req.body.salpyal;
    f = req.body.salpyded;
    g = req.body.salpybns;
    h = req.body.salpyalldtls;
    i = req.body.remark;
    db.none('select * from fn_add_salarypayment($1,$2,$3,$4,$5,$6,$7,$8,$9)', [a,b, c, d, e, f, g, h, i]).then(() => {
        res.send({ message: 'record Inserted Successfully...' })
    })
    pgp.end();
})


// update salary payment by faculty id
 router.put('/salpay/faculty/:salfid', (req, res, next) => {
    var db = pgp(cs);
    var pi = req.params.salfid;
    
    b = req.body.salpyamt;
    c = req.body.salpydt;
    d = req.body.salpydu;
    e = req.body.salpyal;
    f = req.body.salpyded;
    g = req.body.salpybns;
    h = req.body.salpyalldtls;
    i = req.body.remark;
    db.none("select * from fn_update_salarypaymentbyfaculty($1, $2, $3, $4, $5, $6, $7, $8, $9)", [pi,b, c, d, e, f, g, h, i]).then(() => {
            res.send({message:'Updated Success'});
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



/************************************************* team4 end**************************************** */

module.exports = router;