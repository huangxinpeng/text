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
    './userAdd',
    './userUpdate',
    'text!tpls/userMgt.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, userAdd, userUpdate, userMgtTpl, footer) {
    return function() {
        var $userMgtTpl = $(userMgtTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($userMgtTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //初始化分页控件
            initPageComponent(loadData);

            var obj = {};
            obj = $.extend(obj, { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize });
            loadData(); //默认加载全部数据
            //加载数据方法
            function loadData() {
                //获取page数据
                obj = $.extend(obj, getPageInfo());
                $(window).IFSAjax({
                    code: "0010_180001",
                    data: $.extend({}, obj),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            successFun(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            //成功回调
            function successFun(data) {
                if (IFSCommonMethod.isNotBlank(data.list)) {
                    setTotalPage(data.total, obj.pageNum, obj.pageSize); //设置分页
                    var list = data.list;
                    var html = [];
                    for (var i = 0; i < 　list.length; i++) {
                        var isLock = "";
                        isLock = (list[i].isLock == "0" ? "解锁" : "锁定");
                        html.push('<tr data-id="' + list[i].id + '">\
                            <td>' + list[i].usrNm + '</td>\
                            <td>' + getHiddenMobile(list[i].mobile) + '</td>\
                            <td>' + list[i].idNo + '</td>\
                            <td>' + initRoles(list[i].corpRoleIdList) + '</td>');
                        if (list[i].stat == "2") {
                            html.push('<td class="red">' + list[i].stat + '</td>');
                        } else {
                            html.push('<td>' + list[i].stat + '</td>');
                        }
                        if (list[i].stat == "1") {
                            html.push('<td>\
                            <a class="blue modify" href="javascript:void(0);">修改</a>\
                            <a class="red delete" href="javascript:void(0);">删除</a>\
                            <a class="lock" href="javascript:void(0);">'+isLock+'</a>\
                            <a class="reset" href="javascript:void(0);">密码重置</a>\
                            </td>\
                            </tr>');
                        } else {
                            html.push('<td></td>\
                            </tr>')
                        }

                    }
                    $("#userList tbody").empty().append(html.join(""));
                    renderDataDic(); //加载页面数据字典
                    $("#noDataTip").css("display", "none");
                } else {
                    $("#userList tbody").empty();
                    $("#noDataTip").css("display", "block");
                }
            }

            $("#add").click(function() {
                userAdd();
            });
            //获取用户信息
            $(".table").on("click", ".modify", function() {
                obj.id = $(this).closest("tr").attr("data-id");
                //    请求数据
                userUpdate(obj.id);

            });

            $(".table").on("click", ".delete", function() {
                obj.id = $(this).closest("tr").attr("data-id");
                //    请求数据
                pluginObj.confirm("用户删除", "确认要删除该用户？", function() {
                    //发请求
                    delUser(obj);
                }, function() {})
            })
            $(".table").on("click", ".lock", function() {
                obj.id = $(this).closest("tr").attr("data-id");
                pluginObj.confirm($(this).html()+"用户", "确认要"+$(this).html()+"该用户？", function() {
                    //发请求
                    lockUser(obj);
                }, function() {})
            })
            $(".table").on("click", ".reset", function() {
                obj.id = $(this).closest("tr").attr("data-id");
                pluginObj.confirm("重置用户密码", "确认要重置该用户密码？", function() {
                    //发请求
                    resetPsw(obj);
                }, function() {
                    pluginObj.alert("已取消重置操作");
                })
            })

            function getHiddenMobile(mobile) {
                if (IFSCommonMethod.isNotBlank(mobile)) {
                    return mobile.slice(0, 3) + "****" + mobile.slice(mobile.length - 4, mobile.length);
                }
            }

            function initRoles(roles) {
                var s = '';
                if (roles && roles.length > 0) {
                    //100-管理员 200-经办岗 300-复核岗 400-授权岗
                    var roleList = { '100': '管理员', '200': '经办岗', '300': '复核岗', '400': '授权岗' };
                    for (var i = 0; i < roles.length; i++) {
                        s += ('<span>' + roleList[roles[i]] + '</span>');
                    }
                }
                return s;
            }

            function lockUser(obj) {
                $(window).IFSAjax({
                    code: "0010_180002",
                    data: $.extend({}, searchObj, obj),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            loadData();
                            pluginObj.alert("操作成功！");
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function delUser(obj) {
                $(window).IFSAjax({
                    code: "0010_180003",
                    data: $.extend({}, searchObj, obj),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            loadData();
                            pluginObj.alert("删除成功！");;
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function resetPsw(obj) {
                $(window).IFSAjax({
                    code: "0010_180004",
                    data: $.extend({}, searchObj, obj),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            pluginObj.alert("重置密码成功！")
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