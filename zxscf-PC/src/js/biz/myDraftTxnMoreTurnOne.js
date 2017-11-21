/*
 * @Author: chengdan 
 * @Date: 2017-09-15 15:10:05 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-15 11:33:12
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
    'myDraftTxnMoreTurnTwo',
    'text!tpls/myDraftTxnMoreTurnOne.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant, myDraftTxnMoreTurnTwo,
    myDraftTxnMoreTurnOneTpl, footer) {
    return function(custInfo) {
        var $myDraftTxnMoreTurnOneTpl = $(myDraftTxnMoreTurnOneTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftTxnMoreTurnOneTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            $("#one").addClass("oneStep3");
            $("#two").addClass("twoStepOrg3");

            //查询可用金额
            function queryValidAmt() {
                $(window).IFSAjax({
                    code: "0010_310001",
                    method: "POST",
                    data: {},
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            $("#validAmt").text(IFSCommonMethod.formatMoney(result.data == null ? 0 : result.data));
                        } else {
                            pluginObj.alert(result.message);
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            queryValidAmt();

            var selectedPartner;
            if (IFSCommonMethod.isNotBlank(custInfo)) {
                selectedPartner = custInfo[0] + "," + custInfo[1]
                $("#txnAmt").val(IFSCommonMethod.formatMoney(custInfo[2]));
                $("#txnComment").val(custInfo[3]);
                custInfo = null;
            }

            //查询交易对手
            function queryPartner(selectedPartner) {
                $(window).IFSAjax({
                    code: "0010_190001",
                    method: "POST",
                    data: {},
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            loadPartner(result.data, selectedPartner);
                        } else {
                            pluginObj.alert(result.message);
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            queryPartner(selectedPartner);

            function loadPartner(data, selectedPartner) {
                var objStr = "";
                if (data.list.length > 0) {
                    for (var i = 0; i < data.list.length; i++) {
                        var qyinfo = data.list[i];
                        objStr += "<li><span hidden>" + qyinfo.custNo + "</span>" +
                            "<span>" + qyinfo.custCnNm + "</span></li>";
                    }
                    objStr += "<li><a data-toggle='modal' data-target='#addOpponent'>如没有找到您所需要转让的企业，请新增交易对手></a></li>"
                    $(".contentMain .dropdown-menu").empty().html(objStr);
                }
                //初始化选中
                if (IFSCommonMethod.isNotBlank(selectedPartner)) {
                    var select = selectedPartner.split(",");
                    var str = "<span hidden>" + select[0] + "</span>" +
                        "<span>" + select[1] + "</span>";
                    $(".contentMain #change").empty().html(str);
                }

                initPartnerClick();
                initModal();
            }

            //转让方企业
            function initPartnerClick() {
                $(".dropdown-menu li").on("click", function() {
                    if ($(this).children().length != 1) {
                        $("#change").empty();
                        $("#change").html($(this).html());
                    }
                });
            }

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
                    var custName = $("#srchResult li").children().eq(1).text();
                    $(window).IFSAjax({
                        code: "0010_190003",
                        method: "POST",
                        data: { "custNo": custNo },
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                $("#custName").val("");
                                $("#addOpponent").modal("hide");
                                queryPartner(custNo + "," + custName);
                            } else {
                                pluginObj.alert(result.message);
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                });
            }


            $("#txnAmt").on("blur", function() {
                var validAmt = IFSCommonMethod.unFormatMoney($("#validAmt").text());
                var txnAmt = IFSCommonMethod.unFormatMoney($(this).val());
                if (!IFSCommonMethod.isNotBlank(txnAmt)) {
                    pluginObj.alert("请输入转让金额");
                } else if (!IFSRegular.regular(IFSRegularExp.appAmt, txnAmt)) {
                    pluginObj.alert("转让金额格式不正确，请重新输入");
                } else if (IFSCommonMethod.compareMoney(validAmt, txnAmt) == 0) {
                    pluginObj.alert("转让金额不能大于可用金额！");
                } else {
                    $("#txnAmt").val(IFSCommonMethod.formatMoney($(this).val()));
                }

            })

            //下一步
            $("#nextStep").on("click", function() {
                var custNo = $("#change").children().eq(0).text();
                var custName = $("#change").children().eq(1).text();
                var validAmt = IFSCommonMethod.unFormatMoney($("#validAmt").text());
                var txnAmt = IFSCommonMethod.unFormatMoney($("#txnAmt").val());
                var txnComment = $("#txnComment").val();
                var custInfo = [custNo, custName, txnAmt, txnComment];
                if (checkData(custNo, custName, validAmt, txnAmt)) {
                    myDraftTxnMoreTurnTwo(custInfo);
                }

            });

            function checkData(custNo, custName, validAmt, txnAmt) {
                if (!(IFSCommonMethod.isNotBlank(custNo) && IFSCommonMethod.isNotBlank(custName))) {
                    pluginObj.alert("请选择转让企业");
                    return false;
                }
                if (!IFSCommonMethod.isNotBlank(txnAmt)) {
                    pluginObj.alert("请输入转让金额");
                    return false;
                } else if (!IFSRegular.regular(IFSRegularExp.appAmt, txnAmt)) {
                    pluginObj.alert("转让金额格式不正确，请重新输入");
                    return false;
                } else if (IFSCommonMethod.compareMoney(validAmt, txnAmt) == 0) {
                    pluginObj.alert("转让金额不能大于可用金额！");
                    return false;
                }
                return true;
            }

        });

    }
});