/**
 * Created by Roc on 2018/4/23.
 * desc:
 */

var axios = require('axios');
var config = require('../config');

exports.list = function (query, callback) {
    var api = config.api_host.concat('topics?limit=50');
    if (query.page) {
        api += '&page=' + query.page;
    }
    if (query.tab) {
        api += '&tab=' + query.tab;
    }
    axios.get(api).then(function (response) {
        return callback(null,response.data.data);
    }).catch(function (error) {
        return (error);
    });
};

exports.detail = function (query, callback) {
    var api = config.api_host.concat('topic/').concat(query);
    axios.get(api).then(function (response) {
        return callback(null,response.data.data);
    }).catch(function (error) {
        return (error);
    });
};