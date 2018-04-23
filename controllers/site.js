/**
 * Created by Roc on 2018/4/20.
 * desc:
 */

var config = require('../config');

exports.index = function (req, res, next) {
    var tab = req.query.tab || 'all';
    res.render('index', { tabs: config.tabs, title: config.description, tab: tab, });
};