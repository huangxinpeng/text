/*
 * @Author: chengdan 
 * @Date: 2017-08-17 14:57:56 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-13 10:39:57
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
    'modifyPwdTwo',
    'text!tpls/modifyPwdOne.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, modifyPwdTwo, modifyPwdOneTpl, footer) {
    return function() {
        var $modifyPwdOneTpl = $(modifyPwdOneTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($modifyPwdOneTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //图标样式
            $("#one").addClass("oneStep");

            //页面btn提交
            $("#twoToThreeBtn").on("click", function() {
                    //手动触发验证
                    var bootstrapValidator = $("#grxxform").data('bootstrapValidator');
                    bootstrapValidator.validate();
                    if (!bootstrapValidator.isValid()) {
                        return;
                    }
                    //获取页面数据
                    var obj = $("#grxxform").getData();
                    $(window).IFSAjax({
                        code: "0010_120003",
                        method: "POST",
                        data: $.extend(obj, { bussType: 'MM01' }),
                        complete: function(result) {
                            if (result.code = IFSConfig.resultCode) {
                                modifyPwdTwo();
                            } else {
                                pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                            }
                        },
                        error: function(status, XMLHttpRequest) {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    });

                })
                //短信验证码获取
            $("#sendValid").click(function() {
                var _this = $(this);
                getSMSCode(_this, "0010_110005", {
                    bussType: 'MM01'
                })
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
                                message: '手机号码格式不对'
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