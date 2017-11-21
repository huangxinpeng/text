(function($) {
    'use strict';
    var IFSAjax = {
        options: {
            'method': 'POST', // 提交方式,使用配置文件的参数
            'data': "", //报文体
            'params': '', //url参数
            'url': '',
            'token': false,
            'load': false,
            'async': true,
            'download': false,
            'lock': '',
            'transcode': '', //fs交易码
            'channel': '', //fs渠道码
            'timeout': 60000,
            'show': '',
            'logLevel': 'debug',
            'errorCode': true,
            'Expect100Continue': false,
        },
        // 绑定的事件,方便扩展
        event: null,
        setOptions: function(element, option) {
            if ("undefined" == option || null == option) {

            } else {
                $(element).data("options", $.extend({}, IFSAjax.options, option));
            }
        },
        /**
         * ajax 事件 这里callback特意采用json格式，如果有需要可以在这里修改
         */
        ajaxClick: function(element) {
            // 获取当前对象
            var options = $(element).data("options");

            // 检查交易码和渠道码,如果没有,阻止提交
            if ((undefined == options.code) || ('' == options.code)) {
                alert("没有交易码和渠道码,无法提交");
                return;
            }
            // 检查交易码和渠道码,如果缺少其中之一,阻止提交
            if (options.code.split("_").length < 1 || options.code.split("_").length > 2) {
                alert("交易码格式不正确,无法提交");
                return;
            }
            var tmp = options.code.split("_");
            if (tmp.length == 1) {
                options.transcode = tmp[0];
            } else {
                options.channel = tmp[0];
                options.transcode = tmp[1];
            }
            options.url = IFSRouterMatch.match(options.code);
            if (options.url == null || options.url == undefined || options.url == "") {
                alert("交易码没有匹配到路由前置,无法提交");
                return;
            }
            IFSAjax.ajaxSend(options);
            // ajax定时任务set interval
            if ((undefined != options.interval) && ('' != options.interval)) {
                window.setInterval(function() {
                    IFSAjax.ajaxSend(options);
                }, options.interval * 1000);
            }
        },
        /**
         * 发送ajax请求
         *
         * @param options
         */
        ajaxSend: function(options) {
            if (options.data) {
                //取得重复提交验证码
                var _tn = $("#_tn").val();
                if (_tn == null || _tn == undefined) {
                    _tn = "";
                }
                //获取登录后的客户编号
                var _userId = $("#_userId").val();
                if (_userId == null || _userId == undefined) {
                    _userId = "";
                }
                var header = IFSConfig.addReqHeader(options.transcode, options.channel, _tn,
                    _userId);
                var commonPara = {
                    //交易码
                    ip: "0000",
                    vertityTyp: "0",//默认必填
                    tn: "0",//默认必填
                    chlterminaltype:"20",
                };
                commonPara.sid = 'session';//session id
                commonPara.si = options.code;//交易代码
                commonPara.sendmsgid = "P"+new Date().getTime();//流水号
                options.data = $.extend({}, header, options.data,commonPara);

                if ("POST" == options.method && typeof options.data == 'object') {
                    options.data = $.toJSON(options.data);
                }
            } else {
                if ("POST" == options.method) {
                    options.data = "{}";
                } else {
                    options.data = "";
                }
            }
            if ("GET" == options.method.toUpperCase()) {
                if (options.data) {
                    options.url += "?" + $.param(options.data);
                    options.data = "{}";
                }
                if (options.params) {
                    options.url += "&" + $.param(options.params);
                }
            }
            if (options.logLevel === "debug") {
                IFSConfig.logInfo(options.data);
            }
            $.ajax({
                type: options.method,
                url: options.url,
                dataType: 'json',
                data: options.data,
                timeout: options.timeout,
                cache: false,
                async: options.async,
                contentType: 'application/json; charset=UTF-8',
                beforeSend: function(XMLHttpRequest) {
                    if (options.load) {
                        IFSConfig.showLoadingDialog();
                    }
                    if (options.lock != "" && options.lock != null) {
                        IFSConfig.btnLock(options.lock);
                    }
                    IFSAjax.callBeforeSend(options, XMLHttpRequest);
                },
                error: function(XMLHttpRequest, status, thrownError) {
                    // if (!IFSAjax.callErrorBackFunction(options, XMLHttpRequest, status,
                    //         thrownError)) {
                    //     return;
                    // }
                    alert(status + thrownError);
                },
                success: function(msg, XMLHttpRequest, status) {
                    if (!IFSAjax.callBackFunction(options, msg)) {
                        return;
                    }
                }
            });
        },

        /**
         *
         */
        callBeforeSend: function(options, XMLHttpRequest) {
            if (options.before) {
                options.before(options, XMLHttpRequest);
            }
        },

        /**
         * ajax成功默认执行方法
         *
         */
        callBackFunction: function(options, msg) {

            if (options.lock != "" && options.lock != null) {
                IFSConfig.btnUnLock(options.lock);
            }
            if (options.load) {
                IFSConfig.cancelLoadingDialog();
            }
            if ((undefined == msg) || (null == msg)) {
                return false;
            }
            if (options.logLevel === "debug") {
                IFSConfig.logInfo(msg);
            }
            if (msg.code != null && msg.code != "" && msg.code ==
                "170003") {
                // if ("alert" == options.show) {
                //     IFSConfig.showAlert(msg.message);
                //     return false;
                // }
                // pluginObj.alert("系统未登录，请登录");
                // setTimeout(function(){
                    window.location.href = "/";
                // }, 2000);
                return false;
            }
            if (options.complete) {
                options.complete(msg);
                return false;
            }
            return true;
        },
        /**
         * 自定义错误回调
         */
        callErrorBackFunction: function(options, XMLHttpRequest, status, thrownError) {

            var errorPage = MtjDomainName + "/views/error.html";

            if (options.logLevel === "debug") {
                IFSConfig.logInfo(XMLHttpRequest);
            }
            if (options.lock != "" && options.lock != null) {
                IFSConfig.btnUnLock(options.lock);
            }
            if (status === "timeout") {
                window.location.href = errorPage;
                return false;
            }

            if (status === "error" && (XMLHttpRequest.status === 404 || XMLHttpRequest.status === 504)) {
                window.location.href = errorPage;
                return false;
            }
            if (status === "error" && XMLHttpRequest.status === 401) {
                window.location.href = errorPage;
                return false;
            }
            var flag = IFSCommonMethod.isContains(IFSConfig.speProCode, options.code); //需要特殊处理500错误的判断条件
            var backResult = {};
            try {
                backResult = JSON.parse(XMLHttpRequest.responseText);
            } catch (e) {
                window.location.href = errorPage;
                return false;
            }
            if (!flag) {
                if (status === "error" && XMLHttpRequest.status === 308) {
                    window.location.href = MtjDomainName + IFSConfig.loginPage;
                    return false;
                }
                if (status === "error" && XMLHttpRequest.status === 500) {
                    try {
                        if (backResult.code === IFSConfig.resultErrorCode) { //Exception级异常
                            IFSConfig.showAlert(backResult.resultdesc);
                        } else {
                            if (options.errorCode) {
                                if (!IFSCommonMethod.isContains(IFSConfig.speProErrorCode,
                                        backResult.code)) {
                                    IFSConfig.showAlert(backResult.resultdesc);
                                }
                            }
                        }
                    } catch (e) {
                        IFSConfig.showAlert("亲,系统开小差了,请稍后再试!");
                    }
                }
            }
            if (status === "error" && XMLHttpRequest.status === 400) {
                IFSConfig.showAlert(backResult.resultdesc);
            }
            if (options.load) {
                IFSConfig.cancelLoadingDialog();
            }
            if (options.error) {
                options.error(status, XMLHttpRequest, backResult);
                return;
            }
            return true;
        }
    };

    $.fn.IFSAjax = function(option) {
        IFSAjax.setOptions(this, option);
        IFSAjax.ajaxClick(this);
    };
    $.fn.IFSFileAjax = function(option) {
        $.ajax({
            url: option.url,
            type: 'POST',
            cache: false,
            data: $.extend(option.data,{
                "ip": "22222",
                "sendmsgid": "234567",
                "tn": "122444",
                "sid": "09876",
                "si": "12431",
                "vertityTyp": "0",
                "chlterminaltype":"20"
            }),
            processData: false,
            contentType: false,
            success: function(data) {

                try {
                    data = JSON.parse(data);
                    IFSConfig.logInfo(data);
                    if (data.code != IFSConfig.code) {
                        IFSConfig.showAlert(data);
                    } else {
                        option.complete(data);
                    }
                } catch (e) {
                    IFSConfig.showAlert("上传失败");
                }
                return false;

            },
            error: function(status, XMLHttpRequest) {
                IFSConfig.showAlert("上传失败");
                option.error(status, XMLHttpRequest);
                return false;
            }
        });
    }
}(jQuery));