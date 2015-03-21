var express = require('express');
var router = express.Router();

/* GET /api/checkadmin authentication. */
router.get('/', function(req, res, next) {
	res.send("false");
});

module.exports = router;