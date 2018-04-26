var express = require('express');
var router = express.Router();
var config = require('../config');
var site = require('../controllers/site');
var topic = require('../controllers/topic');

/* GET home page. */
router.get('/', site.index);
router.get('/topic/:tid', topic.detail);  // 显示某个话题

module.exports = router;
