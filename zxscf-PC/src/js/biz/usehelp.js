/*
 * @Author: chengdan 
 * @Date: 2017-08-25 10:49:20 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 15:55:04
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
    'text!tpls/useHelp.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, useHelpTpl, footer) {
    return function() {
        var $useHelpTpl = $(useHelpTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($useHelpTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化分页控件
            initPageComponent(getHelpInfo);

            var obj = { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize };
            getHelpInfo();

            function getHelpInfo() {
                //获取page数据
                obj = $.extend(obj, getPageInfo());
                $(window).IFSAjax({
                    code: "0010_240001",
                    method: "POST",
                    data: obj,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            renderHelpList(result.data);
                        } else {
                            pluginObj.alert("获取失败！");
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderHelpList(data) {
                setTotalPage(data.total, obj.pageNum, obj.pageSize); //设置分页
                if (IFSCommonMethod.isNotBlank(data.list)) {
                    $("#noDataTip").hide();
                    var list = data.list;
                    var html = [];
                    for (var i = 0; i < list.length; i++) {
                        html.push('<div class="onefeedback">\
                            <span id="question" class="question">' + (i + 1) + "、" + list[i].title + '</span>\
                            <span id="answer" class="answer"><span></span>' + list[i].content + '</span>\
                            <span id="time" class="time">' + formatTime(list[i].lstUpdTs) + '</span>\
                        </div>\
                        <hr class="form-hr" />');
                    }
                    $("#helpList").empty().append(html.join(""));
                } else {
                    $("#helpList").empty();
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
        });
    }
});