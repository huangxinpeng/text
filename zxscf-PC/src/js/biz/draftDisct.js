/*
 * @Author: huanghaisheng 
 * @Date: 2017-08-04 09:52:03 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 14:58:36
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
    'draftDisctHis',
    'draftDisctDtl',
    'draftDisctProt',
    'text!tpls/draftDisct.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftDisctHis, draftDisctDtl, draftDisctProt, draftDisctTpl, footer) {
    return function() {
        var $draftDisctTpl = $(draftDisctTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftDisctTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            var type = "1"; //转让类型 1-转让复核 2-转让撤回复核

            //查看融资复核历史
            $("#queryDisctHis").on("click", function() {
                draftDisctHis();
            });

            //初始化日期插件
            dataPiker();

            $("#disctAppr").addClass("btnActive");
            $("#disctRetrAppr").addClass("btnDefault");
            //页面切换
            $("#disctAppr").on("click", function() {
                type = "1";
                $("#checkAll").prop("checked", false);
                uncheck($("#checkAll"));
                $("#disctAppr").removeClass("btnDefault").addClass("btnActive");
                $("#disctRetrAppr").removeClass("btnActive").addClass("btnDefault");
                $("#disctRetrApprBtn").css("display", "none");
                $("#disctApprBtn").css("display", "block");
                //切换tab之后重新加载数据
                obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, bussType: "01" });
                //初始化分页控件
                initPageComponent(loadData);
                loadData();
            });

            $("#disctRetrAppr").on("click", function() {
                type = "2";
                $("#checkAll").prop("checked", false);
                uncheck($("#checkAll"));
                $("#disctAppr").removeClass("btnActive").addClass("btnDefault");
                $("#disctRetrAppr").removeClass("btnDefault").addClass("btnActive");
                $("#disctApprBtn").css("display", "none");
                $("#disctRetrApprBtn").css("display", "block");
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
                var typenew = $("#draftDisct").attr("type");
                $("#draftDisct").removeAttr("type");
                if (typenew == "2") {
                    type = "2";
                    $("#disctAppr").removeClass("btnActive").addClass("btnDefault");
                    $("#disctRetrAppr").removeClass("btnDefault").addClass("btnActive");
                    $("#disctRetrApprBtn").css("display", "block");
                    $("#disctApprBtn").css("display", "none");
                    obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, bussType: "02" });
                } else {
                    type = "1";
                    $("#disctAppr").removeClass("btnDefault").addClass("btnActive");
                    $("#disctRetrAppr").removeClass("btnActive").addClass("btnDefault");
                    $("#disctRetrApprBtn").css("display", "none");
                    $("#disctApprBtn").css("display", "block");
                    obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, bussType: "01" });
                }
            }
            initByType();


            loadData(); //默认加载全部数据
            //加载数据方法
            function loadData() {
                //获取page数据
                obj = $.extend(obj, getPageInfo());
                var pageNumNew = $("#draftDisct").attr("pageNum");
                $("#draftDisct").removeAttr("pageNum");
                if (IFSCommonMethod.isNotBlank(pageNumNew)) {
                    obj = $.extend(obj, { "pageNum": pageNumNew });
                }
                $(window).IFSAjax({
                    code: "0010_820001",
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
                $("#apprTotalAmt").text(IFSCommonMethod.formatMoney(data.sum));
                setTotalPage(data.lists.total, obj.pageNum, obj.pageSize); //设置分页
                //设置撤销待复核红点
                setRedPoint(type, $("#draftDisct .badge").text(), data.lists.total);
                if (IFSCommonMethod.isNotBlank(data.lists.list)) {
                    var list = data.lists.list;
                    var html = [];
                    for (var i = 0; i < 　list.length; i++) {
                        html.push('<tr data-id="' + list[i].id + '">\
                            <td><span><input type="checkbox" id="checkOne' + i + '"><label for="checkOne' + i + '"></label></span></td>\
                            <td>' + list[i].srcDrftNo + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].disctAmt) + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].payAmt) + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].rcInterest) + '</td>\
                            <td>' + IFSCommonMethod.str2Date(list[i].txnDt) + '</td>\
                            </tr>')
                    }
                    $(".table tbody").empty().append(html.join(""));
                    $("#noDataTip").css("display", "none");
                } else {
                    $(".table tbody").empty();
                    $("#noDataTip").css("display", "block");
                }

                var drftInfo = $("#draftDisct").attr("info");
                $("#draftDisct").removeAttr("info");
                var ids;
                if (IFSCommonMethod.isNotBlank(drftInfo)) {
                    drftInfo = JSON.parse(drftInfo);
                    for (var i = 0; i < drftInfo.length; i++) {
                        ids += drftInfo[i][0] + ",";
                    }
                    ids = ids.substring(0, ids.length - 1);
                }
                //初始化checkbox
                initCheckBoxComponent(ids, 3, draftDisctDtl); //宝券融资-融资待复核-宝券信息
                protLinkClickEvent(1, null, draftDisctProt, type, obj.pageNum);
            }

            //模态框radio
            initModalRadioComponent();

            //初始化驳回radio
            initRejectRadioComponent($("#draftDisct"), "RR3")

            //确认复核
            $("#appr").on("click", function() {
                if (!isChecked()) {
                    pluginObj.alert("请先选择一条宝券！");
                } else {
                    $("#my_confirmSign").modal("show");
                    $("#read").siblings("div").children("span").removeClass("active");
                    $("#smsCode").val("");
                    $("#my_confirmSign .modal-title").text("宝券融资复核");
                    $("#my_confirmSign .modal-body p").text("如您确认复核该宝券融资，请进行身份验证并签署下述协议");
                }
            });

            //撤销
            $("#retract").on("click", function() {
                if (!isChecked()) {
                    pluginObj.alert("请选择一条宝券!");
                } else {
                    $("#my_confirmSign").modal("show");
                    $("#smsCode").val("");
                    $("#my_confirmSign .modal-title").text("融资撤销复核");
                    $("#my_confirmSign .modal-body p").text("如您确认复核该融资撤销，请进行身份验证并签署下述协议。");
                }
            });

            //驳回
            $("#apprCanl,#retractCanl").on("click", function() {
                if (!isChecked()) {
                    pluginObj.alert("请先选中一条宝券");
                } else {
                    $("#rejectModal").modal("show");
                    $("#info").siblings("div").children("span").addClass("active");
                    $("#info").parents("div").siblings("div").find("span").removeClass("active");
                }
            });

            //获取短信验证码
            $("#sendSmsCode").on("click", function() {
                getSMSCode($(this), "0010_110005", { bussType: 'RZ02' });
            });

            //审批
            $("#apprBtn,#canlBtn").on("click", function() {
                var flag = $(this).attr("id") == "canlBtn";
                var smsCode = $("#smsCode").val();
                var operateType = "0" + type;
                var appStat = flag ? "1" : "2";
                var appRmk;
                if (appStat == 1) {
                    appRmk = $("#draftDisct").attr("back");
                }
                var approveList = [];
                var checkInfo = getCheckedInfo();
                for (var i = 0; i < checkInfo.length; i++) {
                    approveList.push(checkInfo[i][0]);
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
                                    initSuccPage($("#my_confirmSign"), 2, getCheckedDrftNo(), getCheckedDrftAmt(), parseInt(type) + 2, 3);
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
            });


        });
    }
});