/*
 * @Author: chengdan 
 * @Date: 2017-08-24 10:38:01 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 15:53:00
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
    './myTask'
    //'text!tpls/myTask.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, myTask) {
    return function() {
        $('.content').empty();
        $(document).ready(function() {
            /*************页面动态效果*************/
            function initMenu() {
                $(window).IFSAjax({
                    code: "0010_150000",
                    method: "POST",
                    async: false,
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode && result.data.list) {
                            Menu.init(result.data.list, $(".controller-nav"));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            initMenu();

            //初始化下拉框
            $("body").on("click", ".dropdown-toggle", function() {
                if ($(".dropdown-menu").css("display") == "none") {
                    $("#dropdown-click").css("transform", "rotate(180deg)");
                } else {
                    $("#dropdown-click").css("transform", "rotate(0deg)");
                }
            });
            $("body").on("blur", ".dropdown-toggle", function() {
                $("#dropdown-click").css("transform", "rotate(0deg)");
            });

            //代办任务-二级页面的切换时badge显示或隐藏
            // $(".my_icons").on("click", "li", function() {
            //     $(this).siblings().find(".badge").show();
            //     $(this).find(".badge").hide();
            // });

            // 点击最外层实现子菜单下拉或者收缩
            $('body').on("click", ".ctrl-list>li>a", function() {
                if ($("#point").attr("data-nomsg") == "1") {
                    if (IFSCommonMethod.isContains($(this).text(), "待办任务") &&
                        !$(this).find("i").hasClass("up-and-down-icon")) {
                        $("#point").css("display", "none");
                    } else {
                        $("#point").css("display", "block");
                    }
                } else {
                    $("#point").css("display", "none");
                }

                $(this).siblings('ol').stop().slideToggle(500);

                //小三角方向转动
                if ($(this).children('i').hasClass('up-and-down-icon')) {
                    $(this).children('i').removeClass('up-and-down-icon');
                } else {

                    $(this).children('i').addClass('up-and-down-icon');
                    $(this).parent('li').siblings().each(function() {
                        if ($(this).children('a').children('i').hasClass('up-and-down-icon')) {
                            $(this).children('a').siblings('ol').stop().slideToggle(500);
                            $(this).children('a').children('i').removeClass('up-and-down-icon');
                        }
                    });
                }
            });
            //子菜单被选中的样式变化
            $('body').on("click", ".ctrl-list>li>ol>li>a", function() {
                //选中的样式
                $(this).parent().parent().parent().siblings().children('ol').children().children('a').removeClass('choosedStyle');

                $(this).addClass('choosedStyle').parent().siblings().children('a').removeClass('choosedStyle');

            });

            /****************动态数据获取**************/

            var obj = {};
            //初始化当前时间
            $("#systemTime").html(IFSCommonMethod.getCurrentDate());
            //初始化用户信息
            getUserInfo();

            function getUserInfo() {
                $(window).IFSAjax({
                    code: "0010_150001",
                    method: "POST",
                    data: {},
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            initUser(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function initUser(data) {
                var usrCd = data.usrCd;
                if (data.usrCd.length == 11) {
                    usrCd = data.usrCd.slice(0, 3) + "****" + data.usrCd.slice(7, 11);
                }
                $("#loginAccount").html(usrCd);
                $("#usrNm").html(data.usrNm);
                if (IFSCommonMethod.isNotBlank(data.headImg)) {
                    $("#usrImg").attr("src", "/esif-webapp/current/viewAttach?id=" + data.headImg);
                }
            }
            //查询当前企业信息
            getCurrentE();

            function getCurrentE() {
                $(window).IFSAjax({
                    code: "0010_160001",
                    method: "POST",
                    data: {},
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            renderCurrentE(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderCurrentE(data) {
                if (data.custCnNm.length > 20) {
                    $("#curE").html(data.custCnNm.substring(0, 20) + "...").closest(".user-name").css("height", "35px");
                } else if (data.custCnNm.length > 10) {
                    $("#curE").html(data.custCnNm.substring(0, 20) + "...").closest(".user-name").css("height", "35px");
                } else {
                    $("#curE").html(data.custCnNm);
                }
                $("#curId").html(data.custNo);
                $("#isRegister").html(data.isRegister);
                //标志位
                data.isAuth == "2" ? $("#biaozhi").css("background", "url('../../images/index/biaozhi.png') no-repeat center").parent().attr("title", "资质审核已通过") : $("#biaozhi").css("background", "url('../../images/index/biaozhi0.png') no-repeat center").parent().attr("title", "资质审核未通过");
                data.isCert == "1" ? $("#zhengshu").css("background", "url('../../images/index/zhengshu.png') no-repeat center").parent().attr("title", "数字证书已认证") : $("#zhengshu").css("background", "url('../../images/index/zhengshu0.png') no-repeat center").parent().attr("title", "数字证书未认证");
                data.isRegister == "1" ? $("#qianyue").css("background", "url('../../images/index/qianyueshenqing.png') no-repeat center").parent().attr("title", "用户协议已签约") : $("#qianyue").css("background", "url('../../images/index/qianyueshenqing0.png') no-repeat center").parent().attr("title", "用户协议未签约");
                myTask(); //待办任务初始化,根据企业是否签约显示  
            }



            getMsgCount(); //未读消息数量初始化
            function getMsgCount() {
                //获取page数据
                obj = { pageNum: IFSConfig.pageNum, pageSize: IFSConfig.pageSize, readFlag: "0" };
                $(window).IFSAjax({
                    code: "0010_220001",
                    method: "POST",
                    data: $.extend(obj, {}),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            if (result.data.total > 0) {
                                $(".news-warning").find("i").show().html(result.data.total);
                            }
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));;
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            //打开切换登录企业列表
            $("#changeE").click(function() {
                getEinfo();
                $("#myModal").modal("show");
            });
            //获取所属企业列表            
            function getEinfo() {
                $(window).IFSAjax({
                    code: "0010_210001",
                    method: "POST",
                    data: {},
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            renderEList(result.data);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }

            function renderEList(data) {
                if (data.list && data.list.length > 0) {
                    var html = [];
                    var list = data.list;
                    var isDef = "";
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].isLogin == "0") {
                            isDef = ' no';
                        } else {
                            isDef = '';
                        }
                        html.push('<li data-id="' + list[i].custNo + '" class=""><a href="index.html?v=APP_VER">' + list[i].custCnNm + '</a><span  class="glyphicon glyphicon-ok' + isDef + '"></span></li>')
                    }
                    $(".listmodal").empty().append(html.join(""));
                }
            }

            //切换企业
            $(".listmodal").on("click", "li", function() {
                //如果是当前企业，不切换
                if (!$(this).find("span").hasClass("no")) {
                    $("#myModal").modal("hide");
                    return false;
                }
                obj.custNo = $(this).attr("data-id");
                changeE($(this));
            });

            function changeE(el) {
                $(window).IFSAjax({
                    code: "0010_210002",
                    method: "POST",
                    data: $.extend(obj, {}),
                    complete: function(result) {
                        if (result.code == IFSConfig.resultCode) {
                            el.siblings().find("span").addClass("no");
                            el.find("span").removeClass("no");
                            $("#myModal").modal("hide");
                            pluginObj.alert("切换成功！");
                            //重新加载数据
                            setTimeout(function() {
                                getCurrentE();
                                initMenu();
                            }, 1000);
                        } else {
                            pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
                        }
                    },
                    error: function(status, XMLHttpRequest) {}
                });
            }
            //登出
            $(".ind_iconlast").on("click", function() {
                pluginObj.confirm("退出确认", "确认要退出？", logout, function() {});
            });

        });

    }
});