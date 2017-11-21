(function($w) {
    'use strict';
    /**
     * 全局常量
     */
    var constants = {
        protType: { "PT1": "融资协议", "PT2": "转让通知", "PT3": "转让协议", "PT4": "开具协议" }, //协议类别
        rejectReason: { "RR1": "其他", "RR2": "转让信息填写错误", "RR3": "融资信息填写错误", "RR4": "签收信息填写错误" }, //驳回原因
        menuParentId: 200, //主菜单id
        menuTaskId: 200001, //待办任务主菜单id
        menuBonus: 200003 //我的金币菜单id
    };
    $w.Constant = constants;
}(window));