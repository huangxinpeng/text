/*
 * @Author: huanghaisheng 
 * @Date: 2017-07-28 10:43:55 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-11-20 16:19:37
 */
require.config({
    // 可设置参考路径
    // baseUrl:'',
    // index所依赖的js文件等，注意文件名不要写上
    urlArgs: "v=APP_VER", //url传参

    paths: {
        jquery: './jquery-1.12.4.min',
        json: './jquery.json-2.4',
        text: './text',
        artTemplate: './template-web',
        //已封装好的通用js
        common: './common',
        MD5: './MD5',

        bootstrap: './bootstrap.min',
        bootstrapValidator: './bootstrapValidator.min',
        datepicker: './bootstrap-datetimepicker.min',
        datepicker_zh: './bootstrap-datetimepicker.zh-CN',
        kkpager: './kkpager.min',
        select2: './select2',
        upload: './ifs-upload',
        uploadify: './uploadify/jquery.uploadify',

        //ifs
        global: './global',
        routerConfig: './ifs/ifs-router-config',
        router: './ifs/ifs-router',
        config: './ifs/ifs-config',
        regular: './ifs/ifs-regular',
        ajax: './ifs/ifs-ajax',

        //constant
        Constant: './constant',

        //personinfo
        personalInfo: './biz/personalInfo',
        modifyPwdOne: './biz/modifyPwdOne',
        modifyPwdTwo: './biz/modifyPwdTwo',
        modifyPwdThree: './biz/modifyPwdThree',
        modifyMobileOne: './biz/modifyMobileOne',
        modifyMobileTwo: './biz/modifyMobileTwo',
        modifyMobileThree: './biz/modifyMobileThree',
        useHelp: './biz/useHelp',
        doFeedback: './biz/doFeedback',

        //wodebaoquan
        myDraftConfirmApply: './biz/myDraftConfirmApply',
        myDraftDisct: './biz/myDraftDisct',
        myDraftDisctHis: './biz/myDraftDisctHis',
        myDraftOnDisct: './biz/myDraftOnDisct',
        myDraftDisctDtl: './biz/myDraftDisctDtl',
        myDraftDisctApplyOne: './biz/myDraftDisctApplyOne',
        myDraftDisctApplyTwo: './biz/myDraftDisctApplyTwo',
        myDraftQueryDtl: './biz/myDraftQueryDtl',
        myDraftTxnHis: './biz/myDraftTxnHis',
        myDraftOnTxn: './biz/myDraftOnTxn',
        myDraftTxnDtl: './biz/myDraftTxnDtl',
        myDraftTxnTurnOne: './biz/myDraftTxnTurnOne',
        myDraftTxnTurnOneTwo: './biz/myDraftTxnTurnOneTwo',
        myDraftTxnTurnOneThree: './biz/myDraftTxnTurnOneThree',
        myDraftTxnTurnMoreTwo: './biz/myDraftTxnTurnMoreTwo',
        myDraftTxnTurnMoreThree: './biz/myDraftTxnTurnMoreThree',
        myDraftTxnMoreTurnOne: './biz/myDraftTxnMoreTurnOne',
        myDraftTxnMoreTurnTwo: './biz/myDraftTxnMoreTurnTwo',
        myDraftTxnMoreTurnThree: './biz/myDraftTxnMoreTurnThree',

        //daibanrenwu
        draftSignDtl: './biz/draftSignDtl',
        draftSignHis: './biz/draftSignHis',
        draftSignHisDtl: './biz/draftSignHisDtl',
        draftTxnCertDtl: './biz/draftTxnCertDtl',
        draftSignProt: './biz/draftSignProt',
        draftTxnDtl: './biz/draftTxnDtl',
        draftTxnHis: './biz/draftTxnHis',
        draftTxnHisDtl: './biz/draftTxnHisDtl',
        draftTxnProt: './biz/draftTxnProt',
        draftDisctHis: './biz/draftDisctHis',
        draftDisctDtl: './biz/draftDisctDtl',
        draftDisctHisDtl: './biz/draftDisctHisDtl',
        draftDisctProt: './biz/draftDisctProt',
        //融资凭证页面公用
        draftDisctBookDtl: './biz/draftDisctBookDtl',
        draftDisctCertDtl: './biz/draftDisctCertDtl',
        //转让凭证详情页面公用
        draftSignBookDtl: './biz/draftSignBookDtl',
        draftTxnBookDtl: './biz/draftTxnBookDtl',
        //myTask
        index: './biz/index',

        newsRead: './biz/newsRead',
        myTask: './biz/myTask',

        // 可选：自主选择将常用文件路径配置在此处 eg:
        tpls: '../views/tpls'
    },
    // bootstrap依赖jquery，凡是依赖关系必须在此处配置，简单说就是让浏览器先加载jquery再加载bootstrap
    shim: {
        MD5: {
            deps: ['jquery']
        },
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
        uploadify: {
            deps: ["jquery"],
            exports: "uploadify"
        }
    }
});
// 按需加载部分，导入对应的Js文件并且调用,特别注意：导入的文件的返回值必须与函数参数对应
require(["jquery",
    './biz/index',
    './biz/draftSign',
    './biz/draftDisct',
    './biz/draftTxn',
    './biz/myDraftQuery',
    './biz/myDraftTxn',
    './biz/myDraftDisct',
    './biz/myDraftPay',
    './biz/myDraftConfirm',
    './biz/myBonus',
    './biz/custInfo',
    './biz/userMgt',
    './biz/bankAcct',
    './biz/partner',
    './biz/draftSignBook',
    './biz/draftTxnBook',
    './biz/draftDisctBook',
    './biz/draftPayBook',
    './biz/myBonusBook',
    './biz/draftTxnCert',
    './biz/draftDisctCert',
    'personalInfo',
    'modifyPwdOne',
    'modifyMobileOne',
    'useHelp',
    'doFeedback',
    './newsRead',
    './myTask',
], function($, index, draftSign, draftDisct, draftTxn,
    myDraftQuery, myDraftTxn, myDraftDisct, myDraftPay, myDraftConfirm,
    myBonus, custInfo, userMgt, bankAcct, partner,
    draftSignBook, draftTxnBook, draftDisctBook,
    draftPayBook, myBonusBook, draftTxnCert, draftDisctCert, personalInfo, modifyPwdOne, modifyMobileOne, useHelp, doFeedback, newsRead,
    myTask) {
    /*************************所有页面跳转，菜单***************************/
    //我的工作台
    index();

    // 待办任务
    $("#workspace").on("click", function() {
        myTask();
    });

    //根据下拉选项跳转到对应页面
    $(".baseInfo-name .dropdown-menu a").each(function() {
        $(this).on("click", function() {
            $(".baseInfo-name #dropdown-click").css("transform", "rotate(0deg)");
            switch ($(this).attr("id")) {
                case "personalInfo":
                    personalInfo();
                    break;
                case "modifypwd":
                    modifyPwdOne();
                    break;
                case "modifymobile":
                    modifyMobileOne();
                    break;
                case "useHelp":
                    useHelp();
                    break;
                case "doFeedback":
                    doFeedback();
                    break;
            }
        });
    });

    //消息
    $(".news-warning").on("click", function() {
        newsRead();
    });
});