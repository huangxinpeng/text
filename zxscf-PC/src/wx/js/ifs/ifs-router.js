/**
 * 匹配交易路由码,可以全字符匹配，也可以正则表达式匹配
 */
(function ($w) {
    'use strict';
    var router = {
        routes : IFSRouterCode,
        match : function(code) {
            for ( var key in this.routes) {
                // 首先判断是否为正则表达式,如果不是,直接匹配交易码
                if (!router.isReg(key)) {
                    if (key == code) {
                        return this.routes[key];
                    }
                } else {
                    var trimLft = key.substring(1);
                    var regKey = trimLft.substring(trimLft.length - 1);
                    var pattern = new RegExp(regKey, 'g');
                    if (code.match(pattern) != null) {
                        return this.routes[key];
                    }
                }
            }
            return null;
        },
        /**
         * 判断是否为正则表达式
         *
         * @param code
         * @returns {Boolean}
         */
        isReg : function(code) {
            var tmp = code.substring(0,1);
            if(tmp == '/') {
                return true;
            } else {
                return false;
            }
        }
    };
    $w.IFSRouterMatch = router;
}(window));

