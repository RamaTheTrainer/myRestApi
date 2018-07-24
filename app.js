var express = require('express');
var app = express();

var express = require('express');
var app = express();

var classroute = require('./routes/class')
var school = require('./routes/school')
var role = require('./routes/role')
var staff = require('./routes/staff')
var subject = require('./routes/subject')
var user = require('./routes/user')


app.use('/class', classroute);
app.use('/role', role);
app.use('/school', school);
app.use('/staff', staff);
app.use('/subject', subject);
app.use('/user', user);



app.set('port',process.env.PORT|| 4500)

app.listen(app.get('port'),(err)=>{
    if(err)
    {console.log('Server Can not Start ....')}
    else
    {
        console.log('Server Started http://localhost:'+app.get('port'));
    }
})


