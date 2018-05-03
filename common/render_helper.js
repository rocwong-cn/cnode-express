/*!
 * nodeclub - common/render_helpers.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var MarkdownIt = require('markdown-it');
var _ = require('lodash');
var config = require('../config');
var validator = require('validator');
var jsxss = require('xss');
var multiline = require('multiline');
var moment = require('moment');


// Set default options
var md = new MarkdownIt();

md.set({
    html: false,        // Enable HTML tags in source
    xhtmlOut: false,        // Use '/' to close single tags (<br />)
    breaks: false,        // Convert '\n' in paragraphs into <br>
    linkify: true,        // Autoconvert URL-like text to links
    typographer: true,        // Enable smartypants and other sweet transforms
});

md.renderer.rules.fence = function (tokens, idx) {
    var token = tokens[idx];
    var language = token.info && ('language-' + token.info) || '';
    language = validator.escape(language);

    return '<pre class="prettyprint ' + language + '">'
        + '<code>' + validator.escape(token.content) + '</code>'
        + '</pre>';
};

md.renderer.rules.code_block = function (tokens, idx /*, options*/) {
    var token = tokens[idx];

    return '<pre class="prettyprint">'
        + '<code>' + validator.escape(token.content) + '</code>'
        + '</pre>';
};

var myxss = new jsxss.FilterXSS({
    onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
        // 让 prettyprint 可以工作
        if (tag === 'pre' && name === 'class') {
            return name + '="' + jsxss.escapeAttrValue(value) + '"';
        }
    }
});

exports.markdown = function (text) {
    return myxss.process(md.render(text || ''));
};

exports.escapeSignature = function (signature) {
    return signature.split('\n').map(function (p) {
        return _.escape(p);
    }).join('<br>');
};

exports.staticFile = function (filePath) {
    if (filePath.indexOf('http') === 0 || filePath.indexOf('//') === 0) {
        return filePath;
    }
    return config.site_static_host + filePath;
};

exports.tabName = function (tab) {
    var pair = _.find(config.tabs, function (pair) {
        return pair[0] === tab;
    });
    if (pair) {
        return pair[1];
    }
};

exports.proxy = function (url) {
    return url;
    // 当 google 和 github 封锁严重时，则需要通过服务器代理访问它们的静态资源
    // return '/agent?url=' + encodeURIComponent(url);
};


moment.locale('zh-cn'); // 使用中文

// 格式化时间
exports.formatDate = function (date, friendly) {
    date = moment(date);
    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }

};

/**
 * 毫秒转换友好的显示格式
 * 输出格式：21小时前
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
exports.beautifyDate = function (date) {
    date = new Date(date).getTime();
    //获取js 时间戳
    var now = new Date().getTime();
    var time = parseInt((now - date ) / 1000, 10);

    //存储转换值
    var s;
    if (time < 60 * 10) {//十分钟内
        return '刚刚';
    } else if ((time < 60 * 60) && (time >= 60 * 10)) {
        //超过十分钟少于1小时
        s = Math.floor(time / 60);
        return s + "分钟前";
    } else if ((time < 60 * 60 * 24) && (time >= 60 * 60)) {
        //超过1小时少于24小时
        s = Math.floor(time / 60 / 60);
        return s + "小时前";
    } else if ((time < 60 * 60 * 24 * 30) && (time >= 60 * 60 * 24)) {
        //超过1天少于30天内
        s = Math.floor(time / 60 / 60 / 24);
        return s + "天前";
    } else if ((time < 60 * 60 * 24 * 365) && (time >= 60 * 60 * 24 * 30)) {
        //超过30天少于365天
        s = Math.floor(time / 60 / 60 / 24 / 30);
        return s + "个月前";
    } else {
        s = Math.floor(time / 60 / 60 / 24 / 365);
        return s + "年前";
    }
};


// 为了在 view 中使用
exports._ = _;
exports.multiline = multiline;
