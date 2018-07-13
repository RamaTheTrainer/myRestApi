var express = require('express');
var app = express();
app.set('port',process.env.PORT|| 4500)



app.listen(app.get('port'),(err)=>{
    if(err)
    {console.log('Server Can not Start ....')}
    else
    {
        console.log('Server Started ..http://localhost:'+app.get('port'));
    }
})