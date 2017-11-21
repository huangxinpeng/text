/*
 * @Author: chengdan 
 * @Date: 2017-08-09 10:52:03  
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 15:53:56
 */
define([
    'jquery',
    'bootstrap',
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
    'text!tpls/myDraftPay.html',
    'text!tpls/footer.html',
], function($, bootstrap, json, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, myDraftPayTpl, footer) {
    return function() {
        var $myDraftPayTpl = $(myDraftPayTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftPayTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化分页控件
            initPageComponent(loadData);

            //初始化页面
            initPage();

            var obj = {};
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize });

            function loadData() {
                obj = $.extend(obj, getPageInfo());
                $(window).IFSAjax({
                    code: "0010_330001",
                    method: "POST",
                    data: $.extend(obj, {}),
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
                setTotalPage(data.total, obj.pageNum, obj.pageSize);
                var objStr = "";
                if (IFSCommonMethod.isNotBlank(data.list)) {
                    for (var i = 0; i < data.list.length; i++) {
                        var drftInfo = data.list[i];
                        var amt = IFSCommonMethod.formatCMoney(drftInfo.validAmt);
                        objStr += "<tr><td><span><input type='checkbox' id='" + i +
                            "'><label for='" + i + "'></label></span></td>" +
                            "<td hidden>" + drftInfo.id + "</td>" +
                            "<td>" + drftInfo.drftNo + "</td>" +
                            "<td hidden>" + drftInfo.validAmt + "</> " +
                            "<td class='bqjetd'><span>" + amt[0] + "</span><span> 万 </span><span>" + amt[1] + "</span></td> " +
                            "<td>" + (drftInfo.drwrNm == null ? "" : drftInfo.drwrNm) + "</td>" +
                            "<td>" + IFSCommonMethod.formatDate(drftInfo.dueDt, "yyyy-MM-dd") + "</td>" +
                            "<td hidden>" + drftInfo.dueDays + "</td>" +
                            "</tr>";

                    }
                    $(".table tbody").html(objStr);
                    $("#noDataTip").css("display", "none");
                } else {
                    $(".table tbody").empty();
                    $("#noDataTip").css("display", "block");
                }

                //初始化checkbox
                initCheckBoxComponent();
            }

            //申请兑付
            $("#applyPay").on("click", function() {
                if (!isChecked()) {
                    pluginObj.alert("请先选择一条宝券!");
                } else {
                    $("#payConfirm").modal("show");
                    $("#smsCode").val("");
                    queryBankInfo();
                }
            });

            //加载银行信息
            function queryBankInfo() {
                $(window).IFSAjax({
                    code: "0010_170001",
                    method: "POST",
                    data: {
                        "pageNum": 1,
                        "pageSize": 100,
                        "checkStu": 2
                    },
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            loadBankInfo(result.data);
                        } else {
                            pluginObj.alert(result.message);
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function loadBankInfo(data) {
                var objStr = "";
                var str = "";
                if (data.list != null && data.list.length > 0) {
                    for (var i = 0; i < data.list.length; i++) {
                        var bankInfo = data.list[i];
                        objStr += "<li><span hidden>" + bankInfo.id + "</span>" +
                            "<span>" + bankInfo.openBrhNm + "</span>" +
                            "<span>" + bankInfo.acctNo + "</span>" +
                            "<span class='badge mrzh'>" + (bankInfo.defRecNo == "1" ? "默认" : "") + "</span></li>";
                        if (bankInfo.defRecNo == "1") {
                            str = "<span hidden>" + bankInfo.id + "</span>" +
                                "<span>" + bankInfo.openBrhNm + "</span>" +
                                "<span>" + bankInfo.acctNo + "</span>" +
                                "<span class='badge mrzh'>默认</span></li>";
                        }
                    }
                    if (str != "") {
                        $(".my_signContent #change").empty().html(str);
                    } else {
                        $(".my_signContent #change").empty().html("<span>请选择收款账号</span>");
                    }
                    $(".my_signContent .dropdown-menu").empty().html(objStr);
                } else {
                    $(".my_signContent #change").empty().html("<span>请选择收款账号</span>");
                }
                initBankClick();
            }

            function initBankClick() {
                $(".dropdown-menu li").on("click", function() {
                    $("#change").empty();
                    $("#change").html($(this).html());
                });
            }

            //获取短信验证码
            $("#sendSmsCode").on("click", function() {
                getSMSCode($(this), "0010_110005", { bussType: 'JF01' });
            })

            //承兑
            $("#applyPayBtn").on("click", function() {
                var drftList = [];
                var smsCode = $("#smsCode").val(); //验证码
                var acctNo = $("#change").children().eq(2).text();
                var info = getCheckedInfo();
                for (var i = 0; i < info.length; i++) {
                    var list = {};
                    list["rcvCustNo"] = $("#curId").text(); //客户号
                    list["rcvCustNm"] = $("#curE").text(); //客户名称
                    list["id"] = info[i][0]; //票据id
                    list["drftNo"] = info[i][1]; //票据号码
                    list["isseAmt"] = IFSCommonMethod.unFormatCMoney(info[i][2]); //客户号
                    list["dueDays"] = info[i][6]; //距到期日
                    list["delayDays"] = info[i][5].replace(/-/g, ''); //到期日
                    list["acctNo"] = acctNo;
                    drftList.push(list);
                }
                if (!IFSCommonMethod.isNotBlank(acctNo)) {
                    pluginObj.alert("请选择收款账号");
                } else if (!IFSCommonMethod.isNotBlank(smsCode)) {
                    pluginObj.alert("请输入短信验证码");
                    $("#smsCode").val("");
                } else {
                    $(window).IFSAjax({
                        code: "0010_330002",
                        method: "POST",
                        data: {
                            "smsCode": smsCode,
                            "drftList": drftList
                        },
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                initSuccPage($("#payConfirm"));
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
                $('#myDraftPay').trigger('click');
            });
        });
    }
});