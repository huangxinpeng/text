/*
 * @Author: chengdan 
 * @Date: 2017-09-13 16:18:02 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-17 11:29:24
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
    'myDraftTxnTurnMoreTwo',
    'text!tpls/myDraftTxnTurnMoreThree.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant, require,
    myDraftTxnTurnMoreTwo, myDraftTxnTurnMoreThreeTpl, footer) {
    return function(drftInfo, custInfo, pageNum) {
        var $myDraftTxnTurnMoreThreeTpl = $(myDraftTxnTurnMoreThreeTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftTxnTurnMoreThreeTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            $("#three").addClass("threeStep2");
            $("#three").addClass("threeStepOrg2");
            $(".spanTitle a").text("宝券拆分");

            var drftList = [];

            function loadDrftInfo() {
                $("#txnAmtSum").text(IFSCommonMethod.formatMoney(drftInfo[0][2]));
                $("#remainSum").text(IFSCommonMethod.formatMoney("0"));
                $("#dueDt").text(drftInfo[0][4]);
                $("#dueDays").text(drftInfo[0][5]);
            }
            loadDrftInfo();

            function loadCustInfo() {
                var obj = $("#txnTransInfo").children().eq(0); //隐藏的第一个模板元素
                var objStr = "";
                for (var i = 0; i < custInfo.length; i++) {
                    objStr += "<div class='txnInfo'>";
                    obj.find(".id").text(custInfo[i][0]);
                    obj.find(".rcvCustNo").text(custInfo[i][1]);
                    obj.find(".txnAmt").attr("value", i == 0 ? IFSCommonMethod.formatMoney(drftInfo[0][2]) : IFSCommonMethod.formatMoney("0"));
                    obj.find(".isDelay").text(0);
                    obj.find(".dueDaysNew").text(parseInt($(".isDelay").text()) + parseInt($("#dueDays").text()));
                    var txnAmt = parseFloat(IFSCommonMethod.unFormatMoney($(".txnAmt").val()));
                    obj.find(".bouns").text(txnAmt * parseInt($(".isDelay").text()) * 4.35 / 36000);
                    objStr += obj.html();
                    objStr += "</div>";
                }
                $("#txnTransInfo").html(objStr);
                //延期加减
                initAddAndSubtract();
            }
            loadCustInfo();

            //上一步
            $("#preStep").on("click", function() {
                require("myDraftTxnTurnMoreTwo")(drftInfo, custInfo, pageNum);
            });

            $("#nextStep").on("click", function() {
                if (checkAmt($("#txnAmtSum").text(), amtSum())) {
                    $("#txnConfirm").modal("show");
                    $("#smsCode").val("");
                }
            });

            //初始化页面
            initPage();

            //获取短信验证码
            $("#sendSmsCode").on("click", function() {
                getSMSCode($(this), "0010_110005", { bussType: 'ZR01' });
            })

            //转让
            $("#txnBtn").on("click", function() {
                var smsCode = $("#smsCode").val(); //验证码
                $(".txnInfo").each(function() {
                    var list = {};
                    list["id"] = drftInfo[0][0]; //票据id
                    list["drftNo"] = drftInfo[0][1]; //票据号码
                    list["rcvCustNo"] = $(this).find(".id").text(); //客户号
                    list["rcvCustNm"] = $(this).find(".rcvCustNo").text(); //客户名称
                    list["isseAmt"] = IFSCommonMethod.unFormatMoney($(this).find(".txnAmt").val()); //客户号
                    list["dueDays"] = $(this).find(".dueDaysNew").text(); //距到期日
                    list["isDelay"] = $(this).find(".isDelay").text() == "0" ? 0 : 1; //延期标志
                    list["delayDays"] = $(this).find(".isDelay").text(); //延期天数
                    list["bouns"] = $(this).find(".bouns").text(); //延期收益
                    drftList.push(list);
                });
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
                                initSuccPage($("#txnConfirm"), 3, drftInfo[0][1], amtSum(), null, 2);
                            } else {
                                pluginObj.alert(result.message);
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                }
            })

            //跳转到融资页面
            $("#successReturn").on("click", function() {
                $("#myDraftTxn").trigger("click");
            });

        });
    }
});