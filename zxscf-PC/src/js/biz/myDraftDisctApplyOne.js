/*
 * @Author: chengdan 
 * @Date: 2017-09-07 17:16:53 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 15:22:03
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
    'myDraftDisct',
    'myDraftDisctApplyTwo',
    'text!tpls/myDraftDisctApplyOne.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant, myDraftDisct,
    myDraftDisctApplyTwo, myDraftDisctApplyOneTpl, footer) {
    return function(drftInfo, disctInfo, pageNum) {
        var $myDraftDisctApplyOneTpl = $(myDraftDisctApplyOneTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftDisctApplyOneTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            var bonus;

            function getBonus() {
                $(window).IFSAjax({
                    code: "0010_400001",
                    method: "POST",
                    data: {},
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            bonus = result.data.validBonus;
                        } else {
                            pluginObj.alert(result.message);
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            getBonus();

            function getRate(disctAmt, intDays, obj) {
                $(window).IFSAjax({
                    code: "0010_320009",
                    method: "POST",
                    data: { "disctAmt": disctAmt, "intDays": intDays },
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            $(obj).text(result.data == null ? "0" : result.data.intrate);
                        } else {
                            pluginObj.alert(result.message);
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            //根据勾选的宝券编号加载宝券信息
            var loadData = function() {
                var obj = $("#drftInfo").children().eq(0); //隐藏的第一个模板元素
                var objStr = "";
                var totalDisctAmt = 0;
                var dcInterest = 0;
                for (var i = 0; i < drftInfo.length; i++) {
                    //添加融资金额到drftInfo
                    if (!IFSCommonMethod.isNotBlank(drftInfo[i][8])) {
                        drftInfo[i][8] = drftInfo[i][2];
                    }
                    objStr += "<div class='disctDrftInfo'>";
                    obj.find(".srcDrftNo").text(drftInfo[i][1]);
                    obj.find(".validAmt").text(IFSCommonMethod.formatMoney(drftInfo[i][2]));
                    obj.find(".srcDueDt").text(drftInfo[i][5]);
                    if (!IFSCommonMethod.isNotBlank(drftInfo[i][9])) {
                        getRate(drftInfo[i][8], drftInfo[i][5], obj.find(".intrate"));
                        drftInfo[i][9] = obj.find(".intrate").text();
                    } else {
                        obj.find(".intrate").text(drftInfo[i][9]);
                    }
                    obj.find(".disctAmt").attr("value", IFSCommonMethod.formatMoney(drftInfo[i][8]));
                    objStr += obj.html();
                    objStr += "</div>";
                    totalDisctAmt += parseFloat(drftInfo[i][2]);
                    dcInterest += parseFloat(drftInfo[i][8]) * parseFloat($(".intrate").text()) * parseInt(drftInfo[i][5]) / 36000;
                }
                $("#drftInfo").html(objStr);
                //初始化融资信息
                $("#totalDisctAmt").text(IFSCommonMethod.formatMoney(totalDisctAmt));
                $("#dcInterest").text(IFSCommonMethod.formatMoney(dcInterest));
                $("#rateDisct").text(drftInfo[0][7] == null ? "0" : parseInt(drftInfo[0][7]).toFixed(2));
                var rateInterest = dcInterest * parseFloat($("#rateDisct").text()) / 100;
                if (IFSCommonMethod.isNotBlank(disctInfo)) {
                    $("#useBouns").attr("value", disctInfo["useBouns"]);
                } else {
                    $("#useBouns").attr("value", IFSCommonMethod.formatMoney(Math.min(rateInterest, bonus)));
                }
                $("#rateInterest").text(IFSCommonMethod.formatMoney(rateInterest));
                $("#rcInterest").text(IFSCommonMethod.formatMoney(rateInterest - IFSCommonMethod.unFormatMoney($("#useBouns").val())));
                querybankInfo();
            };
            loadData();

            $("#useBouns").on("blur", function() {
                $("#useBouns").val(IFSCommonMethod.formatMoney($("#useBouns").val()));
                var rateInterest = IFSCommonMethod.unFormatMoney($("#rateInterest").text());
                var useBouns = IFSCommonMethod.unFormatMoney($("#useBouns").val());
                var min = IFSCommonMethod.unFormatMoney(IFSCommonMethod.formatMoney(Math.min(rateInterest, bonus)));
                if (IFSCommonMethod.compareMoney(min, useBouns) != 0) {
                    $("#rcInterest").text(IFSCommonMethod.formatMoney(rateInterest - useBouns));
                } else {
                    pluginObj.alert("抵扣金币数不能大于" + (min == rateInterest ? "优惠后利息！" : "可用金币数：" + bonus + "！"));
                }
            });

            $(".disctAmt").on("blur", function() {
                if (!IFSRegular.regular(IFSRegularExp.appAmt, $(this).val())) {
                    pluginObj.alert("融资金额格式不正确，请重新输入");
                } else {
                    var disctAmt = IFSCommonMethod.unFormatMoney($(this).val());
                    var srcDueDt = $(this).parents(".disctDrftInfo").find(".srcDueDt").text();
                    var validAmt = IFSCommonMethod.unFormatMoney($(this).parents(".disctDrftInfo").find(".validAmt").text());
                    if (IFSCommonMethod.compareMoney(validAmt, disctAmt) == 0) {
                        pluginObj.alert("融资金额不能大于宝券金额！");
                    } else {
                        $(this).val(IFSCommonMethod.formatMoney($(this).val()));
                        //查询费率
                        getRate(disctAmt, srcDueDt, $(this).parents(".disctDrftInfo").find(".intrate"));
                        var srcDrftNo = $(this).parents(".disctDrftInfo").find(".srcDrftNo").text();
                        //添加融资金额，年化利率到drftInfo
                        for (var i = 0; i < drftInfo.length; i++) {
                            if (drftInfo[i][1] == srcDrftNo) {
                                drftInfo[i][8] = disctAmt;
                                drftInfo[i][9] = $(this).parents(".disctDrftInfo").find(".intrate").text();
                                break;
                            }
                        }
                        var dcInterest = 0;
                        $(".disctAmt").each(function() {
                            var amt = parseFloat(IFSCommonMethod.unFormatMoney($(this).val()));
                            var day = parseInt($(this).parents(".disctDrftInfo").find(".srcDueDt").text());
                            var rate = parseFloat($(this).parents(".disctDrftInfo").find(".intrate").text());
                            dcInterest += amt * rate * day / 36000;
                        });
                        $("#dcInterest").text(IFSCommonMethod.formatMoney(dcInterest));
                        var rateInterest = dcInterest * parseFloat($("#rateDisct").text()) / 100;
                        $("#rateInterest").text(IFSCommonMethod.formatMoney(rateInterest));
                        $("#rcInterest").text(IFSCommonMethod.formatMoney(rateInterest - IFSCommonMethod.unFormatMoney($("#useBouns").val())));
                    }
                }
            });

            //加载银行信息
            function querybankInfo() {
                $(window).IFSAjax({
                    code: "0010_170001",
                    method: "POST",
                    data: {
                        "pageNum": 1,
                        "pageSize": 100,
                        "checkStu": 2,
                    },
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            loadbankInfo(result.data);
                        } else {
                            pluginObj.alert(result.message);
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function loadbankInfo(data) {
                var objStr = "";
                var str = "";
                if (data.list != null && data.list.length > 0) {
                    for (var i = 0; i < data.list.length; i++) {
                        var bankInfo = data.list[i];
                        objStr += "<li><div><span hidden>" + bankInfo.openBrhCd + "</span>" +
                            "<span hidden>" + bankInfo.openAcctNm + "</span>" +
                            "<span hidden>" + bankInfo.bankCity + "</span>" +
                            "<span>" + bankInfo.openBrhNm + "</span>" +
                            "<span>" + bankInfo.acctNo + "</span>" +
                            "<span class='badge defAcct'>" + (bankInfo.defRecNo == "1" ? "默认账号" : "") + "</span></div>" +
                            "<i>" + bankInfo.bankCity + "</i></li>";
                        if (bankInfo.defRecNo == "1") {
                            str = "<span hidden>" + bankInfo.openBrhCd + "</span>" +
                                "<span hidden>" + bankInfo.openAcctNm + "</span>" +
                                "<span hidden>" + bankInfo.bankCity + "</span>" +
                                "<span>" + bankInfo.openBrhNm + "</span>" +
                                "<span>" + bankInfo.acctNo + "</span>" +
                                "<span class='badge defAcct'>默认账号</span></li>";
                        }
                    }
                    if (IFSCommonMethod.isNotBlank(disctInfo)) {
                        str = "<span hidden>" + disctInfo["pyeeBankNo"] + "</span>" +
                            "<span hidden>" + disctInfo["pyeeAcctNm"] + "</span>" +
                            "<span hidden>" + disctInfo["pyeeBankCity"] + "</span>" +
                            "<span>" + disctInfo["pyeeBankNm"] + "</span>" +
                            "<span>" + disctInfo["pyeeAcct"] + "</span>" +
                            "<span class='badge defAcct'>" + (disctInfo["defRecNo"] == "1" ? "默认账号" : "") + "</span></li>"
                    }
                    if (str != "") {
                        $(".bankInfo #change").empty().html(str);
                    } else {
                        $(".bankInfo #change").empty().html("<span>请选择收款账号</span>");
                    }
                    $(".bankInfo .dropdown-menu").empty().html(objStr);
                } else {
                    $(".my_signContent #change").empty().html("<span>请选择收款账号</span>");
                }
                initBankClick();
            }

            function initBankClick() {
                $(".bankInfo .dropdown-menu li").on("click", function() {
                    $(".bankInfo #change").empty();
                    $(".bankInfo #change").html($(this).children().eq(0).html());
                });
            }

            //上一步
            $("#preStep").on("click", function() {
                require("myDraftDisct")(drftInfo, pageNum);
            });

            //下一步
            $("#nextStep").on("click", function() {
                var flag = true;
                $(".disctAmt").each(function() {
                    var disctAmt = IFSCommonMethod.unFormatMoney($(this).val());
                    var validAmt = IFSCommonMethod.unFormatMoney($(this).parents(".disctDrftInfo").find(".validAmt").text());
                    if (!IFSRegular.regular(IFSRegularExp.appAmt, disctAmt)) {
                        pluginObj.alert("融资金额格式不正确，请重新输入");
                        flag = false;
                    } else if (IFSCommonMethod.compareMoney(validAmt, disctAmt) == 0) {
                        pluginObj.alert("融资金额不能大于宝券金额！");
                        flag = false;
                    }
                });
                if (flag) {
                    var rateInterest = IFSCommonMethod.unFormatMoney($("#rateInterest").text());
                    var useBouns = IFSCommonMethod.unFormatMoney($("#useBouns").val());
                    var min = IFSCommonMethod.unFormatMoney(IFSCommonMethod.formatMoney(Math.min(rateInterest, bonus)));
                    if (IFSCommonMethod.compareMoney(min, useBouns) == 0) {
                        pluginObj.alert("抵扣金币数不能大于" + (min == rateInterest ? "优惠后利息！" : "可用金币数：" + bonus + "！"));
                        flag = false;
                    }
                }

                if (flag) {
                    var acctNo = $("#change").children().eq(4).text();
                    if (!IFSCommonMethod.isNotBlank(acctNo)) {
                        pluginObj.alert("请选择银行账号！");
                        flag = false;
                    }
                }

                if (flag) {
                    myDraftDisctApplyTwo(drftInfo, getInfo(), pageNum);
                }
            });

            function getInfo() {
                var disctInfo = {};
                disctInfo["finTyp"] = drftInfo[0][6]; //追索权类型
                disctInfo["rateDisct"] = $("#rateDisct").text(); //优惠折扣 
                disctInfo["useBouns"] = IFSCommonMethod.unFormatMoney($("#useBouns").val()); //抵扣金币
                disctInfo["dcInterest"] = IFSCommonMethod.unFormatMoney($("#dcInterest").text()); //应付利息
                disctInfo["rcInterest"] = IFSCommonMethod.unFormatMoney($("#rcInterest").text()); //实付利息
                disctInfo["pyeeBankCity"] = $("#change").children().eq(2).text(); //收款行所在城市
                disctInfo["pyeeBankNm"] = $("#change").children().eq(3).text(); //收款银行
                disctInfo["pyeeBankNo"] = $("#change").children().eq(0).text(); //收款银行行号
                disctInfo["pyeeAcct"] = $("#change").children().eq(4).text(); //收款账号
                disctInfo["pyeeAcctNm"] = $("#change").children().eq(1).text(); //收款账号名称
                disctInfo["defRecNo"] = $("#change").children().eq(5).text() == "" ? "0" : "1"; //是否默认
                return disctInfo;
            }
        });

    }
});