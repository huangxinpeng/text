/*
 * @Author: chengdan 
 * @Date: 2017-10-12 11:37:51 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 09:57:43
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
    'text!tpls/draftSignProt.html',
    'text!tpls/../protocals/accounReceivablesTransferProtocal.html',
    'text!tpls/../protocals/treasureBilOpenAgreement.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftSignProtTpl, accounReceivablesTransferProtocal, treasureBilOpenAgreement, footer) {
    return function(name, info, pageNum) {
        var $draftSignProtTpl = $(draftSignProtTpl)
        var $footer = $(footer);
        var $accounReceivablesTransferProtocal = $(accounReceivablesTransferProtocal);
        var $treasureBilOpenAgreement = $(treasureBilOpenAgreement);
        $('.content').empty();
        $('.content').append($draftSignProtTpl);
        $('#protocolModal .scrollbar').append($accounReceivablesTransferProtocal);
        $('#drawProtocolModal .scrollbar').append($treasureBilOpenAgreement);
        $('.content').append($footer);
        $(document).ready(function() {
            loadPro();

            function loadPro() {
                var time = IFSCommonMethod.getCurrentTime();
                IFSCommonMethod.isContains(name, "转让协议") == true ? $("#txnProType").text("转让协议列表") :
                    (IFSCommonMethod.isContains(name, "开具协议") == true ? $("#txnProType").text("开具协议列表") :
                        $("#txnProType").text("转让通知列表"));
                $(".spanNote").text("您在此页面可查看宝券签收" + $("#txnProType").text());
                var obj = $("#protocol").children().eq(0); //隐藏的第一个模板元素
                var objStr = "";
                for (var i = 0; i < info.length; i++) {
                    objStr += "<div class='onePro'>";
                    obj.find(".id").text(info[i][0]);
                    obj.find(".drftNo").text(info[i][1]);
                    obj.find(".proName").text(name.substring(1).substring(0, name.length - 2));
                    obj.find(".time").text(time);
                    objStr += obj.html();
                    objStr += "</div><hr class='form-hr' />";
                }
                $("#protocol").html(objStr);
                initClick();
            }

            function initClick() {
                $(".onePro").on("click", function() {
                    $(window).IFSAjax({
                        code: "0010_800003",
                        method: "POST",
                        data: { "id": $(this).find(".id").text() },
                        async: false,
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                renderProtData(result.data, name);
                            } else {
                                pluginObj.alert(result.message);
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                });
            }

            $("#returnPre").on("click", function() {
                $("#draftSign").attr("pageNum", pageNum);
                $("#draftSign").attr("info", JSON.stringify(info));
                $('#draftSign').trigger('click');
                $("#sign").trigger('click');
            });
        });
    }
});