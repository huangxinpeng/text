/*
 * @Author: chengdan 
 * @Date: 2017-09-01 17:00:14 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 14:32:51
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
    'myDraftDisctApplyOne',
    'text!tpls/myDraftDisctApplyTwo.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, myDraftDisctApplyOne, myDraftDisctApplyTwoTpl, footer) {
    return function(drftInfo, disctInfo, pageNum) {
        var $myDraftDisctApplyTwoTpl = $(myDraftDisctApplyTwoTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftDisctApplyTwoTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化页面
            initPage();

            //根据勾选的宝券编号加载宝券信息
            var loadData = function() {
                var obj = $("#drftInfo").children().eq(0); //隐藏的第一个模板元素
                var objStr = "";
                var totalDisctAmt = 0;
                for (var i = 0; i < drftInfo.length; i++) {
                    objStr += "<div class='disctDrftInfo1'>";
                    obj.find(".srcDrftNo").text(drftInfo[i][1]);
                    obj.find(".disctAmt").text(IFSCommonMethod.formatMoney(drftInfo[i][8]));
                    obj.find(".srcDueDt").text(drftInfo[i][5]);
                    obj.find(".intRate").text(drftInfo[i][9]);
                    var dcInterest = parseFloat(drftInfo[i][8]) * parseFloat($(".intRate").text()) * parseInt(drftInfo[i][5]) / 36000;
                    obj.find(".dcInterest").text(IFSCommonMethod.formatMoney(dcInterest));
                    objStr += obj.html();
                    objStr += "</div>";
                    totalDisctAmt += parseFloat(drftInfo[i][8]);
                }
                $("#drftInfo").html(objStr);
                //初始化融资信息
                $("#totalDisctAmt").text(IFSCommonMethod.formatMoney(totalDisctAmt));
                $("#payAmt").text(IFSCommonMethod.formatMoney(parseFloat(totalDisctAmt) - parseFloat(IFSCommonMethod.unFormatMoney(disctInfo["rcInterest"]))));
                $("#pyeeAcct").text(initAcctNo(disctInfo["pyeeAcct"]));
                $("#pyeeBankNm").text(disctInfo["pyeeBankNm"]);
                $("#finTyp").text(disctInfo["finTyp"]);
                //数据字典
                renderDataDic();
            };
            loadData();

            function initAcctNo(acctNo) {
                acctNo = acctNo.substring(0, 4) + " **** **** " + acctNo.substring(acctNo.length - 4);
                return acctNo;
            }

            //上一步
            $("#preStep").on("click", function() {
                require("myDraftDisctApplyOne")(drftInfo, disctInfo, pageNum);
            });

            $("#nextStep").on("click", function() {
                $("#disctConfirm").modal("show");
                $("#smsCode").val("");
            })

            //获取短信验证码
            $("#sendSmsCode").on("click", function() {
                getSMSCode($(this), "0010_110005", { bussType: 'RZ01' });
            })

            //融资
            $("#disctBtn").on("click", function() {
                var smsCode = $("#smsCode").val();
                var drftApplyList = [];
                for (var i = 0; i < drftInfo.length; i++) {
                    var list = {};
                    list["srcDrftNo"] = drftInfo[i][1]; //票据号码
                    list["rateDisct"] = parseFloat(disctInfo["rateDisct"]) / 100; //优惠折扣
                    list["dcInterest"] = disctInfo["dcInterest"]; //	融资应付利息
                    list["isBouns"] = (disctInfo["useBouns"] == "0.00" ? "0" : "1"); //	"是否抵扣 0-否1-是"
                    list["useBouns"] = disctInfo["useBouns"]; //	抵扣金币
                    list["rcInterest"] = disctInfo["rcInterest"]; //	实付利息
                    list["disctAmt"] = drftInfo[i][8]; //融资金额
                    list["intRate"] = drftInfo[i][9]; //融资利率
                    list["intDays"] = drftInfo[i][5]; //融资天数
                    list["srcDueDt"] = drftInfo[i][4].replace(/-/g, ""); //原票面到期日
                    list["finTyp"] = disctInfo["finTyp"]; //融资类型1 - 无追索权融资2 - 有追索权融资
                    list["pyeeBankCity"] = disctInfo["pyeeBankCity"]; //收款行所在城市
                    list["pyeeBankNm"] = disctInfo["pyeeBankNm"]; //收款银行
                    list["pyeeBankNo"] = disctInfo["pyeeBankNo"]; //收款银行行号
                    list["pyeeAcct"] = disctInfo["pyeeAcct"]; //收款账号
                    list["pyeeAcctNm"] = disctInfo["pyeeAcctNm"]; //收款账号名称
                    drftApplyList.push(list);
                }
                if (!IFSCommonMethod.isNotBlank(smsCode)) {
                    pluginObj.alert("请输入短信验证码");
                } else {
                    $(window).IFSAjax({
                        code: "0010_320008",
                        method: "POST",
                        data: { "smsCode": smsCode, "drftApplyList": drftApplyList },
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                initSuccPage($("#disctConfirm"), null, null, result.data, null, 3);
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
                $('#myDraftDisct').trigger('click');
            });
        });

    }
});