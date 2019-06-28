const express           = require('express');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const indexRoutes       = require('./controllers/index');

const app = express()

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(indexRoutes)


app.listen(4000, function(){
    console.log('Server is Listening on port 4000');
})
