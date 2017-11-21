/*
 * @Author: chengdan 
 * @Date: 2017-08-30 10:03:30 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-08-30 10:45:45
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
    'modifyMobileThree',
    'text!tpls/modifyMobileTwo.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, modifyMobileThree, modifyMobileTwoTpl, footer) {
    return function() {
        var $modifyMobileTwoTpl = $(modifyMobileTwoTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($modifyMobileTwoTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //图标样式
            $("#two").addClass("twoStep");


            //页面btn提交
            $("#threeToFourBtn").on("click", function() {
                var mobileNoNew = $("#mobileNoNew").val();
                var mobileValidNew = $("#mobileValidNew").val();
                var data = { "mobile": mobileNoNew, "smsCode": mobileValidNew };
                //if (validInput(mobileNoNew, mobileValidNew)) {
                var bootstrapValidator = $("#grxxform").data('bootstrapValidator');
                bootstrapValidator.validate();
                if (!bootstrapValidator.isValid()) {
                    return;
                }
                $(window).IFSAjax({
                    code: "0010_120006",
                    method: "POST",
                    data: data,
                    lock: "oneToTwoBtn",
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            modifyMobileThree();
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
                //}
            });
            $("#checkCodeGet").click(function() {
                var _this = $(this);
                getSMSCode(_this, "0010_110002", {
                    bussType: 'MM04',
                    mobileNo: $("#mobileNoNew").val()
                });
            });
            //校验
            $('#grxxform').bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    mobile: {
                        message: '手机号码不合法',
                        validators: {
                            notEmpty: {
                                message: '手机号码不能为空'
                            },
                            regexp: {
                                regexp: /^(1)[0-9]{10}$/,
                                message: '身份证格式不对'
                            }
                        }
                    },
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
                        }
                    },
                }
            });


        });
    }
});