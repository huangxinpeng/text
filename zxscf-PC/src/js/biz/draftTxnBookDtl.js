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
    'draftTxnCertDtl',
    'text!tpls/draftTxnBookDtl.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftTxnCertDtl, draftTxnBookDtlTpl, footer) {
    return function(ticketId,visibility) {
        var $draftTxnBookDtlTpl = $(draftTxnBookDtlTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftTxnBookDtlTpl);
        $('.content').append($footer);
        if(visibility == "hidden"){
            $(".downloadlList").hide();
        }
        $(document).ready(function() {

            var obj = {};
            obj.bussType = "30";
            loadData();

            function loadData() {
                $(window).IFSAjax({
                    code: "0010_200007",
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
                var infoText = '<tr>\
                        <td class="blue">' + IFSCommonMethod.str2Date(data.txnDt) + '</td>\
                        <td>' + data.rcvCustNm + '</td>\
                        <td>' + data.dueDays + '</td>\
                        <td>' + IFSCommonMethod.str2Date(data.srcDueDt) + '</td>\
                        <td class="blue">' + data.txnStat + '</td>\
                    </tr>'
                $("#ticketDetail tbody").empty().append(infoText);
                $("#totalAmt").html(IFSCommonMethod.formatMoney(data.txnAmt));
                $("#srcDrftNo").html(data.srcDrftNo);
                renderDataDic();
                obj.appNo = data.appNo;
            }
            $(".goUp .btn").click(function() {
                $("#draftTxnBook").trigger("click");
            });
            $(".zrld").click(function() {
                $(".modal-title").html($(this).siblings("span").html());
                if ($(this).attr("data-type") == "0") {
                    obj.fileType = "MB05";
                    getCertification();
                    $("#zrPDF").modal("show");
                } else if ($(this).attr("data-type") == "1") {
                    draftTxnCertDtl(ticketId, "accZ", obj);
                } else if ($(this).attr("data-type") == "2") {
                    obj.fileType = "MB06";
                    getCertification();
                    $("#zrPDF").modal("show");
                }
            });

            function getCertification() {
                $("iframe").attr("src", "/esif-webapp/certificates/fileDownload?appNo=" + obj.appNo + "&fileType=" + obj.fileType + "&bussType=" + obj.bussType + "&tnCode=1");
            }
        });
    }
});