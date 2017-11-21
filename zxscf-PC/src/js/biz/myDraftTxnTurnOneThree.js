/*
 * @Author: chengdan 
 * @Date: 2017-09-13 16:18:02 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-17 15:04:58
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
    'myDraftTxnTurnOneTwo',
    'text!tpls/myDraftTxnTurnOneThree.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant, require,
    myDraftTxnTurnOneTwo, myDraftTxnTurnOneThreeTpl, footer) {
    return function(drftInfo, custInfo, pageNum) {
        var $myDraftTxnTurnOneThreeTpl = $(myDraftTxnTurnOneThreeTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftTxnTurnOneThreeTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            $("#three").addClass("threeStep1");
            $(".spanTitle a").text("转让信息");

            var drftList = [];

            function loadDrftInfo() {
                $("#txnAmtSum").text(IFSCommonMethod.formatMoney(drftInfo[0][2]));
                $("#remainSum").text(IFSCommonMethod.formatMoney("0"));
                $("#dueDt").text(drftInfo[0][4]);
                $("#dueDays").text(drftInfo[0][5]);
            }

            loadDrftInfo();

            function loadCustInfo() {
                $(".rcvCustNo").text(custInfo[0][1]);
                $(".txnAmt").attr("value", IFSCommonMethod.formatMoney(drftInfo[0][2]));
                $(".isDelay").text(0);
                $(".dueDaysNew").text(parseInt($(".isDelay").text()) + parseInt($("#dueDays").text()));
                var txnAmt = parseFloat(IFSCommonMethod.unFormatMoney($(".txnAmt").val()));
                $(".bouns").text(txnAmt * parseInt($(".isDelay").text()) * 4.35 / 36000);
                //延期加减
                initAddAndSubtract();
            }
            loadCustInfo();

            //上一步
            $("#preStep").on("click", function() {
                require("myDraftTxnTurnOneTwo")(drftInfo, custInfo, pageNum);
            });

            $("#nextStep").on("click", function() {
                if (checkAmt($("#txnAmtSum").text(), $(".txnAmt").val())) {
                    $("#txnConfirm").modal("show");
                    $("#smsCode").val("");
                }
            })

            //初始化页面
            initPage();

            //获取短信验证码
            $("#sendSmsCode").on("click", function() {
                getSMSCode($(this), "0010_110005", { bussType: 'ZR01' });
            })

            //转让
            $("#txnBtn").on("click", function() {
                var list = {};
                var smsCode = $("#smsCode").val(); //验证码
                list["id"] = drftInfo[0][0]; //票据id
                list["drftNo"] = drftInfo[0][1]; //票据号码
                list["rcvCustNo"] = custInfo[0][0]; //客户号
                list["rcvCustNm"] = custInfo[0][1]; //客户名称
                list["isseAmt"] = IFSCommonMethod.unFormatMoney($(".txnAmt").val()); //客户号
                list["dueDays"] = $(".dueDaysNew").text(); //距到期日
                list["isDelay"] = $(".isDelay").text() == "0" ? 0 : 1; //延期标志
                list["delayDays"] = $(".isDelay").text(); //延期天数
                list["bouns"] = $(".bouns").text(); //延期收益
                drftList.push(list);

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
                                initSuccPage($("#txnConfirm"), 3, drftInfo[0][1], $(".txnAmt").val(), null, 2);
                            } else {
                                pluginObj.alert(result.message);
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                }
            })

            //跳转到转让页面
            $("#successReturn").on("click", function() {
                $("#myDraftTxn").trigger("click");
            });

        });
    }
});