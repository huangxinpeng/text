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
    'draftTxnDtl',
    'draftDisctDtl',
    'index',
    'text!tpls/myTask.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftSignDtl, draftTxnDtl, draftDisctDtl, index, myTaskTpl, footer) {
    return function(bqno) {
        var $myTaskTpl = $(myTaskTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myTaskTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //获取任务数
            renderTask();
            //根据企业是否签约来显示页面
            if ($("#isRegister").text() == 1) {
                $("#signAndTask").css("display", "block");
                $("#unsigned").css("display", "none");
                //签收
                $("#draftSign").length > 0 ? getSignInfo() :
                    $("#signList").siblings(".nodata-tip").text("您没有宝券签收的权限！");
                //转让
                $("#draftTxn").length > 0 ? getTxnInfo() :
                    $("#txnList").siblings(".nodata-tip").text("您没有宝券转让的权限！");
                //融资
                $("#draftDisct").length > 0 ? getDisctInfo() :
                    $("#disctList").siblings(".nodata-tip").text("您没有宝券融资的权限！");
            } else {
                $("#signAndTask").css("display", "none");
                $("#unsigned").css("display", "show");
            }
            //查看更多
            $("#moreBtn").on("click", function() {
                $("#draftSign").trigger("click");
            });
            $("#moreBtnSec").on("click", function() {
                $("#draftTxn").trigger("click");
            });
            $("#moreBtnThi").on("click", function() {
                $("#draftDisct").trigger("click");
            });
            //点击工作台中.mytaskContent来跳转到对应的签收、转让、融资页面去
            $(".myTask").on("click", ".myTaskContent", function() {
                var workbenchTitle = $(this).parent().siblings(".myTaskTitle").find("h2").html();
                var id = $(this).attr("data-id");
                if (workbenchTitle == "宝券签收") {
                    draftSignDtl(id);
                } else if (workbenchTitle == "转让复核") {
                    draftTxnDtl(id);
                } else if (workbenchTitle == "融资复核") {
                    draftDisctDtl(id);
                }
            });

            function getSignInfo() {
                $(window).IFSAjax({
                    code: "0010_800002",
                    method: "POST",
                    data: { pageNum: IFSConfig.pageNum, pageSize: 5 },
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            renderSignList(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderSignList(data) {
                $("#signCount").html(data.lists.total);
                if (data.lists.list && data.lists.list.length > 0) {
                    $("#point").show().attr("data-nomsg", "1");
                    $("#signList").siblings(".nodata-tip").hide();
                    $("#signList").siblings(".myTaskMore").show();
                    var html = [];
                    var data = data.lists.list;
                    var length = Math.min(3, data.length);
                    for (var i = 0; i < length; i++) {
                        html.push('<div data-id="' + data[i].id + '" class="myTaskContent">\
                        <span>待签收</span>\
                        <p>您有' + IFSCommonMethod.formatMoney(data[i].txnAmt) + '元宝券待签收。</p>\
                        <div><i></i>' + IFSCommonMethod.str2Date(data[i].srcDueDt) + '</div>\
                    </div>');
                    }
                    $("#signList").empty().append(html.join(""));
                } else {
                    $("#signList").siblings(".nodata-tip").text("您暂时没有宝券签收任务！");
                }
            }

            function getTxnInfo() {
                $(window).IFSAjax({
                    code: "0010_810001",
                    method: "POST",
                    data: { pageNum: IFSConfig.pageNum, pageSize: 5 },
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            renderTxnList(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderTxnList(data) {
                $("#txnCount").html(data.lists.total);
                if (data.lists.list && data.lists.list.length > 0) {
                    $("#point").show().attr("data-nomsg", "1");;
                    $("#txnList").siblings(".nodata-tip").hide();
                    $("#txnList").siblings(".myTaskMore").show();
                    var html = [];
                    var data = data.lists.list;
                    var length = Math.min(3, data.length);
                    for (var i = 0; i < length; i++) {
                        if (data[i].txnStat == "01") {
                            html.push('<div data-id="' + data[i].id + '" class="myTaskContent">\
                                <span class="transferReview">转让待复核</span>\
                                <p>您有' + IFSCommonMethod.formatMoney(data[i].txnAmt) + '元宝券转让待复核。</p>\
                                <div><i></i>' + IFSCommonMethod.str2Date(data[i].dueDt) + '</div>\
                            </div>');
                        } else if (data[i].txnStat == "04") {
                            html.push('<div data-id="' + data[i].id + '" class="myTaskContent">\
                                <span class="myTastTit">转让撤销待复核</span>\
                                <p>您有' + IFSCommonMethod.formatMoney(data[i].txnAmt) + '元宝券转让撤销待复核。</p>\
                                <div><i></i>' + IFSCommonMethod.str2Date(data[i].dueDt) + '</div>\
                            </div>');
                        }
                    }
                    $("#txnList").empty().append(html.join(""));
                } else {
                    $("#txnList").siblings(".nodata-tip").text("您暂时没有宝券转让任务！");
                }
            }

            function getDisctInfo() {
                $(window).IFSAjax({
                    code: "0010_820001",
                    method: "POST",
                    data: { pageNum: IFSConfig.pageNum, pageSize: 5 },
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            renderDisctList(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderDisctList(data) {
                $("#disctCount").html(data.lists.total);
                if (data.lists.list && data.lists.list.length > 0) {
                    $("#point").show().attr("data-nomsg", "1");;
                    $("#disctList").siblings(".nodata-tip").hide();
                    $("#disctList").siblings(".myTaskMore").show();
                    var html = [];
                    var data = data.lists.list;
                    var length = Math.min(3, data.length);
                    for (var i = 0; i < length; i++) {
                        if (data[i].txnStat == "01") {
                            html.push('<div data-id="' + data[i].id + '" class="myTaskContent">\
                                <span class="transferReview">融资待复核</span>\
                                <p>您有' + IFSCommonMethod.formatMoney(data[i].disctAmt) + '元宝券融资待复核。</p>\
                                <div><i></i>' + IFSCommonMethod.str2Date(data[i].dueDt) + '</div>\
                            </div>');
                        } else if (data[i].txnStat == "04") {
                            html.push('<div data-id="' + data[i].id + '" class="myTaskContent">\
                                <span class="myTaskTitleL">融资撤销待复核</span>\
                                <p>您有' + IFSCommonMethod.formatMoney(data[i].disctAmt) + '元宝券融资撤销待复核。</p>\
                                <div><i></i>' + IFSCommonMethod.str2Date(data[i].dueDt) + '</div>\
                            </div>');
                        }
                    }
                    $("#disctList").empty().append(html.join(""));
                } else {
                    $("#disctList").siblings(".nodata-tip").text("您暂时没有宝券融资任务！");
                }
            }
        });
    }
});