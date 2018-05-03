/**
 * Created by Roc on 2018/4/26.
 * desc:
 */

var EventProxy = require('eventproxy');
var config = require('../config');
var Topic = require('../models/topic');
var User = require('../models/user');

exports.detail = function (req, res, next) {
    var proxy = new EventProxy();
    proxy.fail(next);

    var tid = req.params.tid;
    var username = req.query.user;
    Topic.detail(tid, proxy.done('topic_detail', function (topic) {
        return topic;
    }));
    User.detail(username, proxy.done('user_detail', function (userDetail) {
        return userDetail;
    }));
    proxy.all('topic_detail', 'user_detail', function (topic, userDetail) {
        res.render('topic/detail', {
            topic: topic,
            userDetail: userDetail,
            tabs: config.tabs
        });
    });
};