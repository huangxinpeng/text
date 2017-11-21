/*
 * @Author: chengdan 
 * @Date: 2017-08-21 10:50:11 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-08-30 09:48:21
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
    'text!tpls/modifyPwdThree.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, modifyPwdThreeTpl, footer) {
    return function() {
        var $modifyPwdThreeTpl = $(modifyPwdThreeTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($modifyPwdThreeTpl);
        $('.content').append($footer);
        $(document).ready(function() {
            //图标样式
            $("#three").addClass("threeStep");

            //页面btn提交
            $("#fourToIndex").on("click", function() {
                window.location.href = "../../";
            });


            logout();
        });
    }
});