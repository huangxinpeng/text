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
    'text!tpls/bankAcctVerSucOne.html',
    'text!tpls/footer.html',
], function($, json, bootstrap, bootstrapValidator, global, router, routerConfig, config,
    regular, ajax, common, constant, bankAcct, bankAcctVerSucOneTpl, footer) {
    return function() {
        var $bankAcctVerSucOneTpl = $(bankAcctVerSucOneTpl);
        var $footer = $(footer);
        $('.content').empty();
        $('.content').append($bankAcctVerSucOneTpl);
        $('.content').append($footer);

        $(document).ready(function() {

            $("#back").click(function() {
                $("#bankAcct").trigger("click");
            });
        });
    }
});