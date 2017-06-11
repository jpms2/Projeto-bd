var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/newuser', function(req, res) {
	res.render('pages/newuser', { title: 'Add New User' });
});

module.exports = router;
