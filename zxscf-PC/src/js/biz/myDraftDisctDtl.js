/*
 * @Author: chengdan 
 * @Date: 2017-09-06 16:15:41 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-17 11:39:32
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
    './draftDisctCertDtl',
    'myDraftDisctHis',
    'myDraftOnDisct',
    'text!tpls/myDraftDisctDtl.html',
    'text!tpls/footer.html',
], function($, bootstrap, datepicker, datepicker_zh, json, bootstrapValidator,
    global, router, routerConfig, config, regular, ajax, common, constant, draftDisctCertDtl,
    myDraftDisctHis, myDraftOnDisct, myDraftDisctDtlTpl, footer) {
    return function(type, id, visibility) {
        var $myDraftDisctDtlTpl = $(myDraftDisctDtlTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftDisctDtlTpl);
        $('.content').append($footer);
        if(visibility == "hidden"){
            $("#download").hide();
        }
        $(document).ready(function() {
            var obj = {};
            obj.bussType = "20";
            //初始化取消成功
            $(".cancelSucc").css("display", "none");
            //初始化页面
            initPage(1);

            function loadData() {
                $(window).IFSAjax({
                    code: (type == "1" ? "0010_320005" : "0010_320003"),
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
                initByStat(data.txnStat, data.appList);
                $("#drftNo").text(data.srcDrftNo);
                $("#txnDt").text(IFSCommonMethod.formatDate(data.txnDt, "yyyy-MM-dd"));
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
                $("#payAmt").text(IFSCommonMethod.formatMoney(data.payAmt));
                obj.appNo = data.appNo;
                //数据字典
                renderDataDic();
            }

            function initByStat(stat, list) {
                if (type == 1) {
                    $("#disctType").text("融资中的宝券");
                    $("#download").css("display", "none");
                    $(".spanNote").text("您在此页面可查看正在融资中的宝券信息");
                    switch (stat) {
                        case "04": //撤回待复核-查看
                            $("#calcelBtn").css("display", "none");
                        case "01": //待复核-取消
                            $("#txnStat").css("color", "#1093f4");
                            $("#disctPro").css("display", "none");
                            $("#retractBtn").css("display", "none");
                            $("#returnPreBtn").css("display", "none");
                            break;
                        case "10": //待签收 - 撤回
                            $("#txnStat").css("color", "#1093f4");
                            $("#disctPro").css("display", "none");
                            $("#calcelBtn").css("display", "none");
                            $("#returnPreBtn").css("display", "none");
                            break;
                        case "13": //放款中-查看
                            $("#lending").addClass("step2");
                            $("#lending").children().eq(1).text(list[3] == null ? "" : IFSCommonMethod.str2Date(list[3].acptTs));
                        case "11": //受理中-查看
                            $("#approve").addClass("step2");
                            $("#approve").children().eq(1).text(list[2] == null ? "" : IFSCommonMethod.str2Date(list[2].acptTs));
                            //case "02": //已复核-查看
                            $("#review").addClass("step2");
                            $("#commit").children().eq(1).text(list[0] == null ? "" : IFSCommonMethod.str2Date(list[0].acptTs));
                            $("#review").children().eq(1).text(list[1] == null ? "" : IFSCommonMethod.str2Date(list[1].acptTs));
                            $("#txnStat").css("color", "#e71e1e");
                            $("#calcelBtn").css("display", "none");
                            $("#retractBtn").css("display", "none");
                            $("#returnPreBtn").css("display", "none");
                            break;
                    }
                } else if (type == 2) { //融资历史-查看
                    $("#disctType").text("融资历史");
                    $(".spanNote").text("您在此页面可查看融资历史的宝券详细信息");
                    $("#disctPro").css("display", "none");
                    $("#returnBtn").css("display", "none");
                    $("#calcelBtn").css("display", "none");
                    $("#retractBtn").css("display", "none");
                }
            }

            //返回上一页
            $("#returnBtn").on("click", function() {
                require("myDraftOnDisct")();
            });

            //返回上级页页
            $("#returnPreBtn").on("click", function() {
                require("myDraftDisctHis")();
            });

            //取消融资
            $("#calcelBtn").on("click", function() {
                pluginObj.confirm("取消确认", "确认要取消？", cancel, function() {});
            });

            function cancel() {
                $(window).IFSAjax({
                    code: "0010_320006",
                    method: "POST",
                    data: { "id": id },
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            initCanlPage($("#gConfirmModal"), $(".cancelSucc"), $("#myDraftDisct"), 3, $("#queryOnDisct"));
                        } else {
                            pluginObj.alert(result.message);
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            //撤回融资
            $("#retractBtn").on("click", function() {
                $("#disctConfirm").modal("show");
                $("#smsCode").val("");
                $("#drftNoModal").text($("#drftNo").text());
                $("#disctAmtModal").text($("#disctAmt").text());
            });

            //获取短信验证码
            $("#sendSmsCode").on("click", function() {
                getSMSCode($(this), "0010_110005", { bussType: 'RZ10' });
            })

            //撤回
            $("#retract").on("click", function() {
                var smsCode = $("#smsCode").val();
                if (!IFSCommonMethod.isNotBlank(smsCode)) {
                    pluginObj.alert("请输入短信验证码");
                } else {
                    $(window).IFSAjax({
                        code: "0010_320007",
                        method: "POST",
                        data: { "id": id, "smsCode": smsCode },
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                initSuccPage($("#disctConfirm"), 1, $("#drftNoModal").text(), $("#disctAmtModal").text(), null, 3);
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
                $("#myDraftDisct").trigger("click");
                $("#queryOnDisct").trigger("click");
            });


            $(".fr").click(function() {
                if ($(this).attr("data-type") == "0") {
                    $("#rzPDF .modal-title").html($(this).siblings("label").html());
                    $("#rzPDF").modal("show");
                    obj.fileType = "MB07";
                    getCertification();

                } else if ($(this).attr("data-type") == "1") {
                    obj.fileType = "MB11";
                    $(".content").empty();
                    draftDisctCertDtl(id, obj, "task", type)
                } else if ($(this).attr("data-type") == "2") {
                    $("#rzPDF .modal-title").html($(this).siblings("label").html());
                    $("#rzPDF").modal("show");
                    obj.fileType = "MB06";
                    getCertification();

                }
            });

            function getCertification() {
                $("iframe").attr("src", "/esif-webapp/certificates/fileDownload?appNo=" + obj.appNo + "&fileType=" + obj.fileType + "&bussType=" + obj.bussType + "&tnCode=1");

            }
        });

    }
});