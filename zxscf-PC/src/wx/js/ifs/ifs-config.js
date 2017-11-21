(function ($w) {
	'use strict';
	/**
	 * 全局默认设置
	 */
	var _chlTerminalType = "10";
	var _reqVersion = "1.0.0";
	var settings= {

		submitMethod : "POST", //
		resultCode:"000000", //
		resultErrorCode:"S99999",
		speProCode:"0010_110007,0010_220024,0010_220035",//特殊处理的交易码,自定义error回调
		speProErrorCode:"230001",//特殊处理errorCode返回码，不弹出alert
		authPageCode:"220071",
		entType:"E",
		perType:"P",
		perNoAuthPage:"capitalDemand.html",
		fastDFSPath:"http://file.test.cibfintech.com/",
		payPath:"http://file.test.cibfintech.com/",
		RSAKey:"30818902818100C51635F896F094D69B0A6AE143DDD1ABDE36491B86FF0C6571C698B4E850D6FC83CD2597303F1E64DA6B2B99C6D4B9F133B979169822B52A8C331A718BD5A2D080922ED2671DCF2F2BC8B46963FB573C556A27B3A5D8142FEA3707BEE675CAB23F2046E38826D10C82DFC3869E185766FF3F06CB91238C02BE1172EA075F7AFB0203010001", //
		smsCountDown:60, //短信发送倒计时
		pageSie:10,//分页每页展示条数
		instCond:{"R1":"稳健型","R2":"激进型","R3":"激进型","R4":"激进型","R5":"激进型"},//投资类别
		loginPage:"/views/hybridLogin.html",
		/**
		 *
		 * @param transCode
		 * @param channel
		 * @param XMLHttpRequest
		 * @param token
         * @param vc
         * @param mh
         */
		addHttpHeader:function (transCode, channel, XMLHttpRequest, token, vc, mh) {
			// 将交易码添加到自定义http header
			XMLHttpRequest.setRequestHeader("_si", transCode);
			// 将渠道码添加到自定义http header
			XMLHttpRequest.setRequestHeader("_cn", channel);
			// 将验证码添加到http header
			XMLHttpRequest.setRequestHeader("_vc", vc);
			// body的hash值
			XMLHttpRequest.setRequestHeader("_mh", mh);
			//后台返回防止重复提交的token
			XMLHttpRequest.setRequestHeader("_ck", "");
		},
		addReqHeader:function (transCode, channel,tn,userId) {
			return {"version":_reqVersion,"chlid":channel,"sender":channel,"senttime":new Date().getTime(),"chlterminaltype":_chlTerminalType,"chlmsgtype":transCode,"tn":tn,"userid":userId};
		},
		showAlert:function (message,callback) {
			var index = layer.alert(message, {
				title:'信息提示',
				skin: 'layui-layer-custumA', //样式类名
				btnAlign: 'c',
				closeBtn: 1,
				btn:['确定'],
				yes:function(){
					if(callback!=undefined){
						callback();
					}else{
						layer.closeAll();
					}
				},
				cancel:function(){
					if(callback!=undefined){
						callback();
					}else{
						layer.closeAll();
					}
				}
			});
		},
		showConfirm:function(message,sucCallback,errorCallback){
			var index = layer.confirm(message, {
				title:'信息提示',
				skin: 'layui-layer-custumA', //样式类名
				btnAlign: 'c',
				closeBtn: 1,
				btn: ['支付成功','重新支付'] //按钮
			}, function(){
				if(sucCallback!=undefined){
					sucCallback();
				}else{
					layer.close(index);
				}
			}, function(){
				if(errorCallback!=undefined){
					errorCallback();
				}else{
					layer.close(index);
				}
			});
		},
		showMsgCodeAlert:function(message){
			if(false){
				if(IFSCommonMethod.isNotBlank(message)){
					layer.alert(message,{
						title:'信息提示',
						skin: 'layui-layer-custumA', //样式类名
						btnAlign: 'c',
						closeBtn: 1,
						btn:['确定']
					});
				}
			}
		},
		tip:function(message){
			alert(message);
		},
		/**
		 * 使用Loading加载层
		 * @param message
		 */
		showLoadingDialog:function (message) {
			
		},
		/**
		 * 数据加载完成取消加载层
		 */
		cancelLoadingDialog:function () {

		},
		/**
		 * 按钮提交时，按钮点击事件不可用
		 * @param id
         */
		btnLock:function (id) {
			$("#"+id).attr("disabled","disabled");
		},
		/**
		 * 请求相应后按钮可用
		 * @param id
         */
		btnUnLock:function (id) {
			$("#"+id).removeAttr("disabled");
		},
		logInfo:function(msg){
			console.log(msg);
		}
	};
	$w.IFSConfig = settings;
}(window));


