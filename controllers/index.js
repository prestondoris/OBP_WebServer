const express = require('express');
const helpers = require('../helpers/index');
const middleware = require('../middleware')
const router = express.Router();

router.route('/')
    .get(middleware.beforeRequest, helpers.getHome)

router.route('/logout')
    .get(helpers.logout)

router.route('/login')
    .get(helpers.getLogin)
    .post(helpers.postLogin)

router.route('/register')
    .get(helpers.getRegister)
    .post(helpers.postRegister)

module.exports = router