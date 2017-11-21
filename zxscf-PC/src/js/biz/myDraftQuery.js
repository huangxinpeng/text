/*
 * @Author: chengdan
 * @Date: 2017-08-09 10:52:03 
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
    'myDraftQueryDtl',
    'text!tpls/myDraftQuery.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, myDraftQueryDtl, myDraftQueryTpl, footer) {
    return function() {
        var $myDraftQueryTpl = $(myDraftQueryTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($myDraftQueryTpl);
        $('.content').append($footer);

        $(document).ready(function() {
            //初始化日期插件
            dataPiker();

            //初始化radio
            $("#all").siblings("div").children("span").addClass("active");
            $("#myDraftQuery").attr("status", "");
            $("input[name=drftStatus]").click(function() {
                $(this).siblings("div").children("span").addClass("active");
                $(this).parents("div").siblings("div").find("span").removeClass("active");
                switch ($(this).attr("id")) {
                    case "settled":
                        $("#myDraftQuery").removeAttr("status").attr("status", "90");
                        break;
                    case "useable":
                        $("#myDraftQuery").removeAttr("status").attr("status", "20");
                        break;
                    case "freeze":
                        $("#myDraftQuery").removeAttr("status").attr("status", "10");
                        break;
                    default:
                        $("#myDraftQuery").removeAttr("status").attr("status", "");
                        break;
                }
            });

            //初始化分页控件
            initPageComponent(loadData);

            //查询
            $("#queryDrft").on("click", function() {
                //获取查询条件
                var qdrftStat = $("#myDraftQuery").attr("status");
                obj = $.extend(obj, $("#query").getData(), { "qdrftStat": qdrftStat });
                obj.startDate = IFSCommonMethod.formatStartDate(obj.startDate);
                obj.endDate = IFSCommonMethod.formatEndDate(obj.endDate);
                obj.pageNum = 1; //查询条件变化时，pageNum强制变更为1
                $("#pageIndex").html("1");
                loadData();
            });

            var obj = {};
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize });

            //查询方法
            function loadData() {
                obj = $.extend(obj, getPageInfo());
                if (checkQuery(obj)) {
                    $(window).IFSAjax({
                        code: "0010_300001",
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
            };
            loadData();

            //加载页面数据
            function successFun(data) {
                setTotalPage(data.total, obj.pageNum, obj.pageSize);
                var oneDrftObj = $("#drftInfo").children().eq(0); //隐藏的第一个模板元素
                var objStr = "";
                if (IFSCommonMethod.isNotBlank(data.list)) {
                    for (var i = 0; i < data.list.length; i++) {
                        var drftInfo = data.list[i];
                        objStr += "<div class='oneDrft'>";
                        oneDrftObj.find(".drftNo").text(drftInfo.drftNo);
                        oneDrftObj.find(".drftId").text(drftInfo.id);
                        drftInfo.isConfirmed != null ?
                            (drftInfo.isConfirmed == "0" ? oneDrftObj.find(".confirmed").text("未加保").css("background-color", "#999999") :
                                oneDrftObj.find(".confirmed").text("已加保").css("background-color", "#2bc497")) : "";
                        oneDrftObj.find(".isseDt").text(IFSCommonMethod.formatDate(drftInfo.isseDt, "yyyy-MM-dd"));
                        oneDrftObj.find(".validAmt").text(IFSCommonMethod.formatMoney(drftInfo.validAmt == null ? 0 : drftInfo.validAmt));
                        oneDrftObj.find(".dueDt").text(IFSCommonMethod.formatDate(drftInfo.dueDt, "yyyy-MM-dd"));
                        oneDrftObj.find(".dueDays").text(drftInfo.dueDays);
                        oneDrftObj.find(".prevOwnerNm").text(IFSCommonMethod.formatName(drftInfo.prevOwnerNm));
                        setDrftStatus(oneDrftObj, drftInfo.drftStat);
                        objStr += oneDrftObj.html();
                        objStr += "</div>";
                    }
                    $("#drftInfo").html(objStr);
                    $("#noDataTip").css("display", "none");
                    $("#drftInfo").css("display", "block");
                } else {
                    $("#noDataTip").css("display", "block");
                    $("#drftInfo").css("display", "none");
                }
                initClick();
            }

            //设置宝券状态
            function setDrftStatus(oneDrftObj, drftStat) {
                var src = drftStat == "10" ? "../images/index/dongjie.png" :
                    (drftStat == "20" ? "../images/index/keyong.png" :
                        (drftStat == "90" ? "../images/index/yijieqing.png" : ""));
                oneDrftObj.find("img").attr("src", src);
            }

            //初始化宝券点击,根据不同状态进入不同信息页面
            function initClick() {
                $(".oneDrft").each(function() {
                    $(this).css("cursor", "pointer");
                    $(this).on("click", function() {
                        myDraftQueryDtl($(this).find(".drftId").text());
                    });
                });
            }
        });
    }
});