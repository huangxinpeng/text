/*
 * @Author: huanghaisheng 
 * @Date: 2017-07-28 10:43:55 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-10-13 16:54:23
 */
require.config({
    // 可设置参考路径
    // baseUrl:'',
    // index所依赖的js文件等，注意文件名不要写上
    urlArgs: "v=version", //url传参

    paths: {
        jquery: './jquery-1.12.4.min',
        json: './jquery.json-2.4',
        text: './text',
        artTemplate: './template-web',
        //已封装好的通用js
        common: './common',

        bootstrap: './bootstrap.min',
        bootstrapValidator: './bootstrapValidator.min',
        datepicker: './bootstrap-datetimepicker.min',
        datepicker_zh: './bootstrap-datetimepicker.zh-CN',
        kkpager: './kkpager.min',
        select2: './select2',
        upload: './ifs-upload',
        uploadfy: './uploadfy/jquery.uploadify.min',

        //ifs
        global: './global',
        routerConfig: './ifs/ifs-router-config',
        router: './ifs/ifs-router',
        config: './ifs/ifs-config',
        regular: './ifs/ifs-regular',
        ajax: './ifs/ifs-ajax',

        mytaskSignfor:'./biz/mytaskSignfor',//签收

        // 可选：自主选择将常用文件路径配置在此处 eg:
        tpls: '../views/tpls'
    },
    // bootstrap依赖jquery，凡是依赖关系必须在此处配置，简单说就是让浏览器先加载jquery再加载bootstrap
    shim: {
        common: {
            deps: ['jquery']
        },
        json: {
            deps: ['jquery']
        },
        bootstrap: {
            deps: ["jquery"],
            exports: 'bootstrap'
        },
        bootstrapValidator: {
            deps: ["jquery"],
            exports: 'bootstrapValidator'
        },
        datepicker: {
            deps: ["jquery"],
            exports: "datepicker"
        },
        datepicker_zh: {
            deps: ["jquery", "datepicker"],
            exports: "datepicker_zh"
        },
        global: {
            deps: ["jquery", "bootstrap"],
            exports: "global"
        },
        routerConfig: {
            deps: ["global"],
            exports: "routerConfig"
        },
        router: {
            deps: ["routerConfig"],
            exports: "router"
        },
        ajax: {
            deps: ["jquery", "bootstrap"],
            exports: "ajax"
        },
        select2: {
            deps: ["jquery", "bootstrap"],
            exports: "select2"
        },
        kkpager: {
            deps: ["jquery"],
            exports: "kkpager"
        },
        upload: {
            deps: ["jquery"],
            exports: "upload"
        },
        uploadfy: {
            deps: ["jquery"],
            exports: "uploadfy"
        }
    }
});
// 按需加载部分，导入对应的Js文件并且调用,特别注意：导入的文件的返回值必须与函数参数对应
require(["jquery",
    './biz/index',
    './biz/baoquanqianshou',
    './biz/baoquanrongzi',
    './biz/baoquanzhuanrang',
    './biz/mybaoquanchaxun',
    './biz/mybaoquanzhuanrang',
    './biz/mybaoquanrongzi',
    './biz/mybaoquandaoqi',
    './biz/mybaoquanjiabao',
    './biz/myBonus',
    './biz/qiyeziliao',
    './biz/yonghuguanli',
    './biz/yinhangzhanghao',
    './biz/jiaoyiduishou',
    './biz/baoquanqianshoutaizhang',
    './biz/baoquanzhuanrangtaizhang',
    './biz/baoquanrongzitaizhang',
    './biz/daoqifukuantaizhang',
    './biz/wodejinbitaizhang',
    './biz/zhuanrangpingzheng',
    './biz/rongzipingzheng',
    'personalinfo',
    'modifypwdone',
    'modifymobileone',
    'usehelp',
    'dofeedback',
    './newsread',
    './mytask'
], function($, index, baoquanqianshou, baoquanrongzi, baoquanzhuanrang,
    mybaoquanchaxun, mybaoquanzhuanrang, mybaoquanrongzi, mybaoquandaoqi, mybaoquanjiabao,
    myBonus, qiyeziliao, yonghuguanli, yinhangzhanghao, jiaoyiduishou,
    baoquanqianshoutaizhang, baoquanzhuanrangtaizhang, baoquanrongzitaizhang,
    daoqifukuantaizhang, wodejinbitaizhang, zhuanrangpingzheng, rongzipingzheng, personalinfo, modifypwdone, modifymobileone, usehelp, dofeedback, newsread,
    mytask) {
    /*************************所有页面跳转，菜单***************************/
    //我的工作台
    index();
    //initMenu();
    // 待办任务
    $("#workspace").on("click", function() {
            mytask();
        })
        //根据下拉选项跳转到对应页面
    $(".baseInfo-name .dropdown-menu a").each(function() {
        $(this).on("click", function() {
            $(".baseInfo-name #dropdown-click").css("transform", "rotate(0deg)");
            switch ($(this).attr("id")) {
                case "personalinfo":
                    personalinfo();
                    break;
                case "modifypwd":
                    modifypwdone();
                    break;
                case "modifymobile":
                    modifymobileone();
                    break;
                case "usehelp":
                    usehelp();
                    break;
                case "dofeedback":
                    dofeedback();
                    break;
            }
        });
    });

    //消息
    $(".news-warning").on("click", function() {
        newsread();
    });
    //任务
    $('#baoquanqianshou').on('click', function() {
        $('.content').empty();
        baoquanqianshou();
    });
    $('#baoquanzhuanrang').on('click', function() {
        $('.content').empty();
        baoquanzhuanrang();
    });
    $('#baoquanrongzi').on('click', function() {
        $('.content').empty();
        baoquanrongzi();
    });

    // 我的宝券
    $('#mybaoquanchaxun').on('click', function() {
        $('.content').empty();
        mybaoquanchaxun();
    });
    $('#mybaoquanzhuanrang').on('click', function() {
        $('.content').empty();
        mybaoquanzhuanrang();
    });
    $('#mybaoquanrongzi').on('click', function() {
        $('.content').empty();
        if ($("#mybaoquanrongzi").attr("isreturn") == "isreturn") {
            $("#mybaoquanrongzi").removeAttr("isreturn");
        } else {
            $("#mybaoquanrongzi").removeAttr("return");
        }
        mybaoquanrongzi();
    });
    $('#mybaoquandaoqi').on('click', function() {
        $('.content').empty();
        mybaoquandaoqi();
    });
    $('#mybaoquanjiabao').on('click', function() {
        $('.content').empty();
        mybaoquanjiabao();
    });

    //我的金币
    $('#myBonus').on('click', function() {
        $('.content').empty();
        myBonus();
    });

    // 企业信息
    $('#qiyeziliao').on('click', function() {
        $('.content').empty();
        qiyeziliao();
    });
    $('#yonghuguanli').on('click', function() {
        $('.content').empty();
        yonghuguanli();
    });
    $('#yinhangzhanghao').on('click', function() {
        $('.content').empty();
        yinhangzhanghao();
    });
    $('#jiaoyiduishou').on('click', function() {
        $('.content').empty();
        jiaoyiduishou();
    });

    // 业务台账
    $('#baoquanqianshoutaizhang').on('click', function() {
        $('.content').empty();
        baoquanqianshoutaizhang();
    });
    $('#baoquanzhuanrangtaizhang').on('click', function() {
        $('.content').empty();
        baoquanzhuanrangtaizhang();
    });
    $('#baoquanrongzitaizhang').on('click', function() {
        $('.content').empty();
        baoquanrongzitaizhang();
    });
    $('#daoqifukuangtaizhang').on('click', function() {
        $('.content').empty();
        daoqifukuantaizhang();
    });
    $('#wodejinbitaizhang').on('click', function() {
        $('.content').empty();
        wodejinbitaizhang();
    });

    //凭证下载
    $('#zhuanrangpingzheng').on('click', function() {
        $('.content').empty();
        zhuanrangpingzheng();
    });
    $('#rongzipingzheng').on('click', function() {
        $('.content').empty();
        rongzipingzheng();
    });


    function initMenu() {
        $(window).IFSAjax({
            code: "0010_150000",
            method: "POST",
            complete: function(result) {
                if (result.code == IFSConfig.resultCode && result.data.list) {
                    var list = result.data.list;
                    var html = [];

                    for (var i = 0; i < list.length; i++) {
                        if (list[i].funcid.length < 10) { continue; }
                        if (list[i].funcid == "1000002001") {
                            html.push('<li>\
                                <a href="javascript:;">待办任务<span id="point"></span><i class="icon iconfont icon-xiala"></i></a>');
                        }
                    }
                }
            },
            error: function(status, XMLHttpRequest) {}
        });
    }

})