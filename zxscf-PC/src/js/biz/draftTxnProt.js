/*
 * @Author: chengdan 
 * @Date: 2017-10-12 11:37:51 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-17 17:53:28
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
    'text!tpls/draftTxnProt.html',
    'text!tpls/../protocals/accounReceivablesTransferProtocal.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, draftTxnProtTpl, accounReceivablesTransferProtocal, footer) {
    return function(type, name, info, pageNum) {
        var $draftTxnProtTpl = $(draftTxnProtTpl)
        var $footer = $(footer);
        var $accounReceivablesTransferProtocal = $(accounReceivablesTransferProtocal);
        $('.content').empty();
        $('.content').append($draftTxnProtTpl);
        $('.scrollbar').append($accounReceivablesTransferProtocal);
        $('.content').append($footer);
        $(document).ready(function() {
            loadPro();

            function loadPro() {
                var spanNote;
                var time = IFSCommonMethod.getCurrentTime();
                type == "1" ? $("#txnType").text("转让待复核") : $("#txnType").text("转让撤销待复核");
                IFSCommonMethod.isContains(name, "转让协议") == true ? $("#txnProType").text("转让协议列表") : $("#txnProType").text("转让通知列表");
                type == "1" ? (IFSCommonMethod.isContains(name, "转让协议") == true ?
                        spanNote = "待复核转让的协议列表" : spanNote = "待复核转让的通知列表") :
                    (IFSCommonMethod.isContains(name, "转让协议") == true ?
                        spanNote = "撤销待复核转让的协议列表" : spanNote = "撤销待复核转让的通知列表");
                $(".spanNote").text("您在此页面可查看" + spanNote);
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
                $("#draftTxn").attr("type", type);
                $("#draftTxn").attr("pageNum", pageNum);
                $("#draftTxn").attr("info", JSON.stringify(info));
                $('#draftTxn').trigger('click');
                type == "2" ? $("#retract").trigger('click') : $("#appr").trigger('click')
            });
        });
    }
});