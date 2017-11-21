/*
 * @Author: chengdan 
 * @Date: 2017-08-25 10:49:44 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 15:51:48
 */
define([
    'jquery',
    'json',
    'bootstrap',
    'bootstrapValidator',
    'global',
    'router',
    'routerConfig',
    'config',
    'regular',
    'ajax',
    'common',
    'constant',
    'text!tpls/doFeedback.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, doFeedbackTpl, footer) {
    return function() {
        var $doFeedbackTpl = $(doFeedbackTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($doFeedbackTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化分页控件
            initPageComponent(loadData);

            var obj = { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize }
            loadData();

            function loadData() {
                obj = $.extend({ pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, opinion: $("#helpC").val() }, getPageInfo());
                $(window).IFSAjax({
                    code: "0010_230001",
                    method: "POST",
                    data: $.extend(obj, {}),
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            renderList(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderList(data) {
                setTotalPage(data.total, obj.pageNum, obj.pageSize); //设置分页
                if (data.list && data.list.length > 0) {
                    $("#noDataTip").hide();
                    var list = data.list;
                    var html = [];
                    for (var i = 0; i < list.length; i++) {
                        html.push('<div class="onefeedback">\
                <span id="question" class="question">' + list[i].reqContent + '</span>\
                <span id="answer" class="answer"><span></span>' + (IFSCommonMethod.isNotBlank(list[i].ansContent) ? list[i].ansContent : "暂无回复") + '</span>\
                <span id="time" class="time">' + formatTime(list[i].lstUpdTs) + '</span>\            </div>\
                 <hr class="form-hr" />');
                    }
                    $("#feedbackList").empty().append(html.join(""));
                } else {
                    $("#feedbackList").empty();
                    $("#noDataTip").show();
                }

            }

            function formatTime(t) {
                if (t) {
                    return t.substring(0, 4) + "-" + t.substring(4, 6) + "-" + t.substring(6, 8) + "  " + t.substring(8, 10) + ":" + t.substring(10, 12) + ":" + t.substring(12, 14)
                } else {
                    return '';
                }
            }

            //帮助与反馈
            $("#helpC").on("keyup", function() {
                if (IFSCommonMethod.isNotBlank($("#helpC").val())) {
                    $(".fontTip").css("visibility", "hidden");
                } else {
                    $(".fontTip").css("visibility", "visible");
                }
            });
            $("#helpC").focus(function() {
                $("#fkerror").hide();
            });
            //提交
            $("#submit").on("click", function() {
                var result = $("#helpC").val().replace(/(^\s*)|(\s*$)/g, "");
                if (!IFSCommonMethod.isNotBlank(result)) {
                    $("#fkerror").show().html("意见不能为空");
                    //$("#helpC").focus();
                    return;
                } else if (result.length > 400) {
                    $("#fkerror").show().html("意见长度不超过400字");
                    return;
                }
                //数据提交
                $(window).IFSAjax({
                    code: "0010_230002",
                    method: "POST",
                    data: { opinion: result },
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            pluginObj.alert("反馈成功");
                            $("#fknormal").css("display", "none");
                            $("#fkerror").css("display", "none");
                            $("#fksuccess").css("display", "block");
                            $("#wtfk").html("反馈成功");
                            obj = $.extend({ pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, opinion: $("#helpC").val() });
                            loadData();
                            $("#helpC").val("");
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));

                            $("#fknormal").css("display", "none");
                            $("#fkerror").css("display", "block");
                            $("#fksuccess").css("display", "none");
                            $("#wtfk").html("反馈失败");
                        }
                        setTimeout(function() {
                            $("#fkerror").hide();
                            $("#fksuccess").hide();
                            $("#fknormal").show();
                            $("#wtfk").html("问题反馈");
                        }, 2000);
                    },
                    error: function(status, XMLHttpRequest) {}
                });

            });
        });
    }
});