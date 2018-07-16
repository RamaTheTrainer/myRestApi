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
router.get('salary/branch/:brnid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.brnid;
    db.any('select * from  fn_Get_salary_infobybrn($1)', i).then((data) => {
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
// updating feepayment details by using stdid //
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

// retrieving feepayment details by using stdid //
router.get('/feepayment/student/:stdid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.stdid;
    db.any('select * from fn_feepaymentmaster_selectbyid($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end()
})

// retrieving feepayment details by using brnid //
router.get('/feepayment/branch/:brnhid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.brnhid;
    db.any('select * from fn_Get_feepaymentbybrn($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end()
})

// retrieving feepayment details by using schlid //
router.get('/feepayment/school/:schlid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.schlid;
    db.any('select * from fn_Get_feepaymentbysch($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end()
})

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

//getting particular userid 
router.get('/users/:usrid', (req, res, next) => {
    var t=req.params.usrid;
    db.any('select * from fn_users_getbyid($1)',[t]).then(function (data) {
        res.send(data);
    })
}) 

//get by branch id
router.get('/transroute/:brnid', (req, res, next) => {
    var db = pgp(cs)
    bid = req.params.brnid;
    db.any('select * from fn_getbybrnchid_transportroute($1)', bid).then((data) => {
        res.send(data)
    })
    pgp.end();
})

/* get by route bus id */

router.get('/routebus/:rbusid', (req, res, next) => {
    var db = pgp(cs)
    bid = req.params.rbusid;
    db.any('select * from fn_getbyroutebusid($1)', bid).then((data) => {
        res.send(data)
    })
    pgp.end();
})


/* get By routeId */
router.get('/route/:rid', (req, res, next) => {
    var db = pgp(cs)
    bid = req.params.rid;
    db.any('select * from fn_getbyrouteid($1)', bid).then((data) => {
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
router.put('/transroute/:rid', (req, res, next) => {
    var db = pgp(cs)
    id = req.params.rid;
    name = req.body.rname;
    from = req.body.rfrom;
    to = req.body.rto;
    busid = req.body.rbusid;
    db.any('select * from fn_updbyrouteid($1,$2,$3,$4,$5)', [id, name, from, to, busid]).then(() => {
        res.send("Updated Successfully")
    })
    pgp.end();
})

//stop route using branch id
router.get('/stoproute/:brnchid',(req,res,next)=>{
    var db = pgp(cs)
    bid = req.params.brnid;
    db.any('select * from fn_getbybrnchid_transportstop($1)', bid).then((data) => {
        res.send(data)
    })
    pgp.end();
    
})

/* get by stop route id */

router.get('/stoproute/:strid', (req, res, next) => {
    var db = pgp(cs)
    id = req.params.strid;
    db.any('select * from fn_getbystoprouteid($1)', id).then((data) => {
        res.send(data)
    })
    pgp.end();
})


/* get By stopId */
router.get('/stop/:sid', (req, res, next) => {
    var db = pgp(cs)
    id = req.params.sid;
    db.any('select * from fn_getbystopid($1)', id).then((data) => {
        res.send(data)
    })
    pgp.end();
})
//Adding the transport info
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

//Updating the transport info by route id
router.put('/transportstop/:stid',(req,res,next)=>{
    var db=pgp(cs)
    id=req.params.stid;
    name=req.body.stname;
    details=req.body.stdetails;
    chrg=req.body.stchrg;
    routid=req.body.stroutid;
db.any('select * from fn_updbystopid($1,$2,$3,$4,$5)',[id,name,details,chrg,routid]).then(()=>{
        res.send("Updated Successfully")
    })
    pgp.end();
})
//get by user id in userbranch table

router.get('/userbranch1/:uid',(req,res,next)=>{
    var db=pgp(cs)
    id=req.params.uid;
    db.any('select * from fn_getbyuserid_userbranch($1)',id).then((data)=>{
        res.send(data)
    })
    pgp.end();
})
//get by branchid in userbranch table
router.get('/userbranch2/:brnid',(req,res,next)=>{
    var db=pgp(cs)
    id=req.params.brnid;
    db.any('select * from fn_getbybrnid_userbranch($1)',id).then((data)=>{
        res.send(data)
    })
    pgp.end();
})
//get by userid in leave master
router.get('/leaves1/:usrid',(req,res,next)=>{
    var db=pgp(cs)
    usid=req.params.usrid;
    db.any('select * from fn_getbyuserid_leaves($1)',usid).then((data)=>{
        res.send(data)
    })
    pgp.end();
})
//get by branch id in leave master
router.get('/leaves2/:brnid',(req,res,next)=>{
    var db=pgp(cs)
    bid=req.params.brnid;
    db.any('select * from fn_getleavesbybrnid($1)',bid).then((data)=>{
        res.send(data)
    })
    pgp.end();
})
//update the status of the leaves of faculty
router.put('/leaves/:usrid',(req,res,next)=>{
    var db=pgp(cs)
    usid=req.params.usrid;
    stat=req.body.sta;
db.any('select * from fn_updbyuserid_leaves($1,$2)',[usid,stat]).then(()=>{
        res.send("Updated Successfully")
    })
    pgp.end();
})

//get timetable by schl id
router.get('/timetable1/:schid',(req,res,next)=>{
    var db=pgp(cs)
    sid=req.params.schid;
    db.any('select * from fn_getbyschid_timetables($1)',sid).then((data)=>{
        res.send(data)
    })
    pgp.end();
})
//get time table by brn id
router.get('/timetable2/:bid',(req,res,next)=>{
    var db=pgp(cs)
    id=req.params.bid;
    db.any('select * from fn_getbybrnidtimetables($1)',id).then((data)=>{
        res.send(data)
    })
    pgp.end();
})
//get time table by class id
router.get('/timetable3/:classid',(req,res,next)=>{
    var db=pgp(cs)
    cid=req.params.classid;
    db.any('select * from fn_get_timetablebyclass($1)',cid).then((data)=>{
        res.send(data)
    })
    pgp.end();
})
//adding time table 
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
    router.put('timetable/:brnid',(req,res,next)=>{
        var db=pgp(cs)
        sid=req.params.schid;
        bid=req.body.brnid;
        type=req.body.ttype;
        turl=req.body.tturl;
        re=req.body.rem;
        db.any('select * from fn_updbybrnid_timetables($1,$2,$3,$4,$5,$6)',[sid,bid,type,turl,re]).then(()=>{
            res.send("Updated Successfully")
        })
        pgp.end();
    })

    //get studentid using userid

    router.get('/stdparent/:usrid',(req,res,next)=>{
        var db=pgp(cs)
        uid=req.params.usrid;
        db.any('select * from fn_getbyuserid_stdprnt($1)',uid).then((data)=>{
            res.send(data);
        })
        pgp.end()
    })

    router.get('/',(req,res,next)=>{
        var db=pgp(cs)
        db.any('select * from fn_getall_studentdetails()').then((data)=>{
            res.send(data)
        })
        pgp.end()
    })

    router.post('/',(req,res,next) => {
        var db=pgp(cs)
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
    // to return school_branch get all details
router.get('/schbrn', (req, res, next) => {
    var db = pgp(cs);


    db.any(' select * from fn_getall_schoolbranch()').then((data) => {
        res.send(data)
    })
    pgp.end();
})


//to return school get by id
router.get('/schbrn/branch/:brnid', (req, res, next) => {

    var db = pgp(cs);

    var i = (req.params.brnid);

    db.any(' select * from fn_getbyid_schoolbranch($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})

//to return all branch get by schoolbranch_id
router.get('/schbrn/:brnschid', (req, res, next) => {

    var db = pgp(cs);

    var i = (req.params.brnschid);

    db.any(' select * from fn_getbybrnschid_schoolbranch($1)', i).then((data) => {
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
router.put('/schbrn/:brnid', (req, res, next) => {

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


    db.any("select * from fn_update_schoolbranch ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
        [i, fnm, lnm, sch, cun, st, cty, adl, con1, con2, dat, stu, img])
        .then(() => {
            res.send({ "message": "update is sucesss" });
        })
    pgp.end();
})

// to get all businfo  details 
router.get('/bus', (req, res, next) => {
    var db = pgp(cs);

    db.any('select * from fn_getall_businfo()').then((data) => {
        res.send(data)
    })
    pgp.end();
})



//to get businfo details by busid 
router.get('/bus/:bid', (req, res, next) => {

    var db = pgp(cs);
    var i = (req.params.bid);
    db.any(' select * from fn_getbyid_businfo($1)', i).then((data) => {
        res.send(data);
    })
    pgp.end();
})

//to get businfo details by bus_brnid 
router.get('/bus/branch/:busbrnid', (req, res, next) => {

    var db = pgp(cs);
    var i = (req.params.busbrnid);
    db.any(' select * from fn_getbybusbrnid_businfo($1)', i).then((data) => {
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


    db.none("select * from fn_updatebybusid_businfo($1,$2,$3,$4)", [i, brid, reg, dec]).then(() => {
        res.send({ "message": "update is sucesss" });
    })
    pgp.end();
})

//to update the businfo by bus_branchid

router.put('bus/busbranch/:busbrnid', (req, res, next) => {
    var db = pgp(cs);

    var i = (req.params.busbnrid);



    var reg = req.body.busregnum;
    var dec = req.body.busdescription;


    db.none("select * from fn_updatebybusbrnid_businfo ($1,$2,$3)", [i, reg, dec]).then(() => {
        res.send({ "message": "update is sucesss" });
    })
    pgp.end();
})



// updating holiday details by using hldyshlid //

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
// retrieving holiday details by using hldybrnid //

router.get('/holiday/branch/:hldybrnid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.hldybrnid;
    db.any('select * from fn_getbyhldybranchid_holiday($1)', [i]).then((data) => {
        res.send(data);
    })
    pgp.end()
}) 
// retrieving holiday details by using hldyshlid //

router.get('/holiday/school/:hldyshlid', (req, res, next) => {
    var db = pgp(cs);
    var i = req.params.hldyshlid;
    db.any('select * from fn_getbyhldyschoolid_holiday($1)', [i]).then((data) => {
        res.send(data);
    })
    pgp.end()
})

/* *****************************team4 end***************************************************/
module.exports = router;