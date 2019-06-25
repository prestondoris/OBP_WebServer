const express           = require('express');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const request           = require('request');


const app = express()
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/public'));


app.get('/', beforeRequest, function(req, res) {
    let user = req.cookies.user
    return res.render('index', {user: user});
});

app.get('/login', function(req, res) {
    return res.render('login');
});

app.post('/login', function(req, res){
    let email = req.body.email;
    let password = req.body.password;
    let options = {
        url: 'http://localhost:8080/authenticate',
        form: {
            grant_type: 'password',
            email: email,
            password: password,
            client_id: 'client',
            client_secret: 'secret'
        }
    }

    request.post(options, function(err, response, body) {
        if (err) {
            console.log(err);
        } else {
            if (response.statusCode === 200) {
                let user = {
                    firstName: JSON.parse(body).firstName,
                    lastName: JSON.parse(body).lastName
                }
                console.log(JSON.parse(body))
                let access_token = JSON.parse(body).access_token;
                let expires_in = new Date(Date.now() + JSON.parse(body).expires_in);
                res.cookie('access_token', access_token, { httpOnly: true, expires: expires_in });
                res.cookie('user', user, {httpOnly: true, expires: expires_in});
                return res.redirect('/');
            } else {
                return res.redirect('/login');
            }
        }
    });
});


app.get('/logout', function(req, res){
    let expires_in = req.cookies.access_token.expires_in;
    res.cookie('access_token', { httpOnly: true, expires: expires_in });
    return res.redirect('/login');
})

app.get('/register', function(req, res) {
    return res.render('register');
});

app.post('/register', function(req,res){
    let email = req.body.email;
    let password = req.body.password;
    let fName = req.body.fName;
    let lName = req.body.lName;
    let options = {
        url: 'http://localhost:8080/register',
        form: {
            grant_type: 'password',
            email: email,
            password: password,
            fName: fName,
            lName: lName,
            client_id: 'client',
            client_secret: 'secret'
        }
    }

    request.post(options, function (err, response, body) {
        if (err) {
            console.log(err);
        } else {
            if(response.statusCode === 200) {
                console.log(response.statusCode);
                console.log(response.statusMessage);
                let user = {
                    firstName: JSON.parse(body).firstName,
                    lastName: JSON.parse(body).lastName
                }
                console.log(JSON.parse(body))
                let access_token = JSON.parse(body).access_token;
                let expires_in = new Date(Date.now() + JSON.parse(body).expires_in);
                res.cookie('access_token', access_token, { httpOnly: true, expires: expires_in });
                return res.redirect('/');
            } else {
                return res.redirect('/register');
            }

        }
    })
})


function beforeRequest(req, res, next) {
    if (!req.cookies.access_token) {
        return res.redirect('/login');
    } else {
        
        next()
    }
}

app.listen(4000, function(){
    console.log('Server is Listening on port 4000');
})
