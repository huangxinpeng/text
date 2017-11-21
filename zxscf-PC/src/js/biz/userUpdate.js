/**
 * Created by baikaili on 2017/8/29.
 */

define([
    'jquery',
    'json',
    'bootstrap',
    'bootstrapValidator',
    'upload',
    'global',
    'router',
    'routerConfig',
    'config',
    'regular',
    'ajax',
    'common',
    'constant',
    'text!tpls/userUpdate.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, upload, global, router, routerConfig, config,
    regular, ajax, common, constant, userUpdateTpl, footer) {
    return function(id) {
        var $userUpdateTpl = $(userUpdateTpl)
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($userUpdateTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            var obj;
            var fileFlag = false;
            //初始化用户信息
            loadData(id);

            function loadData(id) {
                $(window).IFSAjax({
                    code: "0010_180006",
                    data: $.extend({}, { id: id }),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            initUpdInfo(result.data)
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function initUpdInfo(data) {
                if (IFSCommonMethod.isNotBlank(data)) {
                    $("#usrNm1").val(data.usrNm);
                    $("#idNo").val(data.idNo);
                    $("#mobile").val(data.mobile);
                    $("input[name=role]").each(function() {
                        if (data.corpRoleIdList.indexOf($(this).val()) >= 0) {
                            obj = $(this).prop("checked", true);
                        }
                    });
                    $("#sbtUsr").attr("data-id", data.id);
                    $("#frontImg").attr("src", "/esif-webapp/current/viewAttach?id=" + data.idCardImgFont);
                    $("#backImg").attr("src", "/esif-webapp/current/viewAttach?id=" + data.idCardImgReverse);
                    $("#auth").attr("src", "/esif-webapp/current/viewAttach?id=" + data.poaImg);
                    renderDataDic(); //加载页面数据字典
                }
            }


            //提交修改用户信息
            $("#sbtUsr").click(function() {

                //手动触发验证
                var bootstrapValidator = $("#updUser").data('bootstrapValidator');
                bootstrapValidator.validate();
                if (!bootstrapValidator.isValid() || !fileFlag) {
                    $("#errorMsg0").show();
                    return;
                }

                //只允许更新角色
                var corpRoleIdList = [];
                $("input[name=role]:checked").each(function() {
                    corpRoleIdList.push($(this).val());
                });
                var id = $(this).attr("data-id");
                var smsCode = $("#checkCode").val();

                obj = [{ name: "id", value: id },
                    { name: "sysCode", value: "20" },
                    { name: "corpRoleIdList", value: corpRoleIdList },
                    { name: "smsCode", value: smsCode }
                ];

                var fileInfo = [
                    { "name": "attachDivPoa", "id": "authFile" }
                ];
                fileUpload('0010_180007', fileInfo, obj, successFun);
            }).blur(function() {
                $("#errorMsg0").hide();
            });

            function successFun() {
                pluginObj.alert("用户信息更新成功！");
                setTimeout(function() {
                    $("#userMgt").trigger("click");
                }, 500);
            }

            //短信验证码获取
            $("#checkCodeGet").click(function() {
                var _this = $(this);
                getSMSCode(_this, "0010_110005", {
                    bussType: 'YH02'
                })
            });

            //校验
            $('#updUser').bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    role: {
                        message: '至少选择一个角色',
                        validators: {
                            notEmpty: {
                                message: '至少选择一个角色'
                            },
                            callback: { /*自定义*/
                                message: '管理员、操作员、复核员三种角色不能同时拥有',
                                callback: function(value, validator, $field) {
                                    var roles = [];
                                    $("[name=role]:checked").each(function() {
                                        roles.push($(this).val());
                                    });
                                    if (IFSCommonMethod.isContains(roles, "100") && IFSCommonMethod.isContains(roles, "200") && IFSCommonMethod.isContains(roles, "300")) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                }
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
            // 证件照片上传

            $("#authUpload").click(function() {
                $("#authFile").trigger("click");
            });
            $("#authFile").on('change', function() {
                fileFlag = checkImgFile($("#authFile"), $("#errorMsg"));
            });

            $("#goBack").click(function() {
                $("#userMgt").trigger("click");
            });

        });
    }
});