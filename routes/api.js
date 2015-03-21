var express = require('express');
var router = express.Router();
var paintings = require("../api/paintings");
var mainpagepaintings = require("../api/mainpagepaintings");
var checkadmin = require("../api/checkadmin");

/* GET /api/paintings listing. */
router.use('/paintings', paintings);

/* GET /api/mainpagepaintings listing. */
router.use('/mainpagepaintings', mainpagepaintings);

/* GET /api/checkadmin user authentication. */
router.use('/checkadmin', checkadmin);

module.exports = router;