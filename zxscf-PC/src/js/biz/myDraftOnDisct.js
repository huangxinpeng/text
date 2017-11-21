/*
 * @Author: chengdan 
 * @Date: 2017-09-06 17:04:23 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 15:53:22
 */
define([
    'jquery',
    'bootstrap',
    'datepicker',
    'datepicker_zh',
    'json',
    'bootstrapValidator',
    'global',
    'router',
    'routerConfig',
    'config',
    'regular',
    'ajax',
    'common',
    'constant',
    'myDraftDisctDtl',
    'text!tpls/myDraftOnDisct.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant, myDraftDisctDtl,
    myDraftOnDisctTpl, footer) {
    return function() {
        var $myDraftOnDisctTpl = $(myDraftOnDisctTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftOnDisctTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化日期插件
            dataPiker();

            //初始化查询content
            initQueryContent();

            //初始化取消成功
            $(".cancelSucc").css("display", "none");

            //初始化分页控件
            initPageComponent(loadData);

            //初始化页面
            initPage(2);

            var obj = {};
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize });

            function loadData() {
                obj = $.extend(obj, getPageInfo());
                if (checkQuery(obj)) {
                    $(window).IFSAjax({
                        code: "0010_320004",
                        method: "POST",
                        data: $.extend(obj, {}),
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                successFun(result.data);
                            } else {
                                pluginObj.alert(result.message);
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                }
            }
            loadData();

            function successFun(data) {
                $("#sum").text(IFSCommonMethod.formatMoney(data.sum));
                $("#rateSum").text(IFSCommonMethod.formatMoney(data.rateSum));
                setTotalPage(data.lists.total, obj.pageNum, obj.pageSize);
                var objStr = "";
                if (IFSCommonMethod.isNotBlank(data.lists.list)) {
                    var stat = { "01": "yellow", "02": "green", "04": "green", "10": "blue", "11": "green", "13": "green" };
                    var action = { "01": "取消", "02": "查看", "04": "查看", "10": "撤回", "11": "查看", "13": "查看" };
                    for (var i = 0; i < data.lists.list.length; i++) {
                        var drftInfo = data.lists.list[i];
                        objStr += "<tr><td hidden>" + drftInfo.id + "</td>" +
                            "<td>" + IFSCommonMethod.formatDate(drftInfo.txnDt, "yyyy-MM-dd") + "</td>" +
                            "<td>" + drftInfo.srcDrftNo + "</td>" +
                            "<td>" + IFSCommonMethod.formatMoney(drftInfo.disctAmt) + "</td>" +
                            "<td>" + drftInfo.txnStat + "</td>" +
                            "<td><a class='" + stat[drftInfo.txnStat] + "'>" + action[drftInfo.txnStat] + "</a></td>" +
                            "</tr>";
                    }
                    $(".contentMain table tbody").html(objStr);
                    $("#noDataTip").css("display", "none");
                } else {
                    $(".contentMain table tbody").empty();
                    $("#noDataTip").css("display", "block");
                }
                initClick();
                initLinkClick();
                //数据字典
                renderDataDic();
            }

            $("#queryDisct").on("click", function() {
                //获取查询条件
                obj = $.extend(obj, $("#queryData").getData());
                obj.startDate = IFSCommonMethod.formatStartDate(obj.startDate);
                obj.endDate = IFSCommonMethod.formatEndDate(obj.endDate);
                obj.pageNum = 1; //查询条件变化时，pageNum强制变更为1
                $("#pageIndex").text(1);
                loadData();
            });

            //初始化行点击
            function initClick() {
                $(".contentMain table tbody tr").each(function() {
                    $(this).css("cursor", "pointer");
                    var stat = $(this).children().eq(4).text();
                    if (stat == "01" || stat == "10") {
                        $(this).find("a").parent("td").siblings().on("click", function() {
                            require("myDraftDisctDtl")(1, $(this).parents("tr").children().eq(0).text());
                        });
                    } else {
                        $(this).on("click", function() {
                            require("myDraftDisctDtl")(1, $(this).children().eq(0).text());
                        });
                    }
                });
            }

            //初始化a点击
            function initLinkClick() {
                //待复核-取消
                $(".yellow").on("click", function() {
                    var id = $(this).parents("tr").children().eq(0).text();
                    pluginObj.confirm("取消确认", "确认要取消？", function() {
                        cancel(id);
                    }, function() {});
                });

                //待签收-撤回
                $(".blue").on("click", function() {
                    $("#disctRetractConfirm").modal("show");
                    $("#smsCode").val("");
                    $("#drftNo").text($(this).parents("tr").children().eq(2).text());
                    $("#disctAmt").text($(this).parents("tr").children().eq(3).text());
                    $("#id").text($(this).parents("tr").children().eq(0).text());
                })
            }

            function cancel(id) {
                $(window).IFSAjax({
                    code: "0010_320006",
                    method: "POST",
                    data: { "id": id },
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            initCanlPage($("#gConfirmModal"), $(".cancelSucc"), $("#myDraftDisct"), 3, $("#queryOnDisct"));
                        } else {
                            pluginObj.alert(result.message);
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            //获取短信验证码
            $("#sendSmsCode").on("click", function() {
                getSMSCode($(this), "0010_110005", { bussType: 'RZ10' });
            })

            //融资撤回
            $("#retractBtn").on("click", function() {
                var id = $("#id").text();
                var smsCode = $("#smsCode").val();
                if (!IFSCommonMethod.isNotBlank(smsCode)) {
                    pluginObj.alert("请输入短信验证码");
                } else {
                    $(window).IFSAjax({
                        code: "0010_320007",
                        method: "POST",
                        data: { "id": id, "smsCode": smsCode },
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                initSuccPage($("#disctRetractConfirm"), 2, $("#drftNo").text(), $("#disctAmt").text(), null, 3);
                            } else {
                                pluginObj.alert(result.message);
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                }
            })

            //返回上一页
            $("#returnBtn").on("click", function() {
                $("#myDraftDisct").trigger("click");
            });

            //跳转到融资页面
            $("#successReturn").on("click", function() {
                $("#myDraftDisct").trigger("click");
                $("#queryOnDisct").trigger("click");
            });
        });

    }
});