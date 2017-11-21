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
    './bankAcctVerSucTwo',
    'text!tpls/bankAcctVerTwo.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, bankAcctVerSucTwo, bankAcctVerTwoTpl, footer) {
    return function(id, orign) {
        var $bankAcctVerTwoTpl = $(bankAcctVerTwoTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($bankAcctVerTwoTpl);
        $('.content').append($footer);

        initPage();

        function initPage() {
            if (orign == "1") { //可用
                $(".pathTitle").html('<span class="spanTitle">企业信息>银行账号><a href="javascript:;" alt="">账号信息</a></span>\
            <span class="spanNote">您可在此页面可查看银行账号信息</span>');
                $(".path").html("银行账号信息");
                $(".accountInfo").show();
                $(".verifyInfo").hide();
            } else {
                $(".pathTitle").html('<span class="spanTitle">企业信息>银行账号><a href="javascript:;" alt="">账号验证</a></span>\
                <span class="spanNote">您可在此页面可验证已打款的银行账号</span>');
                $(".path").html("验证银行账号");
                $(".verifyInfo").show();
                $(".accountInfo").hide();
            }
        }

        $(document).ready(function() {

            var obj = {}; //查询参数
            obj.id = id;
            //获取银行账号信息
            getBankAccountInfo();

            function getBankAccountInfo() {

                $(window).IFSAjax({
                    code: "0010_170003",
                    method: "POST",
                    data: $.extend({}, obj),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            initAccountInfo(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function initAccountInfo(data) {
                $("#sbtAmt").attr("data-id", data.id);
                $("#dltAccount").attr("data-id", data.id);
                $("#openAcctNm").val(data.openAcctNm);
                $("#openAcctNm1").html(data.openAcctNm);
                $("#acctNo").val(data.acctNo);
                $("#accNo").html(data.acctNo);
                $("#openBrhNm").val(data.openBrhNm);
                $("#bankProvince").attr("data-value", data.bankProvince);
                $("#bankCity").attr("data-value", data.bankCity);
                $("#openBrhCd").val(data.openBrhCd);
                if (data.defRecNo == "1") {
                    $("[name=defRecNo][value='1']").prop("checked", true);
                } else {
                    $("[name=defRecNo][value='0']").prop("checked", true);
                }
                //省市下拉
                $("#bankProvince").getSelInfo('0010_110004', {
                    parentId: "",
                    areaType: "1"
                }, "areaId", "areaName", "请选择省");
                $("#bankProvince").change(function() {
                    $("#bankCity").getSelInfo('0010_110004', {
                        parentId: $("#bankProvince").val(),
                        areaType: "2"
                    }, "areaId", "areaName", "请选择市")
                }).trigger("change");
            }

            //提交验证
            $(".confirm").click(function() {
                $("#verifyAccount").modal("show");
            });
            $("#sbt").click(function() {
                $("#verifyAccount").modal("hide");
                setTimeout(function() {
                    bankAcctVerSucTwo();
                }, 500);
            });
            //删除银行账户
            $("#dltAccount").click(function() {
                var id = $(this).attr("data-id");
                pluginObj.confirm("删除账户", "您确认要删除账户？", function() {
                    //    发请求
                    delAcct(id);
                }, function() {})
            });

            function delAcct(id) {
                $(window).IFSAjax({
                    code: "0010_170006",
                    data: { id: id },
                    method: "POST",
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            pluginObj.alert("删除成功！");
                            setTimeout(function() {
                                $("#bankAcct").trigger("click");
                            }, 300);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            //获取验证码
            $("#checkCodeGet").click(function() {
                getSMSCode($(this), "0010_110005", {
                    bussType: "ZH03"
                })
            });

            //银行账号打款
            $("#sbtAmt").click(function() {
                var id = $(this).attr("data-id");
                //手动触发验证
                var bootstrapValidator = $("#verifySbt").data('bootstrapValidator');
                bootstrapValidator.validate();
                if (!bootstrapValidator.isValid()) {
                    $("#errorMsg").show();
                    return;
                }
                if (bootstrapValidator.isValid()) {
                    //表单提交的方法、比如ajax提交
                    $(window).IFSAjax({
                        code: "0010_170004",
                        data: $.extend($("#verifySbt").getData(), { id: id }),
                        complete: function(result) {
                            if (result.code == IFSConfig.resultCode) {
                                $("#verifyAccount").modal("hide");
                                setTimeout(function() {
                                    bankAcctVerSucTwo();
                                }, 300);
                            } else {
                                pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                            }
                        },
                        error: function(status, XMLHttpRequest) {}
                    });
                }

            });

            //校验
            $('#verifySbt').bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {

                    smsCode: {
                        message: '短信验证码不合法',
                        validators: {
                            notEmpty: {
                                message: '短信验证码不能为空'
                            },
                            stringLength: {
                                min: 6,
                                max: 6,
                                message: '短信验证码是6位数字'
                            },
                            regexp: {
                                regexp: /^\d{6}$/,
                                message: '验证码格式不合法'
                            }
                        }
                    },
                    amount: {
                        message: '验证金额不合法',
                        validators: {
                            notEmpty: {
                                message: '验证金额不能为空'
                            },
                            regexp: {
                                regexp: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                                message: '输入金额格式不合法'
                            }
                        }
                    }
                }
            });

            //设置默认银行账号
            $(".definedRadio").click(function(e) {
                e.preventDefault();
                if ($(this).find("input").prop("checked") == true) {
                    pluginObj.confirm("设置账号为默认银行账号", "要该账号为默认银行账号？", function() {
                        setDefAccount(id);
                    }, function() {});
                }

            });

            function setDefAccount(id) {
                $(window).IFSAjax({
                    code: "0010_170007",
                    method: "POST",
                    data: { id: id },
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            pluginObj.alert("当前账号被设置为默认账号");
                            setTimeout(function() {
                                $("#bankAcct").trigger("click");
                            }, 500);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
        });
    }
});