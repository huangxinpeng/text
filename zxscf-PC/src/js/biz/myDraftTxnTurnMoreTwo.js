/*
 * @Author: chengdan 
 * @Date: 2017-09-12 17:49:46 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-07 15:13:17
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
    'require',
    'myDraftTxnTurnOne',
    'myDraftTxnTurnMoreThree',
    'text!tpls/myDraftTxnTurnMoreTwo.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant, require,
    myDraftTxnTurnOne, myDraftTxnTurnMoreThree, myDraftTxnTurnMoreTwoTpl, footer) {
    return function(drftInfo, custInfo, pageNum) {
        var $myDraftTxnTurnMoreTwoTpl = $(myDraftTxnTurnMoreTwoTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftTxnTurnMoreTwoTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            $("#two").addClass("twoStep1");
            $("#three").addClass("threeStepOrg2");
            $(".selectCust").css("display", "none");

            var obj = {};
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: 100 });

            function loadData() {
                obj = $.extend(obj, { "receiverNm": $("#receiverNm").val() });
                $(window).IFSAjax({
                    code: "0010_190001",
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
            };
            loadData();

            function successFun(data) {
                var objStr = "";
                if (IFSCommonMethod.isNotBlank(data.list)) {
                    for (var i = 0; i < data.list.length; i++) {
                        var info = data.list[i];
                        objStr += "<tr><td><span><input type='checkbox' id='" + i +
                            "'><label for='" + i + "'></label></span></td>" +
                            "<td hidden>" + info.custNo + "</td>" +
                            "<td>" + info.custCnNm + "</td>" +
                            "<td>" + info.txnCount + "</td>" +
                            "<td>" + (info.lastTxnDt == null ? "" : IFSCommonMethod.formatDate(info.lastTxnDt, "yyyy-MM-dd")) + "</td>" +
                            "</tr>";
                    }
                    $(".contentMain table tbody").html(objStr);
                    $(".contentMain table").css("display", "table");
                    $(".custNoDataTip").css("display", "none");
                } else {
                    $(".contentMain table tbody").empty();
                    $(".contentMain table").css("display", "none");
                    $(".custNoDataTip").css("display", "block");
                }

                var ids;
                if (IFSCommonMethod.isNotBlank(custInfo)) {
                    for (var i = 0; i < custInfo.length; i++) {
                        ids += custInfo[i][0] + ",";
                    }
                    ids = ids.substring(0, ids.length - 1);
                }
                custInfo = null;
                initCheckBoxComponent(ids, 2, null);
                initModal();
            }

            //查询企业
            $("#queryCustInfo").on("click", function() {
                loadData();
            });

            //初始化modal
            function initModal() {
                $(".modal-footer").css("display", "none");
            }

            $("#search").on("click", function() {
                var custName = $("#custName").val();
                if (!IFSCommonMethod.isNotBlank(custName)) {
                    pluginObj.alert("请输入企业完整名称");
                    return;
                } else {
                    $(window).IFSAjax({
                        code: "0010_190002",
                        method: "POST",
                        data: { "custName": custName },
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                if (!IFSCommonMethod.isNotBlank(result.data.total) || result.data.total == 0) {
                                    $(".modal-footer").css("display", "block");
                                    $("#srchResult").css("display", "none");
                                    $("#emptyPop").css("display", "block");
                                } else {
                                    $(".modal-footer").css("display", "block");
                                    $("#srchResult").css("display", "block");
                                    $("#emptyPop").css("display", "none");
                                    loadResult(result.data);
                                }
                            } else {
                                pluginObj.alert(result.message);
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                }
            });

            function loadResult(data) {
                var partner = data.list[0];
                var objStr = "<i hidden>" + partner.custNo + "</i>" +
                    "<i>" + partner.custCnNm + "</i>" +
                    "<span class='radiusAddBtn'>+</span>";
                $("#srchResult li").empty().html(objStr);
                initradiusAddBtn();
            }

            //新增交易对手
            function initradiusAddBtn() {
                $(".radiusAddBtn").on("click", function() {
                    var custNo = $("#srchResult li").children().eq(0).text();
                    $(window).IFSAjax({
                        code: "0010_190003",
                        method: "POST",
                        data: { "custNo": custNo },
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                $("#custName").val("");
                                $("#addOpponent").modal("hide");
                                $("#receiverNm").val($("#srchResult li").children().eq(1).text());
                                loadData();
                            } else {
                                pluginObj.alert(result.message);
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });

                });
            }

            //上一步
            $("#preStep").on("click", function() {
                require("myDraftTxnTurnOne")(2, drftInfo, pageNum);
            });

            //下一步
            $("#nextStep").on("click", function() {
                if (!isChecked()) {
                    pluginObj.alert("请先选择一个供应商!");
                } else {
                    myDraftTxnTurnMoreThree(drftInfo, getCheckedInfo(), pageNum);
                }
            });
        });
    }
});