var express = require('express');
var app = express();

var express = require('express');
var app = express();
var bradmin = require('./routes/bradmin')
var sadmin = require('./routes/sadmin')
var ibadmin = require('./routes/ibadmin')
var faculty = require('./routes/fauclty')
var parent = require('./routes/parent')



app.use('/bradmin', bradmin);
app.use('/sadmin', sadmin);
app.use('/faculty', faculty);
app.use('/parent', parent);
app.use('/ibadmin', ibadmin);


app.set('port',process.env.PORT|| 4500)



app.listen(app.get('port'),(err)=>{
    if(err)
    {console.log('Server Can not Start ....')}
    else
    {
        console.log('Server Started http://localhost:'+app.get('port'));
    }
})