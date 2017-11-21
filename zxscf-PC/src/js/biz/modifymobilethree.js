/*
 * @Author: chengdan 
 * @Date: 2017-08-30 10:03:53 
 * @Last Modified by: chengdan
 * @Last Modified time: 2017-08-30 10:05:55
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
    'text!tpls/modifyMobileThree.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, modifyMobileThreeTpl, footer) {
    return function() {
        var $modifyMobileThreeTpl = $(modifyMobileThreeTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($modifyMobileThreeTpl);
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