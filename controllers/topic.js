/**
 * Created by Roc on 2018/4/26.
 * desc:
 */

var EventProxy = require('eventproxy');
var config = require('../config');
var Topic = require('../models/topic');

exports.detail = function (req, res, next) {
    var proxy = new EventProxy();
    proxy.fail(next);

    var tid = req.params.tid;
    Topic.detail(tid, proxy.done('topic_detail', function (topic) {
        return topic;
    }));

    proxy.all('topic_detail', function (topic) {
        res.render('topic/detail', {
            topic: topic,
            tabs: config.tabs
        });
    });
};