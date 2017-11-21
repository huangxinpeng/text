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
    'text!tpls/draftDisctDtl.html',
    'text!tpls/../protocals/factoryingFinancingProtocal.html',
    'text!tpls/../protocals/factoryingFinancingProtocalWithRecourse.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftDisctDtlTpl, factoryingFinancingProtocal, factoryingFinancingProtocalWithRecourse, footer) {
    return function(id, disctType) {
        var $draftDisctDtlTpl = $(draftDisctDtlTpl);
        var $footer = $(footer);
        var $factoryingFinancingProtocal = $(factoryingFinancingProtocal);
        var $factoryingFinancingProtocalWithRecourse = $(factoryingFinancingProtocalWithRecourse);
        $('.content').empty();
        $('.content').append($draftDisctDtlTpl);
        $('.content').append($footer);
        $('#protocolModalNo .scrollbar').append($factoryingFinancingProtocal);
        $('#protocolModalYes .scrollbar').append($factoryingFinancingProtocalWithRecourse);
        $(document).ready(function() {
            if (disctType == "disctAppr") {
                $("#disctType").text("融资待复核");
                $(".spanNote").text("您在此页面可查看融资待复核的宝券详细信息");
                $("#ratract").css("display", "none");
                $("#appr").css("display", "block");
            } else {
                $("#disctType").text("融资撤销待复核");
                $(".spanNote").text("您在此页面可查看融资撤销待复核的宝券详细信息");
                $("#ratract").css("display", "block");
                $("#appr").css("display", "none");
            }

            initPage(1);

            //加载数据
            function loadData() {
                $(window).IFSAjax({
                    code: "0010_320005",
                    method: "POST",
                    data: { "id": id },
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
            loadData();

            function successFun(data) {
                $("#drftNo").text(data.srcDrftNo);
                $("#txnDt").text(IFSCommonMethod.formatDate(data.txnDt));
                $("#orgNm").text(data.orgNm);
                $("#finTyp").text(data.finTyp);
                $("#txnStat").text(data.txnStat);
                $("#intDays").text(data.intDays);
                $("#rateDisct").text(data.rateDisct);
                $("#dcInterest").text(IFSCommonMethod.formatMoney(data.dcInterest));
                $("#intRate").text(data.intRate);
                $("#useBouns").text(IFSCommonMethod.formatMoney(data.useBouns));
                $("#rcInterest").text(IFSCommonMethod.formatMoney(data.rcInterest));
                $("#disctAmt").text(IFSCommonMethod.formatMoney(data.disctAmt));
                //放款金额
                $("#payAmt").text(IFSCommonMethod.formatMoney(data.payAmt));
                //数据字典
                renderDataDic();
                protLinkClickEvent(2, data);
            }


            //模态框radio
            initModalRadioComponent();

            //确认复核
            $("#appr").on("click", function() {
                $("#my_confirmSign").modal("show");
                $("#read").siblings("div").children("span").removeClass("active");
                $("#smsCode").val("");
                $("#my_confirmSign .modal-title").text("宝券融资复核");
                $("#my_confirmSign .modal-body p").text("如您确认复核该宝券融资，请进行身份验证并签署下述协议");
            });

            //撤销
            $("#ratract").on("click", function() {
                $("#my_confirmSign").modal("show");
                $("#smsCode").val("");
                $("#my_confirmSign .modal-title").text("融资撤销复核");
                $("#my_confirmSign .modal-body p").text("如您确认复核该融资撤销，请进行身份验证并签署下述协议。");
            });

            //驳回
            $("#cancel").on("click", function() {
                $("#rejectModal").modal("show");
                $("#info").siblings("div").children("span").addClass("active");
                $("#info").parents("div").siblings("div").find("span").removeClass("active");
            });

            //初始化radio
            initRejectRadioComponent($("#draftDisct"), "RR3");

            //获取短信验证码
            $("#sendSmsCode").on("click", function() {
                getSMSCode($(this), "0010_110005", { bussType: 'RZ02' });
            });

            //审批
            $("#apprBtn,#canlBtn").on("click", function() {
                var flag = $(this).attr("id") == "canlBtn";
                var smsCode = $("#smsCode").val();
                var operateType = disctType == "disctAppr" ? "01" : "02";
                var appStat = flag ? "1" : "2";
                var appRmk;
                if (appStat == 1) {
                    appRmk = $("#draftDisct").attr("back");
                }
                var approveList = [id];
                var temp = flag;
                if (!flag) {
                    if (!IFSCommonMethod.isNotBlank(smsCode)) {
                        pluginObj.alert("请输入短信验证码");
                    } else if (!$("#read").siblings("div").children("span").hasClass("active")) {
                        pluginObj.alert("请勾选宝券协议");
                    } else {
                        temp = true;
                    }
                }
                if (temp) {
                    $(window).IFSAjax({
                        code: "0010_820002",
                        method: "POST",
                        data: {
                            "smsCode": smsCode,
                            "operateType": operateType,
                            "appStat": appStat,
                            "appRmk": appRmk,
                            "approveList": approveList
                        },
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                flag ? initCanlPage($("#rejectModal"), $(".rejectTips"), $("#draftDisct"), 3) :
                                    initSuccPage($("#my_confirmSign"), 1, $("#drftNo").text(), $("#disctAmt").text(), disctType == "disctAppr" ? 3 : 4, 3);
                            } else {
                                pluginObj.alert(result.message);
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                }
            });

            //确认成功
            $("#successReturn").on("click", function() {
                $("#draftDisct").trigger("click");
            })
        });
    }
});