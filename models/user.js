
/**
 * Created by Roc on 2018/4/23.
 * desc:
 */

var axios = require('axios');
var config = require('../config');

/**
 * 用户详情
 * @param userName
 * @param callback
 */
exports.detail = function (userName, callback) {
    var api = config.api_host.concat('user/').concat(userName);
    axios.get(api).then(function (response) {
        return callback(null,response.data.data);
    }).catch(function (error) {
        return (error);
    });
};