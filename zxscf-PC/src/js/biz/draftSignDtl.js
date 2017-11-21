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
    'text!tpls/draftSignDtl.html',
    'text!tpls/../protocals/accounReceivablesTransferProtocal.html',
    'text!tpls/../protocals/treasureBilOpenAgreement.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftSignDtlTpl, accounReceivablesTransferProtocal, treasureBilOpenAgreement, footer) {
    return function(id) {
        var $draftSignDtlTpl = $(draftSignDtlTpl);
        var $footer = $(footer);
        var $accounReceivablesTransferProtocal = $(accounReceivablesTransferProtocal);
        var $treasureBilOpenAgreement = $(treasureBilOpenAgreement);
        $('.content').empty();
        $('.content').append($draftSignDtlTpl);
        $('#protocolModal .scrollbar').append($accounReceivablesTransferProtocal);
        $('#drawProtocolModal .scrollbar').append($treasureBilOpenAgreement);
        $('.content').append($footer);
        $(document).ready(function() {
            //模态框radio
            initModalRadioComponent();

            //初始化页面
            initPage(1);

            var data;

            //加载数据
            function loadData() {
                $(window).IFSAjax({
                    code: "0010_800003",
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
                if (IFSCommonMethod.isNotBlank(data.appNo)) {
                    var isDrawDrft = data.appNo.substring(0, 2) == "10" ? true : false;
                }
                $("#srcDrftNo").html(data.srcDrftNo);
                $("#txnDt").html(IFSCommonMethod.str2Date(data.txnDt));
                $("#reqCustNm").html(data.reqCustNm);
                $("#srcDueDt").html(IFSCommonMethod.str2Date(data.srcDueDt));
                $("#delayDays").html(data.delayDays);
                $("#drwrNm").html(data.drwrNm);
                $("#txnAmt").html(IFSCommonMethod.formatMoney(data.txnAmt));
                initModal(isDrawDrft);
                protLinkClickEvent(2, data);
            }

            function initModal(isDrawDrft) {
                if (isDrawDrft) {
                    $(".read-agree").html("我已认真阅读并同意接受<a>《晨蜂金融平台宝券开具协议》</a>的全部内容。");
                } else {
                    $(".read-agree").html("我已认真阅读并同意接受<a>《晨蜂金融平台宝券应收账款债权转让协议》</a>及<a>《债权转让通知》</a>的全部内容。");
                }
            }

            //初始化radio
            initRejectRadioComponent($("#draftSign"), "RR4");


            //确认签收 
            $("#sign").on("click", function() {
                $("#my_confirmSign").modal("show");
                $("#read").siblings("div").children("span").removeClass("active");
                $("#smsCode").val("");
            });

            //驳回
            $("#cancel").on("click", function() {
                $("#rejectModal").modal("show");
                $("#info").siblings("div").children("span").addClass("active");
                $("#info").parents("div").siblings("div").find("span").removeClass("active");
            });

            //获取短信验证码
            $("#sendSmsCode").on("click", function() {
                getSMSCode($(this), "0010_110005", { bussType: 'QS01' });
            });

            //审批
            $("#apprBtn,#canlBtn").on("click", function() {
                var flag = $(this).attr("id") == "canlBtn";
                var smsCode = $("#smsCode").val();
                var appStat = flag ? "2" : "1";
                var appRmk;
                if (appStat == 2) {
                    appRmk = $("#draftSign").attr("back");
                }
                var signList = [id];
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
                        code: "0010_800005",
                        method: "POST",
                        data: {
                            "smsCode": smsCode,
                            "appStat": appStat,
                            "appRmk": appRmk,
                            "signList": signList
                        },
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                flag ? initCanlPage($("#rejectModal"), $(".rejectTips"), $("#draftSign"), 1) :
                                    initSuccPage($("#my_confirmSign"), 1, null, $("#txnAmt").text(), null, 1);
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
                $("#draftSign").trigger("click");
            });

        });
    }

});