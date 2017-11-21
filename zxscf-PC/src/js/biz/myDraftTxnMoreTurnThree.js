/*
 * @Author: chengdan 
 * @Date: 2017-09-13 16:18:02 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-17 11:28:39
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
    'myDraftTxnMoreTurnTwo',
    'text!tpls/myDraftTxnMoreTurnThree.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant, require,
    myDraftTxnMoreTurnTwo, myDraftTxnMoreTurnThreeTpl, footer) {
    return function(custInfo, drftInfo, pageNum) {
        var $myDraftTxnMoreTurnThreeTpl = $(myDraftTxnMoreTurnThreeTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftTxnMoreTurnThreeTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            $("#three").addClass("threeStep1");
            $("#one").addClass("oneStepOrg3");
            $("#two").addClass("twoStepOrg3");

            var drftList = [];

            function loadCustInfo() {
                $("#txnAmtSum").text(IFSCommonMethod.formatMoney(custInfo[2]));
                $("#rcvCustNo").text(custInfo[1]);
            }
            loadCustInfo();

            function loadDrftInfo() {
                var obj = $("#txnTransInfo").children().eq(0); //隐藏的第一个模板元素
                var objStr = "";
                for (var i = 0; i < drftInfo.length; i++) {
                    obj.find(".drftId").text(drftInfo[i][0]);
                    obj.find(".drftNo").text(drftInfo[i][1]);
                    objStr += "<div class='txnInfo'>";
                    obj.find(".validAmt").text(IFSCommonMethod.formatMoney(drftInfo[i][2]));
                    obj.find(".txnAmt").attr("value", IFSCommonMethod.formatMoney(drftInfo[i][2]));
                    obj.find(".isDelay").text(0);
                    obj.find(".dueDaysNew").text(parseInt($(".isDelay").text()) + parseInt(drftInfo[i][5]));
                    var txnAmt = parseFloat(IFSCommonMethod.unFormatMoney($(".txnAmt").val()));
                    obj.find(".bouns").text(txnAmt * parseInt($(".isDelay").text()) * 4.35 / 36000);
                    objStr += obj.html();
                    objStr += "</div>";
                }
                $("#txnTransInfo").html(objStr);
                //延期加减
                initAddAndSubtract("3");
            }
            loadDrftInfo();

            //初始化页面
            initPage();

            //上一步
            $("#preStep").on("click", function() {
                require("myDraftTxnMoreTurnTwo")(custInfo, drftInfo, pageNum);
            });

            $("#nextStep").on("click", function() {
                if (checkAmt($("#txnAmtSum").text(), amtSum(), 3)) {
                    $("#txnMoreConfirm").modal("show");
                    $("#smsCode").val("");
                }
            });

            //获取短信验证码
            $("#sendSmsCode").on("click", function() {
                getSMSCode($(this), "0010_110005", { bussType: 'ZR01' });
            })

            //转让
            $("#txnBtn").on("click", function() {
                var smsCode = $("#smsCode").val(); //验证码
                var drftNos = "";
                $(".txnInfo").each(function() {
                    var list = {};
                    list["id"] = $(this).find(".drftId").text(); //票据id
                    list["drftNo"] = $(this).find(".drftNo").text(); //票据号码
                    list["rcvCustNo"] = custInfo[0]; //客户号
                    list["rcvCustNm"] = custInfo[1]; //客户名称
                    list["isseAmt"] = IFSCommonMethod.unFormatMoney($(this).find(".txnAmt").val()); //客户号
                    list["dueDays"] = $(this).find(".dueDaysNew").text(); //距到期日
                    list["isDelay"] = $(this).find(".isDelay").text() == "0" ? 0 : 1; //延期标志
                    list["delayDays"] = $(this).find(".isDelay").text(); //延期天数
                    list["bouns"] = $(this).find(".bouns").text(); //延期收益
                    drftList.push(list);
                    drftNos += $(this).find(".drftNo").text() + ",";
                });
                drftNos = drftNos.substring(0, drftNos.length - 1);
                if (drftList.length > 0) {
                    if (!IFSCommonMethod.isNotBlank(smsCode)) {
                        pluginObj.alert("请输入短信验证码");
                    } else {
                        $(window).IFSAjax({
                            code: "0010_310008",
                            method: "POST",
                            data: {
                                "smsCode": smsCode,
                                "drftList": drftList
                            },
                            async: false,
                            complete: function(result) {
                                if (result.code == IFSConfig.resultCode) {
                                    initSuccPage($("#txnMoreConfirm"), 3, drftNos, amtSum(), null, 2);
                                } else {
                                    pluginObj.alert(result.message);
                                }
                            },
                            error: function(status, XMLHttpRequest) {}
                        });
                    }
                }
            });

            //跳转到转让页面
            $("#successReturn").on("click", function() {
                $("#myDraftTxn").trigger("click");
            });

        });
    }
});