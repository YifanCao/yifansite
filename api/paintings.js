var express = require('express');
var router = express.Router();

/* GET /api/paintings listing. */
router.get('/', function(req, res, next) {
	var PaintingSrc = require('../models/PaintingSrc');
	PaintingSrc.find(function(err, paintings) {
		if (err) {
			return next(err);
		} else {
			res.json(paintings);
		}
	});
});

module.exports = router;