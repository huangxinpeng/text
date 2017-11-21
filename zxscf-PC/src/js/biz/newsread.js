/*
 * @Author: chengdan 
 * @Date: 2017-08-31 10:34:23 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 15:54:09
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
    'draftSignDtl',
    'draftDisctDtl',
    'text!tpls/newsRead.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftSignDtl, draftDisctDtl, newsReadTpl, footer) {
    return function() {
        var $newsReadTpl = $(newsReadTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($newsReadTpl);
        $('.content').append($footer);

        $(document).ready(function() {
            //初始化分页控件
            initPageComponent(loadData);

            var obj = {}; //查询条件
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, readFlag: "2" });
            loadData(); //默认加载全部数据
            //加载默认数据
            function loadData() {
                //获取page数据
                obj = $.extend(obj, getPageInfo());
                obj.readFlag = $("#cardType").val();

                $(window).IFSAjax({
                    code: "0010_220001",
                    method: "POST",
                    data: $.extend(obj, {}),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            renderInfo(result.data);
                            getUnrdMsgCount();
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderInfo(data) {
                setTotalPage(data.total, obj.pageNum, obj.pageSize);
                if (IFSCommonMethod.isNotBlank(data.list)) {
                    $("#noDataTip").hide();
                    var html = [];
                    var data = data.list;
                    var read = "";
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].flag == "1") {
                            read = "noLink";
                        } else {
                            read = "link";
                        }
                        html.push('<ul data-id="' + data[i].imId + '" class="clearfix news-item' + read + '"><span class="defRadio"><input type="checkbox" id="check' + i + '" name="msg"><label for="check' + i + '"></label></span>\
                            <li class="fl"><b></b><span class="biz-type" dic-type="201">' + data[i].bussType + '</span><span>' + IFSCommonMethod.str2Date(data[i].expireDt) + '</span><span class="title">' + data[i].imSubject + '</span></li>\
                            <li class="fr">' + IFSCommonMethod.str2Date(data[i].crtTs) + '<i></i></li>\                        </ul>');
                    }
                    $("#newsList").empty().append(html.join(""));
                    renderDataDic();
                } else {
                    $("#newsList").empty();
                    $("#noDataTip").show();
                }
            }
            $("#cardType").change(function() {
                //获取查询条件
                obj.readFlag = $("#cardType").val();
                obj.pageNum = 1; //查询条件变化时，pageNum强制变更为1
                $("#pageIndex").html("1");
                loadData();
            });

            //删除消息
            $("#newsList").on("click", ".fr i", function() {
                    obj.msgList = [];
                    obj.msgList.push($(this).closest("ul").attr("data-id"));
                    pluginObj.confirm("确认要删除消息？", "数据删除后不可恢复", function() {
                        $(window).IFSAjax({
                            code: "0010_220003",
                            method: "POST",
                            data: $.extend(obj, {}),
                            complete: function(result) {
                                if (result.code == IFSConfig.resultCode) {
                                    pluginObj.alert("消息已删除");
                                    loadData();
                                    getUnrdMsgCount();
                                } else {
                                    pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                                }
                            },
                            error: function(status, XMLHttpRequest) {}
                        });
                    }, function() {})
                })
                //删除单个或多个
            $(".newsReadSel .btn").click(function() {
                var items = $("input:checked");
                obj.msgList = [];
                if (items && items.length > 0) {
                    items.each(function() {
                        obj.msgList.push($(this).closest("ul").attr("data-id"))
                    })
                    $(window).IFSAjax({
                        code: "0010_220003",
                        method: "POST",
                        data: $.extend(obj, {}),
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                pluginObj.alert("消息已删除");
                                loadData();
                                getUnrdMsgCount();
                            } else {
                                pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                } else {
                    pluginObj.alert("未选中消息");
                }
            });
            //标记为已读
            $(".newsMark .btn").click(function() {
                var items = $(".link input:checked");
                obj.msgList = [];
                if (items && items.length > 0) {
                    items.each(function() {
                        obj.msgList.push($(this).closest("ul").attr("data-id"));
                    });
                    $(window).IFSAjax({
                        code: "0010_220002",
                        method: "POST",
                        data: $.extend(obj, {}),
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                pluginObj.alert("消息已标记为已读");
                                loadData();
                                getUnrdMsgCount();
                            } else {
                                pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                } else {
                    pluginObj.alert("未选中未读消息");
                }
            });


            function getUnrdMsgCount() {
                obj = { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, readFlag: "0" };
                $(window).IFSAjax({
                    code: "0010_220001",
                    method: "POST",
                    data: $.extend(obj, {}),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            if (result.data.total > 0) {
                                $(".news-warning").find("i").show().html(result.data.total);
                            }
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }


        });

    }


});