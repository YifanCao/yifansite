var express = require('express');
var router = express.Router();
var paintings = require("../api/paintings");
var mainpagepaintings = require("../api/mainpagepaintings");

/* GET /api/paintings listing. */
router.use('/paintings', paintings);

/* GET /api/mainpagepaintings listing. */
router.use('/mainpagepaintings', mainpagepaintings);

module.exports = router;