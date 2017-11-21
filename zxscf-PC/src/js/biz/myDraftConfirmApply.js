/*
 * @Author: chengdan 
 * @Date: 2017-09-01 17:00:14 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-17 14:56:38
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
    'text!tpls/myDraftConfirmApply.html',
    'text!tpls/../protocals/applicantNotice.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, myDraftConfirmApplyTpl, applicantNotice, footer) {
    return function(info) {
        var $myDraftConfirmApplyTpl = $(myDraftConfirmApplyTpl);
        var $applicantNotice = $(applicantNotice);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftConfirmApplyTpl);
        $('.content').append($footer);
        $('.scrollbar').append($applicantNotice);
        $(document).ready(function() {
            //查询年化费率
            var fee;

            function queryFee() {
                $(window).IFSAjax({
                    code: "0010_340003",
                    method: "POST",
                    data: {
                        "bussTyp": "0201",
                        "chargeKind": "1",
                        "chargeType": "2"
                    },
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            fee = IFSCommonMethod.isNotBlank(result.data.rate) == true ? result.data.rate : "0";
                        } else {
                            pluginObj.alert(result.message);
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            //查询抵扣金币
            var bonus;

            function getBonus() {
                $(window).IFSAjax({
                    code: "0010_400001",
                    method: "POST",
                    data: {},
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            bonus = IFSCommonMethod.isNotBlank(result.data.validBonus) == true ? result.data.validBonus : "0";
                        } else {
                            pluginObj.alert(result.message);
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            //根据勾选的宝券编号加载宝券信息
            var loadData = function() {
                queryFee();
                getBonus();
                var obj = $("#drftInfoE").children().eq(0); //隐藏的第一个模板元素
                var objStr = "";
                var txnAmt = 0;
                var txnFee = 0;
                for (var i = 0; i < info.length; i++) {
                    objStr += "<div class='drftInfo'>";
                    obj.find(".srcDrftNo").html(info[i][1]);
                    obj.find(".validAmt").html(IFSCommonMethod.formatMoney(info[i][3]));
                    obj.find(".dutDt").html(info[i][7]);
                    obj.find(".fee").html(parseFloat(fee));
                    var feeAmt = parseFloat(info[i][3]) * parseFloat(fee) / 100;
                    obj.find(".feeAmt").html(feeAmt);
                    objStr += obj.html();
                    objStr += "</div>";
                    txnAmt += parseFloat(info[i][3]);
                    txnFee += feeAmt;
                }
                $("#txnAmt").text(IFSCommonMethod.formatMoney(txnAmt));
                $("#txnFee").text(IFSCommonMethod.formatMoney(txnFee));
                $("#useBouns").text(IFSCommonMethod.formatMoney(bonus));
                $("#payAmt").text(IFSCommonMethod.formatMoney(txnFee - bonus));
                $("#drftInfoE").html(objStr);
            }
            loadData();

            //查询加保机构
            function queryBr() {
                $(window).IFSAjax({
                    code: "0010_340002",
                    method: "POST",
                    data: {},
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            $("#brCode").val(result.data.list[0].brcode);
                            $("#brName").val(result.data.list[0].brname);
                        } else {
                            pluginObj.alert(result.message);
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            queryBr();

            //模态框radio
            initModalRadioComponent();

            //初始化页面
            initPage();

            //上一步
            $("#preStep").on("click", function() {
                $("#myDraftConfirm").attr("info", JSON.stringify(info));
                $('#myDraftConfirm').trigger('click');
            });

            $("#nextStep").on("click", function() {
                $("#ConfConfirm").modal("show");
                $("#read").siblings("div").children("span").removeClass("active");
                $("#smsCode").val("");
            })

            //获取短信验证码
            $("#sendSmsCode").on("click", function() {
                getSMSCode($(this), "0010_110005", { bussType: 'CM01' });
            })

            //加保
            $("#confirmBtn").on("click", function() {
                var smsCode = $("#smsCode").val();
                var orgId = $("#brCode").val(); //机构代码
                var orgNm = $("#brName").val(); //机构名称
                var applyList = [];
                for (var i = 0; i < info.length; i++) {
                    var list = {};
                    list["srcDrftNo"] = info[i][1]; //票据号码
                    list["txnAmt"] = info[i][3]; //加保金额
                    list["txnFee"] = parseFloat(info[i][3]) * parseFloat(fee) / 100; //加保费用
                    list["isBouns"] = (bonus == "" ? "0" : "1"); //"是否抵扣 0-否1-是"
                    list["useBouns"] = bonus; //抵扣金币
                    list["payAmt"] = parseFloat(info[i][3]) * parseFloat(fee) / 100 - bonus; //实付利息
                    list["chargeType"] = "2"; //收费方式
                    applyList.push(list);
                }
                if (!IFSCommonMethod.isNotBlank(smsCode)) {
                    pluginObj.alert("请输入短信验证码");
                } else if (!$("#read").siblings("div").children("span").hasClass("active")) {
                    pluginObj.alert("请勾选宝券加保协议");
                } else {
                    $(window).IFSAjax({
                        code: "0010_340004",
                        method: "POST",
                        data: {
                            "smsCode": smsCode,
                            "orgId": orgId,
                            "orgNm": orgNm,
                            "applyList": applyList
                        },
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                initSuccPage($("#ConfConfirm"));
                            } else {
                                pluginObj.alert(result.message);
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                }
            });

            //成功确认跳转
            $("#successReturn").on("click", function() {
                $('#myDraftConfirm').trigger('click');
            });


            $("#applicationGuide").click(function() {
                $("#ConfConfirm").modal("hide");
                //setTimeout(function(){
                $("#protocolModal").modal("show");
                //},500);
            });
            $("#protocolModal").on("hide.bs.modal", function() {

                $("#ConfConfirm").modal("show");
            })

        });

    }
});