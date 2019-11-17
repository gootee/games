var express = require('express');
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res) {
//   res.render('/games/index', { title: 'Games' });
// });

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Games' });
});

module.exports = router;
