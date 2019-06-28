let middleWareObject = {
    beforeRequest: function(req, res, next) {
        if (!req.cookies.access_token) {
            return res.redirect('/login');
        } else {

            next()
        }
    }
};

module.exports = middleWareObject;

