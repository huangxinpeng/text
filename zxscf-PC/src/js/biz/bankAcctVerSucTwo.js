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
    './bankAcct',
    'text!tpls/bankAcctVerSucTwo.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, bankAcct, bankAcctVerSucTwoTpl, footer) {
    return function() {
        var $bankAcctVerSucTwoTpl = $(bankAcctVerSucTwoTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($bankAcctVerSucTwoTpl);
        $('.content').append($footer);

        $(document).ready(function() {
            $("#back").click(function() {
                $("#bankAcct").trigger("click");
            });
        });
    }
});