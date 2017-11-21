/*
 * @Author: huanghaisheng 
 * @Date: 2017-08-04 09:52:03 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 15:02:35
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
    'draftTxnDtl',
    'draftTxnHis',
    'draftTxnProt',
    'text!tpls/draftTxn.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftTxnDtl, draftTxnHis, draftTxnProt, draftTxnTpl, footer) {
    return function() {
        var $draftTxnTpl = $(draftTxnTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftTxnTpl);
        $('.content').append($footer);

        $(document).ready(function() {
            var type = "1"; //转让类型 1-转让复核 2-转让撤回复核

            //查看转让复核历史
            $("#queryTxnHis").on("click", function() {
                draftTxnHis();
            });

            //初始化日期插件
            dataPiker();

            //页面切换
            $("#txnAppr").addClass("btnActive");
            $("#txnRetrAppr").addClass("btnDefault");
            $("#txnAppr").on("click", function() {
                type = "1";
                $("#checkAll").prop("checked", false);
                uncheck($("#checkAll"));
                $("#txnAppr").removeClass("btnDefault").addClass("btnActive");
                $("#txnRetrAppr").removeClass("btnActive").addClass("btnDefault");
                $("#txnRetrApprBtn").css("display", "none");
                $("#txnApprBtn").css("display", "block");
                //切换tab之后重新加载数据
                obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, bussType: "01" });
                //初始化分页控件
                initPageComponent(loadData);
                loadData();
            });

            $("#txnRetrAppr").on("click", function() {
                type = "2";
                $("#checkAll").prop("checked", false);
                uncheck($("#checkAll"));
                $("#txnAppr").removeClass("btnActive").addClass("btnDefault");
                $("#txnRetrAppr").removeClass("btnDefault").addClass("btnActive");
                $("#txnApprBtn").css("display", "none");
                $("#txnRetrApprBtn").css("display", "block");
                //切换tab之后重新加载数据
                obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, bussType: "02" });
                //初始化分页控件
                initPageComponent(loadData);
                loadData();
            });

            //初始化分页控件
            initPageComponent(loadData);

            //初始化页面
            initPage(2);

            var obj = {}; //查询条件
            function initByType() {
                var typeNew = $("#draftTxn").attr("type");
                $("#draftTxn").removeAttr("type");
                if (typeNew == "2") {
                    type = "2";
                    $("#txnAppr").removeClass("btnActive").addClass("btnDefault");
                    $("#txnRetrAppr").removeClass("btnDefault").addClass("btnActive");
                    $("#txnRetrApprBtn").css("display", "block");
                    $("#txnApprBtn").css("display", "none");
                    obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, bussType: "02" });
                } else {
                    type = "1";
                    $("#txnAppr").removeClass("btnDefault").addClass("btnActive");
                    $("#txnRetrAppr").removeClass("btnActive").addClass("btnDefault");
                    $("#txnRetrApprBtn").css("display", "none");
                    $("#txnApprBtn").css("display", "block");
                    obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, bussType: "01" });
                }
            }
            initByType();

            loadData(); //默认加载全部数据
            //加载数据方法
            function loadData() {
                //获取page数据
                obj = $.extend(obj, getPageInfo());
                var pageNumNew = $("#draftTxn").attr("pageNum");
                $("#draftTxn").removeAttr("pageNum");
                if (IFSCommonMethod.isNotBlank(pageNumNew)) {
                    obj = $.extend(obj, { "pageNum": pageNumNew });
                }
                $(window).IFSAjax({
                    code: "0010_810001",
                    data: $.extend({}, obj),
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            successFun(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            //成功回调
            function successFun(data) {
                $("#txnAmtSum").text(IFSCommonMethod.formatMoney(data.sum));
                setTotalPage(data.lists.total, obj.pageNum, obj.pageSize); //设置分页
                //设置撤销待复核红点
                setRedPoint(type, $("#draftTxn .badge").text(), data.lists.total);
                if (IFSCommonMethod.isNotBlank(data.lists.list)) {
                    var list = data.lists.list;
                    var html = [];
                    for (var i = 0; i < 　list.length; i++) {
                        html.push('<tr data-id="' + list[i].id + '">\
                            <td><span><input type="checkbox" id="checkOne' + i + '"><label for="checkOne' + i + '"></label></span></td>\
                            <td>' + list[i].srcDrftNo + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].txnAmt) + '</td>\
                            <td>' + list[i].rcvCustNm + '</td>\
                            <td>' + IFSCommonMethod.str2Date(list[i].dueDt) + '</td>\
                            <td>' + list[i].dueDays + '</td>\
                            <td>' + IFSCommonMethod.str2Date(list[i].txnDt) + '</td>\
                            </tr>');
                    }
                    $(".table tbody").empty().append(html.join(""));
                    $("#noDataTip").css("display", "none");
                } else {
                    $(".table tbody").empty();
                    $("#noDataTip").css("display", "block");
                }
                var bqInfo = $("#draftTxn").attr("info");
                $("#draftTxn").removeAttr("info");
                var bqids;
                if (IFSCommonMethod.isNotBlank(bqInfo)) {
                    bqInfo = JSON.parse(bqInfo);
                    for (var i = 0; i < bqInfo.length; i++) {
                        bqids += bqInfo[i][0] + ",";
                    }
                    bqids = bqids.substring(0, bqids.length - 1);
                }
                initCheckBoxComponent(bqids, 3, draftTxnDtl);
                protLinkClickEvent(1, null, draftTxnProt, type, obj.pageNum);
            }

            //模态框radio
            initModalRadioComponent();

            //初始化radio
            initRejectRadioComponent($("#draftTxn"), "RR2");

            //确认复核 
            $("#appr").on("click", function() {
                if (!isChecked()) {
                    pluginObj.alert("请先选择一条宝券!");
                } else {
                    $("#my_confirmSign").modal("show");
                    $("#smsCode").val("");
                    $("#my_confirmSign .modal-title").text("宝券转让复核");
                    $("#my_confirmSign .modal-body p").text("如您确认复核该宝券转让，请进行身份验证并签署下述协议");
                }
            });

            //撤回 
            $("#retract").on("click", function() {
                if (!isChecked()) {
                    pluginObj.alert("请先选择一条宝券!");
                } else {
                    $("#my_confirmSign").modal("show");
                    $("#read").siblings("div").children("span").removeClass("active");
                    $("#smsCode").val("");
                    $("#my_confirmSign .modal-title").text("转让撤销复核");
                    $("#my_confirmSign .modal-body p").text("如您确认复核该转让撤销，请进行身份验证并签署下述协议。");
                }
            });

            //驳回 
            $("#apprCanl,#retrCanl").on("click", function() {
                if (!isChecked()) {
                    pluginObj.alert("请先选择一条宝券!");
                } else {
                    $("#rejectModal").modal("show");
                    $("#info").siblings("div").children("span").addClass("active");
                    $("#info").parents("div").siblings("div").find("span").removeClass("active");
                }
            });

            //获取短信验证码
            $("#sendSmsCode").on("click", function() {
                getSMSCode($(this), "0010_110005", { bussType: 'ZR02' });
            });

            //审批
            $("#apprBtn,#canlBtn").on("click", function() {
                var flag = $(this).attr("id") == "canlBtn";
                var smsCode = $("#smsCode").val();
                var bussType = "0" + type;
                var appStat = flag ? "2" : "1";
                var appRmk;
                if (appStat == 2) {
                    appRmk = $("#draftTxn").attr("back");
                }
                var signList = [];
                var checkInfo = getCheckedInfo();
                for (var i = 0; i < checkInfo.length; i++) {
                    list = {};
                    list["id"] = checkInfo[i][0];
                    list["srcDrftNo"] = checkInfo[i][1];
                    signList.push(list);
                }
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
                                    initSuccPage($("#my_confirmSign"), 2, getCheckedDrftNo(), getCheckedDrftAmt(), type, 2);
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