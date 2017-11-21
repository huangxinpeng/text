/*
 * @Author: huanghaisheng 
 * @Date: 2017-08-04 09:52:03 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 15:48:42
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
    'draftSignDtl',
    'draftSignHis',
    'draftSignProt',
    'text!tpls/draftSign.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftSignDtl, draftSignHis, draftSignProt, draftSignTpl, footer) {
    return function() {
        var $draftSignTpl = $(draftSignTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftSignTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //宝券签收-签收历史
            $("#querySignHis").on("click", function() {
                draftSignHis();
            });

            //初始化分页控件
            initPageComponent(loadData);

            //初始化页面
            initPage(2);

            renderTask(1);

            var obj = {}; //查询条件
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize });
            loadData();

            function loadData() {
                obj = $.extend(obj, getPageInfo());
                var pageNumNew = $("#draftSign").attr("pageNum");
                $("#draftSign").removeAttr("pageNum");
                if (IFSCommonMethod.isNotBlank(pageNumNew)) {
                    obj = $.extend(obj, { "pageNum": pageNumNew });
                }
                $(window).IFSAjax({
                    code: "0010_800002",
                    method: "POST",
                    data: $.extend({}, obj),
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

            function successFun(data) {
                $("#signAmtSum").text(IFSCommonMethod.formatMoney(data.sum));
                setTotalPage(data.lists.total, obj.pageNum, obj.pageSize); //设置分页
                var objStr = "";
                var isDrawDrft;
                if (IFSCommonMethod.isNotBlank(data.lists.list)) {
                    var list = data.lists.list;
                    var html = [];
                    if (IFSCommonMethod.isNotBlank(list[0].appNo)) {
                        isDrawDrft = list[0].appNo.substring(0, 2) == "10" ? true : false;
                    }
                    for (var i = 0; i < list.length; i++) {
                        html.push('<tr data-id="' + list[i].id + '">\
                            <td><span><input type="checkbox" id="checkOne' + i + '"><label for="checkOne' + i + '"></label></span></td>\
                            <td>' + list[i].srcDrftNo + '</td>\
                            <td>' + IFSCommonMethod.formatMoney(list[i].txnAmt) + '</td>\
                            <td>' + list[i].reqCustNm + '</td>\
                            <td>' + IFSCommonMethod.str2Date(list[i].srcDueDt) + '</td>\
                            <td>' + IFSCommonMethod.formatReturnNullData(list[i].delayDays) + '</td>\
                            <td>' + IFSCommonMethod.formatDate(list[i].recDt) + '</td>\
                            </tr>');
                    }
                    $(".table tbody").empty().append(html.join(""));
                    $("#noDataTip").css("display", "none");
                } else {
                    $(".table tbody").empty();
                    $("#noDataTip").css("display", "block");
                }
                //初始化checkbox
                var drftInfo = $("#draftSign").attr("info");
                $("#draftSign").removeAttr("info");
                var bqids;
                if (IFSCommonMethod.isNotBlank(drftInfo)) {
                    drftInfo = JSON.parse(drftInfo);
                    for (var i = 0; i < drftInfo.length; i++) {
                        bqids += drftInfo[i][0] + ",";
                    }
                    bqids = bqids.substring(0, bqids.length - 1);
                }
                initCheckBoxComponent(bqids, 0, draftSignDtl);
                initModal(isDrawDrft);
                protLinkClickEvent(1, null, draftSignProt, null, obj.pageNum);
            }

            function initModal(isDrawDrft) {
                if (isDrawDrft) {
                    $(".read-agree").html("我已认真阅读并同意接受<a>《晨蜂金融平台宝券开具协议》</a>的全部内容。");
                } else {
                    $(".read-agree").html("我已认真阅读并同意接受<a>《晨蜂金融平台宝券应收账款债权转让协议》</a>及<a>《债权转让通知》</a>的全部内容。");
                }
            }

            //模态框radio
            initModalRadioComponent();

            //初始化radio
            initRejectRadioComponent($("#draftSign"), "RR4");

            //确认签收 
            $("#sign").on("click", function() {
                if (!isChecked()) {
                    pluginObj.alert("请先选择一条宝券!");
                } else {
                    $("#my_confirmSign").modal("show");
                    $("#read").siblings("div").children("span").removeClass("active");
                    $("#smsCode").val("");
                }
            });

            //签收驳回 
            $("#signCanl").on("click", function() {
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
                var signList = [];
                var checkInfo = getCheckedInfo();
                for (var i = 0; i < checkInfo.length; i++) {
                    signList.push(checkInfo[i][0]);
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
                                    initSuccPage($("#my_confirmSign"), 2, getCheckedNum(), getCheckedDrftAmt(), null, 1);
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