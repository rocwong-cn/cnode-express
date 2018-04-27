/**
 * Created by Roc on 2018/4/20.
 * desc:
 */

var eventproxy = require('eventproxy');
var config = require('../config');
var Topic = require('../models/topic');

exports.index = function (req, res, next) {
    var tab = req.query.tab || 'all';
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var proxy = new eventproxy();
    proxy.fail(next);
    Topic.list({ tab: tab, page: page }, proxy.done('topics', function (topics) {
        return topics;
    }));


    proxy.all('topics', function (topics) {
        res.render('index', {
            tabs: config.tabs,
            title: config.description,
            tab: tab,
            topics: topics,
            base: '/',
            current_page: page
        });
    });
};