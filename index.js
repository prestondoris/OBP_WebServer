const express           = require('express');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const request           = require('request');


const app = express()
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', function(req, res) {
    return res.send('Hello World');
});


app.listen(4080, function(){
    console.log('Server is Listening on port 4080');
})
