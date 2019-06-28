const request = require('request');
const authURL = 'https://murmuring-wildwood-77787.herokuapp.com'

exports.getHome = function (req, res) {
    let user = { firstName: 'Preston', lastName: 'Doris' }
    //console.log('user from cookie ', user)
    return res.render('index', { user: user });
}

exports.logout = function (req, res) {
    let expires_in = req.cookies.access_token.expires_in;
    res.cookie('access_token', { httpOnly: true, expires: expires_in });
    return res.redirect('/login');
}

exports.getLogin = function (req, res) {
    return res.render('login');
}

exports.postLogin = function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let options = {
        url: authURL + '/authenticate',
        form: {
            grant_type: 'password',
            email: email,
            password: password,
            client_id: 'client',
            client_secret: 'secret'
        }
    }

    request.post(options, function (err, response, body) {
        if (err) {
            console.log(err);
        } else {
            if (response.statusCode === 200) {
                let user = {
                    firstName: JSON.parse(body).firstName,
                    lastName: JSON.parse(body).lastName
                }
                let access_token = JSON.parse(body).access_token;
                let expires_in = new Date(Date.now() + JSON.parse(body).expires_in);
                res.cookie('access_token', access_token, { httpOnly: true, expires: expires_in });
                //res.cookie('user', user, {httpOnly: true, expires: expires_in});
                return res.redirect('/');
            } else {
                return res.redirect('/login');
            }
        }
    });
}

exports.getRegister = function (req, res) {
    return res.render('register');
}

exports.postRegister = function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let fName = req.body.fName;
    let lName = req.body.lName;
    let options = {
        url: authURL + '/register',
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
            //Put flash message to user about unknown error occurred.
            return res.redirect('/register');
        } else {
            if (response.statusCode === 200) {
                let user = {
                    firstName: JSON.parse(body).firstName,
                    lastName: JSON.parse(body).lastName
                }
                let access_token = JSON.parse(body).access_token;
                let expires_in = new Date(Date.now() + JSON.parse(body).expires_in);
                res.cookie('access_token', access_token, { httpOnly: true, expires: expires_in });
                return res.redirect('/');
            } else {
                let resBody = JSON.parse(body);
                if (response.statusCode === 401 && resBody.error === 'This email already exists in the DB') {
                    //Put flash message to user about email already in DB
                    console.log('email exists')
                    console.log(resBody.error)
                } else if (response.statusCode === 401 && resBody.error === 'Access Denied - client not authorized') {
                    //Put flash message to user about improper client authorization
                } else if (response.statusCode === 500) {
                    //Put flash message to user about Internal server error and email not added to DB
                } else if (response.statusCode === 400) {
                    //Put flash message to user about the request was not valid
                }
                return res.redirect('/register');
            }

        }
    })
}