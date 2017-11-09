// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('zxscf', ['ionic','ngCordova','zxscf.widget','zxscf.controllers', 'zxscf.services','zxscf.config'])

  .run(function ($ionicPlatform,Push,$rootScope,$state,$ionicLoading,$timeout,$cordovaStatusbar) {

    //统一HttpLoading
    $rootScope.$on('loading:show', function() {
      $ionicLoading.show({
        template: '加载中'
      })
    })

    $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide()
    })

    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
        //alert('StatusBar');
      }

      //状态栏设置
      //if (window.StatusBar) {
      //  alert('StatusBar')
      //  $cordovaStatusbar.style(1);
      //  $cordovaStatusbar.overlaysWebView(true);
      //  $cordovaStatusbar.styleColor('lightGray');
      //  $cordovaStatusbar.styleHex('#0f90f1')
      //  //StatusBar.backgroundColorByHexString("#0f90f1");
      //  //StatusBar.styleLightContent();
      //  $cordovaStatusbar.show();
      //  var isVisible = $cordovaStatusbar.isVisible();
      //}


      //初始化
      Push.init(notificationCallback);
      //设置别名
      Push.setAlias("12345678");


      if(window.plugins){
        //启动极光推送服务
        window.plugins.jPushPlugin.init();

        //点击通知栏的回调，在这里编写特定逻辑
        window.plugins.jPushPlugin.openNotificationInAndroidCallback= function(data){
          alert(JSON.stringify(data));
        };

        // 手机唯一标识本地存储，本地取值用于统计
        if(!!window.localStorage.getItem('RegistrationID')){
        }else{
          $timeout(function(){
            window.plugins.jPushPlugin.getRegistrationID(function(id){
              window.localStorage.setItem('RegistrationID',id);
            });
          },5000);//设置5s延时
        }
      }
    });

     // if(window.plugins){
     //   //启动极光推送服务
     //   window.plugins.jPushPlugin.init();
     //
     //    //点击通知栏的回调，在这里编写特定逻辑
     //    window.plugins.jPushPlugin.openNotificationInAndroidCallback= function(data){
     //      alert(JSON.stringify(data));
     //    };
     // }

    var notificationCallback = function(data) {
      console.log('received data :' + data);
      var notification = angular.fromJson(data);
      //app 是否处于正在运行状态
      // var isActive = notification.notification;

      // here add your code


      //ios
      if (ionic.Platform.isIOS()) {
        window.alert(notification);

      } else {
        //非 ios(android)
      }
    };
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider,$httpProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    // $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    // $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');
    $ionicConfigProvider.scrolling.jsScrolling(true);
    $ionicConfigProvider.backButton.previousTitleText(false).text('');
    $ionicConfigProvider.views.swipeBackEnabled(false);


    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    // if none of the above states are matched, use this as the fallback


    //统一请求HttpLoading
    $httpProvider.interceptors.push(function($rootScope) {
      return {
        request: function(config) {
          $rootScope.$broadcast('loading:show')
          return config
        },
        response: function(response) {
          $rootScope.$broadcast('loading:hide')
          return response
        }
      }
    })
    $stateProvider

    // setup an abstract state for the tabs directive
      // .state('tab', {
      //   url: '/tab',
      //   abstract: true,
      //   templateUrl: 'template/tab.html'
      // })
      //登录(默认)
      .state('login',{
        url:'/login',
        templateUrl:'template/login.html',
        controller:'LoginCtrl'
      })
      .state('NavSlideApp',{
        url:'/NavSlideApp',
        templateUrl:'template/navigater-slide-app.html',
        controller:'NavSlideAppCtrl'
      })
      //忘记密码
      .state('forgetpwd',{
        cache:false,
        url:'/forgetpwd',
        templateUrl:'template/forget-pwd.html',
        controller:'ResetpasswordCtrl'
      })

      //企业注册
      .state('companyRegister',{
        url:'/companyRegister',
        templateUrl:'template/company-register1.html',
        controller:'CompanyRegister1Ctrl'
      })
      // 企业注册第二步
      .state('register2', {
        url: '/register2',
        templateUrl: 'template/company-register2.html',
        controller:'Register2Ctrl'
      })

      // 企业注册第三步
      .state('register3', {
        url: '/register3',
        templateUrl: 'template/company-register3.html',
        controller:'Register3Ctrl'
      })
        .state('register3-xieyi', {
          url: '/register3xieyi',
          templateUrl: 'template/company-register3-xieyi.html',
          controller:'Register3XieyiCtrl'
        })

      // 注册成功
      .state('registersuccess', {
        url: '/registersuccess',
        templateUrl: 'template/company-reg-success.html'
        //controller:'RegsuccessCtrl'
      })

      //主页
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'template/tab.html'
      })
      //首页
      .state('tab.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: 'template/tab-home.html',
            controller: 'HomeCtrl'
          }
        }
      })
      //消息页面
      .state('tab.systemmessage',{
        url:'/systemmessage',
        cache:false,
        views: {
          'tab-home': {
            templateUrl: 'template/system_message.html',
            controller: 'SystemmessageCtrl'
          }
        }
      })

      //签收
      .state('tab.qianshou', {
        url: '/qianshou',
        cache:false,
        views: {
          'tab-home': {
            templateUrl: 'template/qianshou.html',
            controller: 'QianshouCtrl'
          }
        }
      })
      .state('tab.QianShouXieYi',{
        url: '/QianShouXieYi/:id',
        views: {
          'tab-home': {
            templateUrl: 'template/file-QianShouxieyi.html',
            controller: 'QianShouXieYiCtrl'
          }
        }
      })
      .state('tab.QianShouXieYiList',{
        url: '/QianShouXieYiList',
        views: {
          'tab-home': {
            templateUrl: 'template/file-QianShouxieyi-list.html',
            controller: 'QianShouXieYiListCtrl'
          }
        }
      })
      .state('tab.QianShouTongZhi',{
        url: '/QianShouTongZhi/:id',
        views: {
          'tab-home': {
            templateUrl: 'template/file-QianShoutongzhi.html',
            controller: 'QianShouTongZhiCtrl'
          }
        }
      })
      .state('tab.QianShouTongZhiList',{
        url: '/QianShouTongZhiList',
        views: {
          'tab-home': {
            templateUrl: 'template/file-QianShoutongzhi-list.html',
            controller: 'QianShouTongZhiListCtrl'
          }
        }
      })
      //签收完成
      .state('tab.qianshouwangcheng',{
        url:"/qianshouwangcheng/::Mon:Count",
        //cache:false,
        views: {
          'tab-home': {
            templateUrl:'template/qiangshou-wangcheng.html',
            controller:'QiangshouSuccCtrl'
          }
        }
      })
      .state('tab.qianshoumarksuccess',{
        url:"/qianshoumarksuccess/::Mon:Count",
        //cache:false,
        views: {
          'tab-home': {
            templateUrl:'template/qiangshou-markSuccess.html',
            controller:'QiangshouSuccCtrl'
          }
        }
      })
      .state('tab.qianshou-danbi',{
        url:'/qianshoudanbi/:sid',
        views: {
          'tab-home': {
            templateUrl:'template/qianshou-danbi.html',
            controller: 'QianshoudanbiCtrl'
          }
        }
      })
      .state('tab.qianshouhistory',{
        url:'/qianshouhistory',
        cache:false,
        views: {
          'tab-home': {
            templateUrl:'template/qianshou-history.html',
            controller:'QianshouhistoryCtrl'
          }
        }
      })
      .state('tab.qianshoudetailok',{
        url:'/qianshoudetailok/:signID',
        views: {
          'tab-home': {
            templateUrl:'template/qianshou-detail-ok.html',
            controller:'QsdetailokCtrl'
          }
        }
      })
      .state('tab.QianShouZRPingZheng',{
        url:'/QianShouZRPingZheng/',
        views: {
          'tab-home': {
            templateUrl:'template/qianshou-detail-toZRPingZheng.html',
            controller:'QianShouZRPingZheng'
          }
        }
      })
      .state('tab.QianShouZRXieYi',{
        url:'/QianShouZRXieYi/',
        views: {
          'tab-home': {
            templateUrl:'template/qianshou-detail-toZRXieYi.html',
          }
        }
      })
      .state('tab.QianShouZRTongZhi',{
        url:'/QianShouZRTongZhi/',
        views: {
          'tab-home': {
            templateUrl:'template/qianshou-detail-toZRTongZhi.html',
          }
        }
      })
      .state('tab.qianshoudetailerr',{
        url:'/qianshoudetailerr/:sid',
        views: {
          'tab-home': {
            templateUrl:'template/qianshou-detail-err.html',
            controller:'QsdetailerrCtrl'
          }
        }
      })


      //转让复核
      .state('tab.zrangcheck',{
        url:'/zrangcheck',
        cache:false,
        views:{
          'tab-home':{
            templateUrl:'template/zrang-check.html',
            controller:'ZrangcheckCtrl'
          }
        }
      })
      .state('tab.zrangcheckdetail',{
        url:'/zrangcheckdetail/:id:no:bt',
        views:{
          'tab-home':{
            templateUrl:'template/zrang-check-detail.html',
            controller:'ZRdetailCtrl'
          }
        }
      })
      .state('tab.zrangcheckok',{
        url:'/zrangcheckok/:Mon:count',
        views:{
          'tab-home':{
            templateUrl:'template/zrang-check-ok.html',
            controller:'ZrangcheckSuccCtrl'
          }
        }
      })
      .state('tab.zrangcheck-rejecta',{
        url:'/zrangcheckjececta/:Mon:count',
        views:{
          'tab-home':{
            templateUrl:'template/zrang-check-rejecttrf.html',
            controller:'ZrangcheckSuccCtrl'
          }
        }
      })
      .state('tab.zrangcancelok',{
        url:'/zrangcheckcancelok/:Mon:count',
        views:{
          'tab-home':{
            templateUrl:'template/zrang-cancel-ok.html',
            controller:'ZrangcheckSuccCtrl'
          }
        }
      })
      .state('tab.zrangcheck-rejectb',{
        url:'/zrangcheckjecectb/:Mon:count',
        views:{
          'tab-home':{
            templateUrl:'template/zrang-check-rejectrev.html',
            controller:'ZrangcheckSuccCtrl'
          }
        }
      })
      .state('tab.zrangcheckhistory',{
        url:'/tab.zrangcheckhistory',
        views:{
          'tab-home':{
            templateUrl:'template/zrang-check-history.html',
            controller:'ZrangcheckhistoryCtrl'
          }
        }
      })
      .state('tab.zrangcheckhistorydetail',{
        url:'/tab.zrangcheckhistorydetail/:id',
        views:{
          'tab-home':{
            templateUrl:'template/zrang-check-historydetail.html',
            controller:'ZrangcheckhistoryCtrldetail'
          }
        }
      })

      // 融资复核
      .state('tab.rzicheck',{
        url:'/rzicheck',
        cache:false,
        views:{
          'tab-home':{
            templateUrl:'template/rz-check.html',
            controller:'RzckeckCtrl'
          }
        }
      })
      .state('tab.FileReadXieYiOne',{
        url:'/FileReadXieYiOne/:id',
        views:{
          'tab-home':{
            templateUrl:'template/rz-check-fileReadXieYi-one.html',
            controller:'FileReadXieYiOneCtrl'
          }
        }
      })
      .state('tab.FileReadXieYiMore',{
        url:'/FileReadXieYiMore',
        views:{
          'tab-home':{
            templateUrl:'template/rz-check-fileReadXieYi-more.html',
            controller:'FileReadXieYiMoreCtrl'
          }
        }
      })
      .state('tab.FileReadTongZhiMore',{
        url:'/FileReadTongZhiMore',
        views:{
          'tab-home':{
            templateUrl:'template/rz-check-fileReadTongZhi-more.html',
            controller:'FileReadTongZhiMoreCtrl'
          }
        }
      })
      .state('tab.FileReadTongZhiOne',{
        url:'/FileReadTongZhiOne/:id',
        views:{
          'tab-home':{
            templateUrl:'template/rz-check-fileReadTongZhi-one.html',
            controller:'FileReadTongZhiOneCtrl'
          }
        }
      })
      .state('tab.rzicheckdetail',{
        url:'/rzicheckdetail/:id:bt',
        views:{
          'tab-home':{
            templateUrl:'template/rz-check-detail.html',
            controller:'RzicheckdetailCtrl'
          }
        }
      })
      .state('tab.rzicheckok',{
        url:'/rzicheckok/:Mon:count',
        views:{
          'tab-home':{
            templateUrl:'template/rzi-check-ok.html',
            controller:'RzckeckSuccessCtrl'
          }
        }
      })
      .state('tab.rzicheck-cancelok',{
        url:'/rzicheckcancelok/:Mon:count',
        views:{
          'tab-home':{
            templateUrl:'template/rz-cancel-ok.html',
            controller:'RzckeckSuccessCtrl'
          }
        }
      })
      .state('tab.rzicheck-jecectappr',{
        url:'/rzicheckjecectappr/:Mon:count',
        views:{
          'tab-home':{
            templateUrl:'template/rz-check-jecectapprove.html',
            controller:'RzckeckSuccessCtrl'
          }
        }
      })
      .state('tab.rzicheck-jecectcancel',{
        url:'/rzicheckjecectcancel/:Mon:count',
        views:{
          'tab-home':{
            templateUrl:'template/rz-check-jecectcancel.html',
            controller:'RzckeckSuccessCtrl'
          }
        }
      })
      .state('tab.rzcheckhistory',{
        url:'/rzcheckhistory',
        views:{
          'tab-home':{
            templateUrl:'template/rz-check-history.html',
            controller:'RzcheckhistoryCtrl' //RzcheckhistoryCtrl
          }
        }
      })
      .state('tab.rzcheckhistorydetail',{
        url:'/rzcheckhistorydetail/:id',
        views:{
          'tab-home':{
            templateUrl:'template/rz-check-historydetail.html',
            controller:'RzcheckhistorydetailCtrl'
          }
        }
      })


      //我的金币
      .state('tab.mycoin',{
        url:'/mycoin',
        cache:false,
        views:{
          'tab-home':{
            templateUrl:'template/mycoin.html',
            controller:'MycoinCtrl'
          }
        }
      })
      .state('tab.mycoin-sy',{
        url:'/mycoinsyzrang',
        views:{
          'tab-home':{
            templateUrl:'template/mycoin-sy.html',
            controller:'MycoinSYCtrl'   /* 可共用 MycoinCtrl */
          }
        }
      })
      .state('tab.mycoin-sy-saixuan',{
        url:'/mycoinsysaixuan',
        views:{
          'tab-home':{
            templateUrl:'template/mycoin-rz-shaixuan.html',
            controller:'MycoinSaiXuanCtrl'
          }
        }
      })
      .state('tab.mycoin-used',{
        url:'/mycoinused',
        views:{
          'tab-home':{
            templateUrl:'template/mycoin-used.html',
            controller:'MycoinUsedCtrl'
          }
        }
      })
      .state('tab.mycoin-unenter',{
        url:'/mycoinunenter',
        views:{
          'tab-home':{
            templateUrl:'template/mycoin-unenter.html',
            controller:'MycoinunenterCtrl'
          }
        }
      })

      // 宝眷到期
      .state('tab.bquandaoqi',{
        url:'/bquandaoqi',
        views:{
          'tab-home':{
            templateUrl:'template/baoquandaoqi.html',
            controller:'BquandaoqiCtrl'
          }
        }
      })
      .state('tab.bquanduihua-batch',{
        url:'/bquandaoqibatch',
        views:{
          'tab-home':{
            templateUrl:'template/baoquandduihuan-batch.html',
            controller:'BquanduihuanCtrl'
          }
        }
      })
      .state('tab.bquanduihuan-info',{
        url:'/baoquanduihuaninfo/:id',
        views:{
          'tab-home':{
            templateUrl:'template/bquandaoqi-info.html',
            controller:'BqdueDetailCtrl'
          }
        }
      })
      .state('tab.bquanduihua-apply-ok',{
        url:'/bquandaoqibatch',
        views:{
          'tab-home':{
            templateUrl:'template/bquandaoqi-apply-ok.html',
            controller:'BqdueSuccessCtrl'
          }
        }
      })


      //
      // 交易量
      .state('tab.transactions',{
        url:'/transactions',
        //cache:false,
        views:{
          'tab-home':{
            templateUrl:'template/transactions.html',
            controller:'TransactionsCtrl'
          }
        }
      })
      .state('tab.transactionsRZsearch',{
        url:'/transactionsrzsearch',
        views:{
          'tab-home':{
            templateUrl:'template/transactions-rzsearch.html',
            controller:'TransDiscSearchCtrl'
          }
        }
      })
      .state('tab.transactionsZRsearch',{
        url:'/transactionszrsearch',
        views:{
          'tab-home':{
            templateUrl:'template/transactions-zrsearch.html',
            controller:'TransApprSearchCtrl'
          }
        }
      })
      .state('tab.transactionsQSsearch',{
        url:'/transactionqsrsearch',
        views:{
          'tab-home':{
            templateUrl:'template/transactions-qssearch.html',
            controller:'TransSignSearchCtrl'
          }
        }
      })
      .state('tab.transactions-saixuan',{
          url:'/transactionssaixuan',
          views:{
            'tab-home':{
              templateUrl:'template/transactions-search.html',
              controller:'TransactionsSaixuanCtrl'
            }
          }
      })



      //融资
      .state('tab.rongzi', {
        url: '/rongzi',
        views: {
          'tab-rongzi': {
            templateUrl: 'template/tab-rongzi.html',
            controller: 'RongziCtrl'
          }
        }
      })
      .state('tab.rongzihistory',{
        url: '/rongzi/history',
        views: {
          'tab-rongzi': {
            templateUrl: 'template/rongzi-history.html',
            controller:'RzhistoryCtrl'
          }
        }
      })
      .state('tab.rongziPingZheng',{
      url: '/rongzi/history/rongziPingZheng',
        views: {
        'tab-rongzi': {
          templateUrl: 'template/rongzi-history-pingzheng.html',
            //controller:'RzhistoryCtrl'
        }
      }
    })
      .state('tab.rongziHistoryshaixuan',{
        url: '/rongzi/history/shaixuan',
        views: {
          'tab-rongzi': {
            templateUrl: 'template/rongzi-shaixuan.html',
          }
        }
      })
      .state('tab.rongziMessage',{
        url: '/rongzi/history/message/:pid',
        views: {
          'tab-rongzi': {
            templateUrl: 'template/rongzi-message.html',
            controller:'RongziMessageCtrl'
          }
        }
      })
      .state('tab.RZPingZheng',{
        url: '/rongzi/history/message/RZPingZheng',
        views: {
          'tab-rongzi': {
            templateUrl: 'template/rongzi-RZPingZheng.html',
          }
        }
      })
      .state('tab.RZXieYi',{
        url: '/rongzi/history/message/RZXieYi',
        views: {
          'tab-rongzi': {
            templateUrl: 'template/rongzi-RZPingZheng.html',
          }
        }
      })
      .state('tab.rongzizhongbaoquan',{
        url: '/rongzi/baoquan',
        views: {
          'tab-rongzi': {
            templateUrl: 'template/rongzi-baoquan.html',
            controller:'RzzhongCtrl'
          }
        }
      })
      .state('tab.baoquanDaiQianShou',{
        url: '/rongzi/baoquanDaiQianShou',
        views: {
          'tab-rongzi': {
            templateUrl: 'template/rongzi-baoquandaiqianshou.html',
          }
        }
      })
      .state('tab.RZChooseBank',{
        url: '/rongzi/ChooseBank',
        views: {
          'tab-rongzi': {
            templateUrl:'template/rongzi-chooseBank.html',
            controller:'RZChooseBankCtrl'
          }
        }
      })
      .state('tab.baoquanDaiFuHe',{
        url: '/rongzi/baoquanDaiFuHe/:id',
        views: {
          'tab-rongzi': {
            templateUrl: 'template/rongzi-baoquandaifuhe.html',
            controller:'BaoQuanDaiFuHeCtrl'
          }
        }
      })
      .state('tab.chehuiSuccess',{
        url: '/rongzi/chehuiSuccess/:txnStat:appNo:disctAmt',
        views: {
          'tab-rongzi': {
            templateUrl: 'template/rongzi-chehui-success.html',
            controller:'RZchehuiSuccessCtrl'
          }
        }
      })
      .state('tab.baoquanShouLiZhong',{
        url: '/rongzi/baoquanShouLiZhong/:id',
        views: {
          'tab-rongzi': {
            templateUrl: 'template/rongzi-baoquanshoulizhong.html',
            controller:'BussDetailProgressCtrl'
          }
        }
      })
      .state('tab.baoquanBianJi',{
        url: '/rongzi/baoquanBianJi',
        views: {
          'tab-rongzi': {
            templateUrl: 'template/rongzi-baoquan-bianji.html',
            controller:'BaoQuanBianJiCtrl'
          }
        }
      })
      .state('tab.rongziLastStep',{
        url: '/rongzi/rongziLastStep',
        views: {
          'tab-rongzi': {
            templateUrl: 'template/rongzi-laststep.html',
            controller:'RongZiLastStepCtrl'
          }
        }
      })
      .state('tab.BankSuccess',{
        url: '/rongzi/BankSuccess',
        views: {
          'tab-rongzi': {
            templateUrl: 'template/rongzi-bank-success.html',
          }
        }
      })






      //转让
      .state('tab.zhuanrang', {
        url: '/zhuanrang',
        views: {
          'tab-zhuanrang': {
            templateUrl: 'template/tab-zhuanrang.html',
            controller: 'ZrangCtrl'
          }
        }
      })
      .state('tab.ZRxieyi',{
        url: '/ZRxieyi/:id',
        views: {
          'tab-zhuanrang': {
            templateUrl: 'template/file-ZRxieyi.html',
            controller: 'ZRxieyiCtrl'
          }
        }
      })
      .state('tab.ZRtongzhi',{
        url: '/ZRtongzhi:id',
        views: {
          'tab-zhuanrang': {
            templateUrl: 'template/file-ZRtongzhi.html',
            controller: 'ZRtongzhiCtrl'
          }
        }
      })
      .state('tab.zranghistory',{
        url:'/zhuanrang/history',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-history.html',
            controller:'ZrangHistoryCtrl'
          }
        }
      })
      .state('tab.ZhuanRangXieYi',{
        url:'/zhuanrang/ZhuanRangXieYi',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-history-msg-xieyi.html',
          }
        }
      })
      .state('tab.ZhuanRangPingZheng',{
        url:'/zhuanrang/ZhuanRangPingZheng',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-history-msg-pingzheng.html',
          }
        }
      })
      .state('tab.ZhuanRangTongZhi',{
        url:'/zhuanrang/ZhuanRangTongZhi',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-history-msg-tongzhi.html',
          }
        }
      })
      .state('tab.shaixuan',{
        url:'/zhuanrang/shaixuan',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-shaixuan.html',
            //controller:'ZrangShaiXuanCtrl'
          }
        }
      })
      .state('tab.zrangMessage',{
        url:'/zhuanrang/message/:id',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-history-message.html',
            controller:'zrangMessageCtrl'
          }
        }
      })
      .state('tab.zrangMessageCheHui',{
        url:'/zhuanrang/messageCheHui/:id',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-message-chehui.html',
            controller:'zrangMessageCheHuiCtrl'
          }
        }
      })
      .state('tab.yizhuanyi',{
        url:'/yizhuanyi',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-yizhuanyi.html',
            controller:'YiZhuanYiCtrl'
          }
        }
      })
      .state('tab.yizhuanduo',{
        url:'/yizhuanduo',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-yizhuanduo.html',
            controller:'YiZhuanDuoCtrl'
          }
        }
      })
      .state('tab.duozhuanyi',{
        url:'/duozhuanyi',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-duozhuanyi.html',
            controller:'DuoZhuanYiCtrl'
          }
        }
      })
      .state('tab.YZYxuanzebaoquan',{
        url:'/yizhuanyi/YZYxuanzebaoquan/:id:isseAmt:drftNo:dueDt:dueDays',
        cache:false,
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-YZYxuanzebaoquan.html',
            controller:'YZYxuanzebaoquanCtrl'
          }
        }
      })
      .state('tab.YZYChoosegys',{
        url:'/yizhuanyi/YZYChoosegys',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-YZYchoosegys.html',
            controller:'YZYChoosegysCtrl'
          }
        }
      })
      .state('tab.YZYAddJiaoYiDuiShou',{
        url:'/yizhuanyi/YZYAddJiaoYiDuiShou',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-YZYAddJiaoYiDuiShou.html',
            controller:'YZYAddJiaoYiDuiShouCtrl'
          }
        }
      })
      .state('tab.YZYLastStep',{
        url:'/yizhuanyi/YZYLastStep/:isseAmt:dueDt:dueDays:drftNo:corpName',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-YZYlaststep.html',
            controller:'YZYLastStepCtrl'
          }
        }
      })
      .state('tab.YZYIsSuccess',{
        url:'/yizhuanyi/YZYIsSuccess/:isseAmt',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-YZYissuccess.html',
            controller:'YZYIsSuccessCtrl'
          }
        }
      })
      .state('tab.YZDFirstStep',{
        url:'/yizhuanduo/YZDFirstStep/:id',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-YZDfirststep.html',
            controller:'YZDFirstStepCtrl'
          }
        }
      })
      .state('tab.YZDChoosegys',{
        url:'/yizhuanduo/YZDChoosegys',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-YZDchoosegys.html',
            controller:'YZDChoosegysCtrl'
          }
        }
      })
      .state('tab.YZDAddJiaoYiDuiShou',{
        url:'/yizhuanduo/YZDAddJiaoYiDuiShou',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-YZDAddJiaoYiDuiShou.html',
            controller:'YZDAddJiaoYiDuiShouCtrl'
          }
        }
      })
      .state('tab.YZDLastStep',{
        url:'/yizhuanduo/YZDLastStep/:id',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-YZDlaststep.html',
            controller:'YZDLastStepCtrl'
          }
        }
      })
      .state('tab.YZDIsSuccess',{
        url:'/yizhuanduo/YZDIsSuccess',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-YZDissuccess.html',
          }
        }
      })
      .state('tab.DZYChooseGYS',{
        url:'/duozhuanyi/DZYChooseGYS',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-DZYchoosegys.html',
            controller:'DZYChooseGYSCtrl'
          }
        }
      })
      .state('tab.DZYAddJiaoYiDuiShou',{
        url:'/duozhuanyi/DZYAddJiaoYiDuiShou',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-DZYAddJiaoYiDuiShou.html',
            controller:'DZYAddJiaoYiDuiShouCtrl'
          }
        }
      })
      .state('tab.DZYxuanzebaoquan',{
        url:'/duozhuanyi/DZYxuanzebaoquan',
        views:{
          'tab-zhuanrang':{
            templateUrl:'template/zrang-DZYxuanzebaoquan.html',
            controller:'DZYBaoQuanDetail'
          }
        }
      })
      .state('tab.DZYlaststep',{
        url:'/duozhuanyi/DZYlaststep',
        views: {
          'tab-zhuanrang': {
            templateUrl: 'template/zrang-DZYlaststep.html',
            controller:'DZYyanzhengCtrl'
          }
        }
      })
      .state('tab.DZYIsSuccess',{
        url:'/duozhuanyi/DZYIsSuccess/:isseAmt',
        views: {
          'tab-zhuanrang': {
            templateUrl: 'template/zrang-DZYissuccess.html',
            controller:'DZYIsSuccessCtrl'
          }
        }
      })
       //我的
      .state('tab.mine', {
        url: '/mine',
        views: {
          'tab-mine': {
            templateUrl: 'template/tab-mine.html',
            controller: 'MineCtrl'
          }
        }
      })
      .state('tab.ChangeCompany',{
        url: '/mine/ChangeCompany',
        views: {
          'tab-mine': {
            templateUrl: 'template/mine-changecompany.html',
            controller:'ChangeCompanyCtrl'
          }
        }
      })
      .state('tab.MineBaoQuan',{
        url: '/mine/MineBaoQuan',
        views: {
          'tab-mine': {
            templateUrl: 'template/mine-minebaoquan.html',
            controller:'MineBaoQuanCtrl'
          }
        }
      })
      .state('tab.MineBaoQuanMessage',{
        url: '/mine/MineBaoQuanMessage/:id',
        views: {
          'tab-mine': {
            templateUrl: 'template/mine-minebaoquanmessage.html',
            controller:'MineBaoQuanMessageCtrl'
          }
        }
      })
      .state('tab.ApplyInsurance',{
        url: '/ApplyInsurance/:validAmt:dueDays:drftNo',
        views: {
          'tab-mine': {
            templateUrl: 'template/mine-applyinsurance.html',
            controller:'ApplyInsuranceCtrl'
          }
        }
      })
      .state('tab.BaoQuanXuZhi',{
        url: '/ApplyInsurance',
        views: {
          'tab-mine': {
            templateUrl: 'template/mine-apply-seeXieYi.html',

          }
        }
      })
      .state('tab.ApplyInsuranceSuccess',{
        url: '/ApplyInsuranceSuccess',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-apply-insurance-success.html',
            controller:'ApplyInsuranceSuccessCtrl'
          }
        }
      })
      .state('tab.MineCompany',{
        url: '/MineCompany',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-company.html',
            controller:'MineCompanyCtrl'
          }
        }
      })
      .state('tab.ApplyZhengShu',{
        url: '/ApplyZhengShu',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-applyzhengshu.html',
            controller:'ApplyZhengShuCtrl'
          }
        }
      })
      .state('tab.ApplyRegister',{
        url: '/ApplyRegister',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-applyRegister.html',
            controller:'ApplyRegisterCtrl'
          }
        }
      })
      .state('tab.MineJiaoYiDuiShou',{
        url: '/MineJiaoYiDuiShou',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-jiaoyiduishou.html',
            controller:'MineJiaoYiDuiShouCtrl'
          }
        }
      })
      .state('tab.addJiaoyiduishou',{
        url: '/addJiaoyiduishou',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-jiaoyiduishou-add.html',
            controller:'AddJiaoyiduishouCtrl'
          }
        }
      })
      .state('tab.MineBankID',{
        url: '/MineBankID',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-bankID.html',
            controller:'MineBankIDCtrl'
          }
        }
      })
      .state('tab.BankIDCheckLostFir',{
        url: '/BankIDCheckLost/:id',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-bankID-checkLost-1.html',
            controller:'BankIDCheckLostFirCtrl'
          }
        }
    })
      .state('tab.BankIDCheckLostSec',{
        url: '/BankIDCheckLost',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-bankID-checkLost-2.html',
            controller:'BankIDCheckLostSecCtrl'
          }
        }
      })
      .state('tab.AlreadySendMoneyFirst',{
        url: '/AlreadySendMoneyFirst/:id',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-bankID-already-send-money-1.html',
            controller:'AlreadySendMoneyFirstCtrl'
          }
        }
      })
      .state('tab.AlreadySendMoneySec',{
        url: '/AlreadySendMoneySec/:id',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-bankID-already-send-money-2.html',
            controller:'AlreadySendMoneySecCtrl'
          }
        }
      })
      .state('tab.AlreadySendMoneyThird',{
        url: '/AlreadySendMoneyThird',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-bankID-already-send-money-3.html',
            controller:'AlreadySendMoneyThirdCtrl'
          }
        }
      })
      .state('tab.MineBankIDAdd',{
        url: '/MineBankIDAdd',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-bankID-add.html',
            controller:'MineBankIDAddCtrl'
          }
        }
      })
      .state('tab.MineUserManage',{
        url: '/MineUserManage',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-usermanage.html',
            controller:'MineUserManageCtrl'
          }
        }
      })
      .state('tab.UserMessage',{
        url: '/UserMessage/:id',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-user-messge.html',
            controller:'UserMessageCtrl'
          }
        }
      })
      .state('tab.PassworkReset',{
        url: '/PassworkReset/:id',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-user-message-resetpwd.html',
            controller:'PassworkResetCtrl'
          }
        }
      })
      .state('tab.UserMessageVerify',{
        url: '/UserMessageVerify/:id',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-user-message-submit.html',
            controller:'UserMessageVerifyCtrl'
          }
        }
      })
      .state('tab.UserMessageKindsChoose',{
        url: '/UserMessageKindsChoose/:id',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-user-manage-kinds-choose.html',
            controller:'UserMessageKindsChooseCtrl'
          }
        }
      })
      .state('tab.MineUseHelp',{
        url: '/MineUseHelp',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-help.html',
            controller:'MineUseHelpCtrl'
          }
        }
      })
        .state('tab.MineUseHelpDetail',{
          url: '/MineUseHelpdetail',
          views: {
            'tab-mine': {
              templateUrl:'template/mine-help-detail.html',
              controller:'MineusehelpdetailCtrl'
            }
          }
        })
      .state('tab.MineBaoQuanShaiXuan',{
        url: '/MineBaoQuanShaiXuan',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-minebaoquan-shaixuan.html',
          }
        }
      })
      .state('tab.MineUserAdd',{
        url: '/MineUserAdd',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-user-manage-add.html',
            controller:'MineUserAddCtrl'
          }
        }
      })
      .state('tab.MineUserAddChooseRole',{
        url: '/MineUserAddChooseRole',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-user-manager-chooseRole.html',
            controller:'MineUserAddChooseRoleCtrl'
          }
        }
      })
      .state('tab.MineSelfMessage',{
        url: '/MineSelfMessage',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-self-message.html',
            controller:'MineSelfMessageCtrl'
          }
        }
      })
      .state('tab.MineResetEmail',{
        url: '/MineSelfMessage',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-self-resetEmail.html',
            controller:'MineResetEmailCtrl'
          }
        }
      })
      .state('tab.MineResetAddress',{
        url: '/MineSelfMessage',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-self-resetAddress.html',
            controller:'MineResetAddressCtrl'
          }
        }
      })
      .state('tab.MineSetting',{
        url: '/MineSetting',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-setting.html',
            controller:"MineSettingCtrl"
          }
        }
      })
      .state('tab.AccountSafe',{
        url: '/AccountSafe',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-account-safe.html',
          }
        }
      })
      .state('tab.ResetPhoneNumber',{
        url: '/ResetPhoneNumber',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-setting-resetPhoneNumber.html',
            controller:'ResetPhoneNumberCtrl'
          }
        }
      })
      .state('tab.ResetPhoneOutside',{
        url: '/ResetPhoneOutside',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-resetPhone-outSide.html',
            controller:'ResetPhoneOutsideCtrl'
          }
        }
      })
      .state('tab.ResetPassword',{
        url: '/ResetPassword',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-setting-resetpassword.html',
            controller:'ResetPasswordCtrl'
          }
        }
      })
      .state('tab.DistinguishedAdvice',{
        url: '/DistinguishedAdvice',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-setting-advice.html',
            controller:'DistinguishedAdviceCtrl'
          }
        }
      })
      .state('tab.AdviceHistory',{
        url: '/AdviceHistory',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-setting-advice-history.html',
            controller:'AdviceHistoryCtrl'
          }
        }
      })
      .state('tab.ProductVersions',{
        url: '/ProductVersions',
        views: {
          'tab-mine': {
            templateUrl:'template/mine-product-versions.html',
            controller:'ProductVersionsCtrl'
          }
        }
      })

      $urlRouterProvider.otherwise('/login');
  })
