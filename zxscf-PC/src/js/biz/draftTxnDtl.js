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
    'text!tpls/draftTxnDtl.html',
    'text!tpls/../protocals/accounReceivablesTransferProtocal.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftTxnDtlTpl, accounReceivablesTransferProtocal, footer) {
    return function(id, txnType) {
        var $draftTxnDtlTpl = $(draftTxnDtlTpl);
        var $footer = $(footer);
        var $accounReceivablesTransferProtocal = $(accounReceivablesTransferProtocal);
        $('.content').empty();
        $('.content').append($draftTxnDtlTpl);
        $('.scrollbar').append($accounReceivablesTransferProtocal);
        $(document).ready(function() {
            if (txnType == "txnAppr") {
                $("#txnType").text("转让待复核");
                $(".spanNote").text("您在此页面可查看转让待复核的宝券详细信息");
                $("#retract").css("display", "none");
            } else {
                $("#txnType").text("转让撤销待复核");
                $(".spanNote").text("您在此页面可查看转让撤销待复核的宝券详细信息");
                $("#appr").css("display", "none");
            }
            initPage(1);

            //加载数据
            function loadData() {
                $(window).IFSAjax({
                    code: "0010_310010",
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
                $("#srcDrftNo").text(data.srcDrftNo);
                $("#txnDt").text(IFSCommonMethod.formatDate(data.txnDt, "yyyy-MM-dd"));
                $("#rcvCustNm").text(data.rcvCustNm);
                $("#dueDays").text(data.delayDays);
                $("#drwrNm").text(data.drwrNm);
                $("#appUsrNm").text(data.appUsrNm);
                $("#txnAmt").text(IFSCommonMethod.formatMoney(data.txnAmt));
                protLinkClickEvent(2, data);
            }

            //模态框radio
            initModalRadioComponent();


            //确认复核
            $("#appr").on("click", function() {
                $("#my_confirmSign").modal("show");
                $("#read").siblings("div").children("span").removeClass("active");
                $("#smsCode").val("");
                $("#my_confirmSign .modal-title").text("宝券转让复核");
                $("#my_confirmSign .modal-body p").text("如您确认复核该宝券转让，请进行身份验证并签署下述协议");
            });

            //撤销
            $("#retract").on("click", function() {
                $("#my_confirmSign").modal("show");
                $("#smsCode").val("");
                $("#my_confirmSign .modal-title").text("转让撤销复核");
                $("#my_confirmSign .modal-body p").text("如您确认复核该转让撤销，请进行身份验证并签署下述协议。");
            });

            //驳回
            $("#cancel").on("click", function() {
                $("#rejectModal").modal("show");
                $("#info").siblings("div").children("span").addClass("active");
                $("#info").parents("div").siblings("div").find("span").removeClass("active");
            });

            //初始化radio
            initRejectRadioComponent($("#draftTxn"), "RR2");

            //获取短信验证码
            $("#sendSmsCode").on("click", function() {
                getSMSCode($(this), "0010_110005", { bussType: 'ZR02' });
            });

            //审批
            $("#apprBtn,#canlBtn").on("click", function() {
                var flag = $(this).attr("id") == "canlBtn";
                var smsCode = $("#smsCode").val();
                var bussType = txnType == "txnAppr" ? "01" : "02";
                var appStat = flag ? "2" : "1";
                var appRmk;
                if (appStat == 2) {
                    appRmk = $("#draftTxn").attr("back");
                }
                var signList = [{ "id": id, "srcDrftNo": $("#bqbh").text() }];
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
                        code: "0010_810002",
                        method: "POST",
                        data: {
                            "smsCode": smsCode,
                            "bussType": bussType,
                            "appStat": appStat,
                            "appRmk": appRmk,
                            "signList": signList
                        },
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                flag ? initCanlPage($("#rejectModal"), $(".rejectTips"), $("#draftTxn"), 2) :
                                    initSuccPage($("#my_confirmSign"), 1, $("#srcDrftNo").text(), $("#txnAmt").text(), txnType == "txnAppr" ? 1 : 2, 2);
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
                $("#draftTxn").trigger("click");
            });
        });
    }

});