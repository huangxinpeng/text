// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('zxscf', ['ionic','zxscf.widget','zxscf.controllers', 'zxscf.services','zxscf.config'])

.run(function ($ionicPlatform,$location,$ionicPopup) {
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
      }
    });
  $ionicPlatform.registerBackButtonAction(function(e){
    e.preventDefault();
    /*退出登录*/
    function showConfirm(){
      var servicePopup = $ionicPopup.show({
        title: '提示',
        subTitle: '你确定要退出应用吗？',
        scope: $rootScope,
        buttons: [
          {
            text: '取消',
            type: 'button-clear button-assertive',
            onTap: function () {
            return 'cancel';
            }
          },
          {
            text: '确认',
            type: 'button-clear button-assertive border-left',
            onTap: function (e) {
            return 'active';
            }
          },
        ]
      });
      servicePopup.then(function (res) {
        if (res == 'active') {
          // 退出app
          ionic.Platform.exitApp();
        }
      });
    };
    if($location.path() == '/login' || $location.path() =='/home' || $location.path() == '/message' || $location.path() == '/mine'){
      showConfirm();
    }
  },101);


})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

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
      //忘记密码
      .state('forgetpwd',{
        url:'/forgetpwd',
        templateUrl:'template/forget-pwd.html',
        controller:'forgetpwdCtrl'
      })


      //tab
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'template/tab.html',
        controller: 'TabCtrl'
      })


      //=====主页=====
      .state('tab.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: 'template/tab-home.html'
            //controller: 'HomeCtrl'
          }
        }
      })


      /*融资受理*/
      .state('tab.rzaccept', {
        url: '/rzaccept',
        cache:false,
        views: {
          'tab-home': {
            templateUrl: 'template/rzaccept.html',
            controller:'RzacceptCtrl'
          }
        }
      })
      .state('tab.rzaccept-danbi', {
        url: '/rzacceptdanbi/::pid',
        views: {
          'tab-home': {
            templateUrl: 'template/rzaccept-danbi.html',
            controller:'RzacceptdanbiCtrl'
          }
        }
      })
      .state('tab.rzaccept-success', {
        url: '/rzacceptsuccess/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/rzaccept-success.html',
            controller:'RzacceptsucCtrl'
          }
        }
      })
      .state('tab.rzaccept-reject', {
        url: '/rzacceptreject/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/rzaccept-reject.html',
            controller:'RzacceptsucCtrl'
          }
        }
      })

      /*融资审核*/
      .state('tab.rzcheck', {
        url: '/rzcheck',
        cache:false,
        views: {
          'tab-home': {
            templateUrl: 'template/rzcheck.html',
            controller:'RzcheckCtrl'
          }
        }
      })
      .state('tab.rzcheck-danbi', {
        url: '/rzcheckdanbi/::pid',
        views: {
          'tab-home': {
            templateUrl: 'template/rzcheck-danbi.html',
            controller:'RzcheckdanbiCtrl'
          }
        }
      })
      .state('tab.rzcheck-success', {
        url: '/rzchecksuccess/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/rzcheck-success.html',
            controller:'RzchecksucCtrl'
          }
        }
      })
      .state('tab.rzcheck-reback', {
        url: '/rzcheckreback/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/rzcheck-reback.html',
            controller:'RzchecksucCtrl'
          }
        }
      })
      .state('tab.rzcheck-reject', {
        url: '/rzcheckreject/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/rzcheck-reject.html',
            controller:'RzchecksucCtrl'
          }
        }
      })

      /*风控审核*/
      .state('tab.riskreview', {
        url: '/riskreview',
        cache:false,
        views: {
          'tab-home': {
            templateUrl: 'template/riskreview.html',
            controller:'RiskreviewCtrl'
          }
        }
      })
      .state('tab.riskreview-danbi', {
        url: '/riskreviewdanbi/::pid',
        views: {
          'tab-home': {
            templateUrl: 'template/riskreview-danbi.html',
            controller:'RiskreviewdanbiCtrl'
          }
        }
      })
      .state('tab.riskreview-success', {
        url: '/riskreviewsuccess/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/riskreview-success.html',
            controller:'RiskreviewsucCtrl'
          }
        }
      })
      .state('tab.riskreview-reject', {
        url: '/riskreviewreject/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/rzaccept-reject.html',
            controller:'RiskreviewsucCtrl'
          }
        }
      })

      /*风控审核*/
      .state('tab.riskcheck', {
        url: '/riskcheck',
        cache:false,
        views: {
          'tab-home': {
            templateUrl: 'template/riskcheck.html',
            controller:'RiskcheckCtrl'
          }
        }
      })
      .state('tab.riskcheck-danbi', {
        url: '/riskcheckdanbi/::pid',
        views: {
          'tab-home': {
            templateUrl: 'template/riskcheck-danbi.html',
            controller:'RiskcheckdanbiCtrl'
          }
        }
      })
      .state('tab.riskcheck-success', {
        url: '/riskchecksuccess/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/riskcheck-success.html',
            controller:'RiskchecksucCtrl'
          }
        }
      })
      .state('tab.riskcheck-reject', {
        url: '/riskcheckreject/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/rzaccept-reject.html',
            controller:'RiskchecksucCtrl'
          }
        }
      })

      /*融资审批*/
      .state('tab.rzapprove', {
        url: '/rzapprove',
        cache:false,
        views: {
          'tab-home': {
            templateUrl: 'template/rzapprove.html',
            controller:'RzapproveCtrl'
          }
        }
      })
      .state('tab.rzapprove-danbi', {
        url: '/rzapprovedanbi/::pid',
        views: {
          'tab-home': {
            templateUrl: 'template/rzapprove-danbi.html',
            controller:'RzapprovedanbiCtrl'
          }
        }
      })
      .state('tab.rzapprove-success', {
        url: '/rzapprovesuccess/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/rzapprove-success.html',
            controller:'RzapprovesucCtrl'
          }
        }
      })
      .state('tab.rzapprove-reback', {
        url: '/rzapprovereback/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/rzcheck-reback.html',
            controller:'RzapprovesucCtrl'
          }
        }
      })
      .state('tab.rzapprove-reject', {
        url: '/rzapprovereject/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/rzaccept-reject.html',
            controller:'RzapprovesucCtrl'
          }
        }
      })

      /*计财审核*/
      .state('tab.fiscalcheck', {
        url: '/fiscalcheck',
        cache:false,
        views: {
          'tab-home': {
            templateUrl: 'template/fiscalcheck.html',
            controller:'FiscalcheckCtrl'
          }
        }
      })
      .state('tab.fiscalcheck-danbi', {
        url: '/fiscalcheckdanbi/::pid',
        views: {
          'tab-home': {
            templateUrl: 'template/fiscalcheck-danbi.html',
            controller:'FiscalcheckdanbiCtrl'
          }
        }
      })
      .state('tab.fiscalcheck-success', {
        url: '/fiscalchecksuccess/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/fiscalcheck-success.html',
            controller:'FiscalchecksucCtrl'
          }
        }
      })

      /*融资到期*/
      .state('tab.rzdue', {
        url: '/rzdue',
        cache:false,
        views: {
          'tab-home': {
            templateUrl: 'template/rzdue.html',
            controller:'RzdueCtrl'
          }
        }
      })
      .state('tab.rzdue-batch',{
        url:'/bquandaoqibatch',
        views:{
          'tab-home':{
            templateUrl:'template/rzdue-batch.html',
            controller:'RzduebatcCtrl'
          }
        }
      })
      .state('tab.rzdue-danbi', {
        url: '/rzduedanbi/:id',
        views: {
          'tab-home': {
            templateUrl: 'template/rzdue-danbi.html',
            controller:'RzduedanbiCtrl'
          }
        }
      })
      .state('tab.rzdue-success', {
        url: '/rzduesuccess',
        views: {
          'tab-home': {
            templateUrl: 'template/rzdue-success.html',
            controller:'RzduesucCtrl'
          }
        }
      })

      /*付款审核*/
      .state('tab.paycheck', {
        url: '/paycheck',
        cache:false,
        views: {
          'tab-home': {
            templateUrl: 'template/paycheck.html',
            controller:'PaycheckCtrl'
          }
        }
      })
      .state('tab.paycheck-danbi', {
        url: '/paycheckdanbi/::pid',
        views: {
          'tab-home': {
            templateUrl: 'template/paycheck-danbi.html',
            controller:'PaycheckdanbiCtrl'
          }
        }
      })
      .state('tab.paycheck-success', {
        url: '/paychecksuccess/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/paycheck-success.html',
            controller:'PaychecksucCtrl'
          }
        }
      })
      .state('tab.paycheck-reject', {
        url: '/paycheckreject/::Mon:Count',
        views: {
          'tab-home': {
            templateUrl: 'template/paycheck-reject.html',
            controller:'PaychecksucCtrl'
          }
        }
      })

      /*企业审核*/
      .state('tab.usercheck', {
        url: '/usercheck',
        cache:false,
        views: {
          'tab-home': {
            templateUrl: 'template/usercheck.html',
            controller:'UsercheckCtrl'
          }
        }
      })
      .state('tab.usercheck-danbi', {
        url: '/usercheckdanbi/::pid',
        views: {
          'tab-home': {
            templateUrl: 'template/usercheck-danbi.html',
            controller:'UsercheckdanbiCtrl'
          }
        }
      })
      .state('tab.usercheck-success', {
        url: '/userchecksuccess/::Count',
        views: {
          'tab-home': {
            templateUrl: 'template/usercheck-success.html',
            controller:'UserchecksucCtrl'
          }
        }
      })
      .state('tab.usercheck-reject', {
        url: '/usercheckreject/::Count',
        views: {
          'tab-home': {
            templateUrl: 'template/usercheck-reject.html',
            controller:'UserchecksucCtrl'
          }
        }
      })

      /*用户审核*/
      .state('tab.admincheck', {
        url: '/admincheck',
        cache:false,
        views: {
          'tab-home': {
            templateUrl: 'template/admincheck.html',
            controller:'AdmincheckCtrl'
          }
        }
      })
      .state('tab.admincheck-danbi', {
          url: '/admincheckdanbi/::pid',
          views: {
            'tab-home': {
              templateUrl: 'template/admincheck-danbi.html',
              controller:'AdmincheckdanbiCtrl'
            }
          }
      })
      .state('tab.admincheck-success', {
          url: '/adminchecksuccess/::Count',
          views: {
            'tab-home': {
              templateUrl: 'template/admincheck-success.html',
              controller:'AdminchecksucCtrl'
            }
          }
      })
      .state('tab.admincheck-reject', {
          url: '/admincheckreject/::Count',
          views: {
            'tab-home': {
              templateUrl: 'template/admincheck-reject.html',
              controller:'AdminchecksucCtrl'
            }
          }
      })

      //=====消息=====
      .state('tab.message', {
        url: '/message',
        views: {
          'tab-message': {
            templateUrl: 'template/tab-message.html',
            controller: 'MessageCtrl'
          }
        }
      })


      //=====我的=====
      .state('tab.mine', {
        url: '/mine',
        views: {
          'tab-mine': {
            templateUrl: 'template/tab-mine.html',
            controller: 'MineCtrl'
          }
        }
      })
      /*个人中心*/
      .state('tab.mycenter', {
        url: '/mycenter',
        views: {
          'tab-mine': {
            templateUrl: 'template/mycenter.html',
            controller: 'MineCtrl'
          }
        }
      })
      /*--历史任务--*/
      .state('tab.history', {
        url: '/history',
        views: {
          'tab-mine': {
            templateUrl: 'template/history.html'
          }
        }
      })
      /*融资受理历史*/
      .state('tab.history-rzaccept', {
        url: '/historyrzaccept',
        views: {
          'tab-mine': {
            templateUrl: 'template/history-rzaccept.html',
            controller:'RzaccepthistCtrl'
          }
        }
      })
      /*融资审核历史*/
      .state('tab.history-rzcheck', {
        url: '/historyrzcheck',
        views: {
          'tab-mine': {
            templateUrl: 'template/history-rzcheck.html',
            controller:'RzcheckhistCtrl'
          }
        }
      })
      /*付款审核历史*/
      .state('tab.history-paycheck', {
        url: '/historypaycheck',
        views: {
          'tab-mine': {
            templateUrl: 'template/history-paycheck.html',
            controller:'PaycheckhistCtrl'
          }
        }
      })
      /*风控审查历史*/
      .state('tab.history-riskreview', {
        url: '/historyriskreview',
        views: {
          'tab-mine': {
            templateUrl: 'template/history-riskreview.html',
            controller:'RiskreviewhistCtrl'
          }
        }
      })
      /*风控审核历史*/
      .state('tab.history-riskcheck', {
        url: '/historyriskcheck',
        views: {
          'tab-mine': {
            templateUrl: 'template/history-riskcheck.html',
            controller:'RiskcheckhistCtrl'
          }
        }
      })
      /*融资审批历史*/
      .state('tab.history-rzapprove', {
        url: '/historyrzapprove',
        views: {
          'tab-mine': {
            templateUrl: 'template/history-rzapprove.html',
            controller:'RzapprovehistCtrl'
          }
        }
      })
      /*计财放款*/
      .state('tab.history-fiscalcheck', {
        url: '/historyfiscalcheck',
        views: {
          'tab-mine': {
            templateUrl: 'template/history-fiscalcheck.html',
            controller:'FiscalcheckhistCtrl'
          }
        }
      })
      /*用户审核历史*/
      .state('tab.history-usercheck', {
        url: '/historyusercheck',
        views: {
          'tab-mine': {
            templateUrl: 'template/history-usercheck.html',
            controller:'UsercheckhistCtrl'
          }
        }
      })

      /*--账户安全--*/
      .state('tab.accsecurity', {
        url: '/security',
        views: {
          'tab-mine': {
            templateUrl: 'template/accsecurity.html'
          }
        }
      })
        .state('tab.accsecurity-phonenumberFirstStep',{
          url: '/accsecurity-phonenumberFirstStep',
          views: {
            'tab-mine': {
              templateUrl: 'template/accsecurity-phonenumberFirstStep.html',
              controller:'PhonenumberFirstStepCtrl'
            }
          }
        })
      /*修改手机号码*/
      .state('tab.accsecurity-phonenumber', {
        url: '/accsecurity-phonenumber',
        views: {
          'tab-mine': {
            templateUrl: 'template/accsecurity-phonenumber.html',
            controller:'ResetPhoneNumberCtrl'
          }
        }
      })
      /*修改密码*/
      .state('tab.accsecurity-password', {
        url: '/accsecurity-password',
        views: {
          'tab-mine': {
            templateUrl: 'template/accsecurity-password.html',
            controller:'ResetPasswordCtrl'
          }
        }
      })
      /*修改密码*/
      // .state('tab.accsecurity-password', {
      //   url: '/accsecurity-password',
      //   views: {
      //     'tab-mine': {
      //       templateUrl: 'template/accsecurity-password.html'
      //     }
      //   }
      // })
      /*--关于晨蜂--*/
      .state('tab.aboutversions', {
        url: '/aboutversions',
        views: {
          'tab-mine': {
            templateUrl: 'template/aboutversions.html',
            controller:'VersionsCtrl'
          }
        }
      });

      $urlRouterProvider.otherwise('/login');
    });
