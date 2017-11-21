/**
 * Created by baikaili on 2017/8/29.
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
    'draftDisctCertDtl',
    'text!tpls/draftDisctBookDtl.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftDisctCertDtl, draftDisctBookDtlTpl, footer) {
    return function(ticketId,visibility) {
        var $draftDisctBookDtlTpl = $(draftDisctBookDtlTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftDisctBookDtlTpl);
        $('.content').append($footer);
        if(visibility == "hidden"){
            $(".downloadlList").hide();
        }
        $(document).ready(function() {
            var obj = {};
            obj.bussType = "20";
            loadData();

            function loadData() {
                $(window).IFSAjax({
                    code: "0010_200008",
                    method: "POST",
                    data: { id: ticketId } || {},
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            showTransferInfo(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            //渲染转让信息
            function showTransferInfo(data) {
                $("[name]").each(function() {
                    var nm = $(this).attr("name");
                    $(this).html(data[nm]);
                });
                $("#txnDt").html(IFSCommonMethod.str2Date(data.txnDt));
                $("#disctAmt").html(IFSCommonMethod.formatMoney(data.disctAmt));
                $("#payAmt").html(IFSCommonMethod.formatMoney(data.payAmt));
                $("#dcInterest").html(IFSCommonMethod.formatMoney(data.dcInterest));
                $("#rcInterest").html(IFSCommonMethod.formatMoney(data.rcInterest));
                $("#srcDrftNo").html(data.srcDrftNo);
                renderDataDic();
                obj.appNo = data.appNo;
            }
            $(".goUp .btn").click(function() {
                $("#draftDisctBook").trigger("click");
            });
            $(".rzld").click(function() {
                $(".modal-title").html($(this).siblings("span").html());
                if ($(this).attr("data-type") == "0") {
                    obj.fileType = "MB07";
                    $("#rzPDF").modal("show");
                    $("iframe").attr("src", "/esif-webapp/certificates/fileDownload?appNo=" + obj.appNo + "&fileType=" + obj.fileType + "&bussType=" + obj.bussType + "&tnCode=1");
                } else if ($(this).attr("data-type") == "1") {
                    obj.fileType = "MB11";
                    draftDisctCertDtl(ticketId, obj, "acc");
                } else if ($(this).attr("data-type") == "2") {
                    obj.fileType = "MB06";
                    $("#rzPDF").modal("show");
                    $("iframe").attr("src", "/esif-webapp/certificates/fileDownload?appNo=" + obj.appNo + "&fileType=" + obj.fileType + "&bussType=" + obj.bussType + "&tnCode=1");
                }

            });
        });
    }
});