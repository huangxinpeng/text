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
    'text!tpls/draftSignBookDtl.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftTxnCertDtl, draftSignBookDtlTpl, footer) {
    return function(ticketId, orign) {
        var $draftSignBookDtlTpl = $(draftSignBookDtlTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($draftSignBookDtlTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            initPage();

            var obj = {};
            obj.bussType = "10";
            loadData();

            function initPage() {
                if (orign == "create") {
                    $("[data-type=3]").closest("li").show().siblings("li").hide();
                }
            }

            function loadData() {
                $(window).IFSAjax({
                    code: "0010_200006",
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
                        <td>' + data.reqCustNm + '</td>\
                        <td>' + data.dueDays + '</td>\
                        <td>' + data.drwrNm + '</td>\
                        <td class="blue">' + data.txnStat + '</td>\
                    </tr>'
                $("#ticketDetail tbody").empty().append(infoText);
                $("#totalAmt").html(IFSCommonMethod.formatMoney(data.txnAmt));
                $("#srcDrftNo").html(data.srcDrftNo);
                renderDataDic();
                obj.appNo = data.appNo;
            }
            $(".goUp .btn").click(function() {
                $("#draftSignBook").trigger("click");
            });
            //xiazai
            $(".qsld").click(function() {
                $(".modal-title").html($(this).siblings("span").html());
                if ($(this).attr("data-type") == "0") {
                    obj.fileType = "MB05";
                    getCertification();
                    $("#qsPDF").modal("show");
                } else if ($(this).attr("data-type") == "1") {
                    obj.orign = orign; //页面参数
                    draftTxnCertDtl(ticketId, "accQ", obj);
                } else if ($(this).attr("data-type") == "2") {
                    obj.fileType = "MB06";
                    getCertification();
                    $("#qsPDF").modal("show");
                } else if ($(this).attr("data-type") == "3") {
                    obj.fileType = "MB04";
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