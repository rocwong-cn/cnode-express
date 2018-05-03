# cnodejs-express
> Use express to rewrite cnodejs.org, my practice project .

## 学习总结
### ejs
* 如何在express 4.x中使用ejs ？
 ```
 express testEjs -e
 ```
 * ejs的标签模板：
 ```
 <% %>流程控制标签
 <%= %>输出标签（原文输出HTML标签）
 <%- %>输出标签（HTML会被浏览器解析）
 <%# %>注释标签
 % 对标记进行转义
 -%>去掉没用的空格
 说明：ejs中的逻辑代码全部用JavaScript
 ```
* 组件式的ejs开发（引用外部ejs代码碎片）
```ejs
<% include ../user/card.html %>
```
即 include 后跟文件相对路径。

其他参考：[ejs模板的书写 - 简书](https://www.jianshu.com/p/67dda091fc68)

### eventproxy

EventProxy 仅仅是一个很轻量的工具，但是能够带来一种事件式编程的思维变化。有几个特点：
* 利用事件机制解耦复杂业务逻辑
* 移除被广为诟病的深度callback嵌套问题
* 将串行等待变成并行等待，提升多异步协作场景下的执行效率
* 友好的Error handling
* 无平台依赖，适合前后端，能用于浏览器和Node.js
* 兼容CMD，AMD以及CommonJS模块环境

常用的流程处理方法：
```js
    var proxy = new eventproxy();
    proxy.fail(next);
    Topic.list({ tab: tab, page: page }, proxy.done('topics', function (topics) {
        return topics;
    }));
    
    User.list({ tab: tab, page: page }, proxy.done('users', function (users) {
            return users;
        }));


    proxy.all('topics','users', function (topics,users) {
        res.render('index', {
            topics: topics,
            users: users,
        });
    });
```
此外，还有其他的异常处理和并发处理控制，更多详情请见：[EventProxy](https://www.npmjs.com/package/eventproxy)

### Loader

Node静态资源加载器。该模块通过两个步骤配合完成，代码部分根据环境生成标签。上线时，需要调用minify方法进行静态资源的合并和压缩。
一般的，会将loader配置在app.locals里面以便于在view里面调用，或者也可以在controller里面进行如下：
```
res.render(tpl, {
  Loader: require('loader')
});
```

view：
```js
<%- Loader("/assets/scripts/jqueryplugin.js", "/assets/styles/jqueryplugin.css")
  .js("/assets/scripts/lib/jquery.jmodal.js")
  .js("/assets/scripts/lib/jquery.mousewheel.js")
  .js("/assets/scripts/lib/jquery.tagsphere.js")
  .css("/assets/styles/jquery.autocomplate.css")
  .done(assetsMap, prefix, combo) %>
```