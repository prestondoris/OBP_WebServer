const express           = require('express');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const request           = require('request');


const app = express()
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    return res.render('index');
});

app.get('/login', function(req, res) {
    return res.render('login');
});

app.get('/register', function(req, res) {
    return res.render('register');
});


function beforeRequest(req, res, next) {
    if (!req.cookies.access_token) {
        return res.redirect('/login');
    } else {
        next()
    }
}

app.listen(4080, function(){
    console.log('Server is Listening on port 4080');
})
