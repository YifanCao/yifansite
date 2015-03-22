var express = require('express');
var router = express.Router();

/* GET /api/checkadmin authentication. */
router.get('/', function(req, res, next) {
	var User = require('../models/User');
	User.find({name: req.query.visitorname, role: "admin"}, function(err, users) {
		if (err) {
			res.send("false");
		} else {
			if (users.length > 0) {
				res.send("true");
			} else {
				res.send("false");
			}
		}
	});
});

module.exports = router;