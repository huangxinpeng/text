/*
 * @Author: chengdan 
 * @Date: 2017-09-12 14:46:00 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-17 11:42:14
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
    'draftTxnCertDtl',
    'myDraftTxnHis',
    'myDraftOnTxn',
    'text!tpls/myDraftTxnDtl.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant, draftTxnCertDtl,
    myDraftTxnHis, myDraftOnTxn, myDraftTxnDtlTpl, footer) {
    return function(type, id,visibility) {
        var $myDraftTxnDtlTpl = $(myDraftTxnDtlTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftTxnDtlTpl);
        $('.content').append($footer);
        var obj = {};
        if(visibility == "hidden"){
            $("#download").hide();
        }
        $(document).ready(function() {
            obj.bussType = "30";
            //初始化取消成功
            $(".cancelSucc").css("display", "none");
            //初始化页面
            initPage(1);

            function loadData() {
                $(window).IFSAjax({
                    code: (type == "4" ? "0010_310003" : "0010_310010"),
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
            };
            loadData();

            function successFun(data) {
                $("#srcDrftNo").text(data.srcDrftNo);
                $("#txnDt").text(IFSCommonMethod.formatDate(data.txnDt, "yyyy-MM-dd"));
                $("#rcvCustNm").text(data.rcvCustNm);
                $("#dueDays").text(data.dueDays == null ? "0" : data.dueDays);
                $("#srcDueDt").text(IFSCommonMethod.formatDate(data.srcDueDt, "yyyy-MM-dd"));
                $("#txnStat").text(data.txnStat);
                $("#txnAmt").text(IFSCommonMethod.formatMoney(data.txnAmt));
                //数据字典
                renderDataDic();
                obj.appNo = data.appNo;
            }

            function initByType() {
                if (type == 4) {
                    $("#txnType").text("转让历史");
                    $(".spanNote").text("您在此页面可查看转让历史的宝券详细信息");
                    $("#returnbtn").css("display", "none");
                    $("#cancelBtn").css("display", "none");
                    $("#retractBtn").css("display", "none");
                } else {
                    $("#txnType").text("转让中的宝券");
                    $(".spanNote").text("您在此页面可查看正在转让中的宝券信息");
                    $("#download").css("display", "none");
                    $("#returnHisBtn").css("display", "none");
                    switch (type) {
                        case 1: //待复核-取消-type=1
                            $("#retractBtn").css("display", "none");
                            break;
                        case 2: //待签收-撤回-type=2
                            $("#cancelBtn").css("display", "none");
                            break;
                        case 3: //撤回待复核-查看-type=3
                            $("#cancelBtn").css("display", "none");
                            $("#retractBtn").css("display", "none");
                            break;
                    }
                }
            }

            initByType();

            //返回上一页
            $("#returnbtn").on("click", function() {
                require("myDraftOnTxn")();
            });

            //返回上级页面
            $("#returnHisBtn").on("click", function() {
                require("myDraftTxnHis")();
            });

            //取消转让
            $("#cancelBtn").on("click", function() {
                pluginObj.confirm("取消确认", "确认要取消？", cancel, function() {});
            });

            function cancel() {
                $(window).IFSAjax({
                    code: "0010_310005",
                    method: "POST",
                    data: { "id": id },
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            initCanlPage($("#gConfirmModal"), $(".cancelSucc"), $("#myDraftTxn"), 2, $("#queryOnTxn"), null, 2);
                        } else {
                            pluginObj.alert(result.message);
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            //撤回转让
            $("#retractBtn").on("click", function() {
                $("#txnConfirm").modal("show");
                $("#smsCode").val("");
                $("#drftNoModal").text($("#srcDrftNo").text());
                $("#txnAmtModal").text($("#txnAmt").text());
            });

            //获取短信验证码
            $("#sendSmsCode").on("click", function() {
                getSMSCode($(this), "0010_110005", { bussType: 'ZR04' });
            })

            //撤回
            $("#txnBtn").on("click", function() {
                var smsCode = $("#smsCode").val();
                if (!IFSCommonMethod.isNotBlank(smsCode)) {
                    pluginObj.alert("请输入短信验证码");
                } else {
                    $(window).IFSAjax({
                        code: "0010_310006",
                        method: "POST",
                        data: { "id": id, "smsCode": smsCode },
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                initSuccPage($("#txnConfirm"), 1, $("#drftNoModal").text(), $("#txnAmtModal").text());
                            } else {
                                pluginObj.alert(result.message);
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                }
            });

            //跳转到转让页面
            $("#successReturn").on("click", function() {
                $("#myDraftTxn").trigger("click");
                $("#queryOnTxn").trigger("click");
            });
            //xiazai
            $(".fr").click(function() {
                $(".modal-title").html($(this).siblings("label").html());
                if ($(this).attr("data-type") == "0") {
                    obj.fileType = "MB05";
                    getCertification();
                    $("#qsPDF").modal("show");
                } else if ($(this).attr("data-type") == "1") {
                    require('draftTxnCertDtl')(id, 'bqqsH', obj, type);
                } else if ($(this).attr("data-type") == "2") {
                    obj.fileType = "MB06";
                    getCertification();
                    $("#qsPDF").modal("show");
                }
            });

            function getCertification() {
                $("iframe").attr("src", "/esif-webapp/certificates/fileDownload?appNo=" + obj.appNo + "&fileType=" + obj.fileType + "&bussType=" + obj.bussType + "&tnCode=1");
            }
        });

    }
});