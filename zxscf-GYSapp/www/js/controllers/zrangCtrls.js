/**
 * Created by haibo on 2017/8/12.
 */
/* 转让版块控制 */
angular.module('zxscf.controllers.zrang', [])
  //转让主页面
  .controller('ZrangCtrl', function ($scope,$state,ZrangZhong,$interval,$ionicLoading,ZrangDetailSearch,ToolService,$rootScope,$ionicPopup,ZrangDetailCancel,$ionicHistory,ZrangTotal,ZrangDetailCheHui,getSmsCode){

    //可转宝券总额
  ZrangTotal.http().then(function (res) {
    $rootScope.ZrangTotalSum = res.data;
  })
    //眼睛开闭控制
    $scope.isOpen = true;
    $scope.eyeCtrl = function () {
      $scope.isOpen = !$scope.isOpen;
    }
    var pages = 1;
    var afterResetHttp = function (pages) {
      //转让中明细查询
      var promise = ZrangDetailSearch.http(pages);
      promise.then(function (res) {
        console.log(res);
        $scope.ZrangZhongs = res.data.lists.list;
        $scope.sum = res.data.sum;
        $scope.total = res.data.lists.total;
        //日期金额格式化
        $scope.comjs = ToolService;


      })
    };
    //进入刷新
    $scope.$on('$ionicView.enter', function () {
      //初始化及清空历史
      $rootScope.getMessageInfo = "发送验证码";
      $rootScope.cint = '';//定时器
      $rootScope.DYZBaoQuanArray = {};//多转一存放金额及已选宝券
      $rootScope.YZDGYSArray = [];//一转多存放被选中的
      $rootScope.ChooseGYS = '';//一转一存放供应商
      $rootScope.rcvCustNo = '';//一转一存放供应商
      //清除历史记录及rootscope
      //$ionicHistory.clearHistory();
      afterResetHttp(1);
      $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
        if(from.name === 'tab.ZRxieyi' || from.name === 'tab.ZRtongzhi'){
          //不刷新
          console.log('不刷新');
        }else{
          afterResetHttp(1);
        }



      });
      //左右滑动
      $scope.addTransform = function (idx) {
        if ($scope.ZrangZhongs[idx].txnStat == '04' || $scope.ZrangZhongs.txnStat == '10') {
          $scope.ZrangZhongs[idx].isswipe = false;
          return;
        }
        $scope.ZrangZhongs[idx].isswipe = true;

      };
      $scope.transformNone = function (idx) {
        $scope.ZrangZhongs[idx].isswipe = false;
      };
      //点击
      $scope.ZRDetailBtn = function (idx) {
        $rootScope.jumpto('tab.zrangMessageCheHui', {id: idx});
      };
      //撤回
      $scope.ZrangCheHuiBtn = function ($event, id, $index) {
        //阻止冒泡
        $event.stopPropagation();
        var cint = '';//短信验证码定时器
        $scope.getmessageinfo = "发送验证码";
        $scope.msCode = {
          value: ''
        }
        var popUp = $ionicPopup.show({
          cssClass: 'my-popup',
          templateUrl: 'template/popup-chehui-isRead.html',
          scope: $scope
        });
        //获取验证码
        $scope.getCodeBtn = function () {
          //防止多次点击
          if ($scope.getmessageinfo != '发送验证码') {
            return;
          } else {
            //发送验证码
            var promiseGetCode = getSmsCode.getsmscode("ZR04");
            $scope.getmessageinfo = 60;
            cint = $interval(function () {
              $scope.getmessageinfo--;
              if ($scope.getmessageinfo <= 0) {
                $interval.cancel(cint);
                $scope.getmessageinfo = "发送验证码";
              }
              ;
            }, 1000);
            //获取的验证码校验逻辑--------------------未写
          }
        };
        //确定
        $scope.makesure = function () {
          var promiseChehui = ZrangDetailCheHui.http(id, $scope.msCode.value);
          promiseChehui.then(function (res) {
            console.log(res);
            if (res.code === '000000') {
              $ionicLoading.show({template: "操作成功", noBackdrop: true, duration: 1000});
              popUp.close();
              $scope.ZrangZhongs[$index].isswipe = false;//恢复
              afterResetHttp();

            } else if (res.code === '180028') {
              $ionicLoading.show({template: "当前日期票据不允许进行此项操作", noBackdrop: true, duration: 1000});
            }

          })
        };
        //取消
        $scope.giveout = function () {
          if (cint) {
            $interval.cancel(cint);
            $scope.getmessageinfo = '发送验证码';
          }
          $scope.ZrangZhongs[$index].isswipe = false;//恢复
          popUp.close();
        };
        //阅读协议
        $scope.ZRXieYiRead = function () {
          console.log('协议');
          //$scope.isShow = false;
          popUp.close();
          $rootScope.jumpto('tab.ZRxieyi',{id:id});
        };

        $scope.ZRTongZhiRead = function () {
          console.log('通知');
          popUp.close();
          $rootScope.jumpto('tab.ZRtongzhi',{id:id});

        }
      };
      //取消 $index 恢复原来样子
      $scope.ZrangQuXiaoBtn = function ($event, idx, $index) {
        //阻止冒泡
        $event.stopPropagation();
        //弹框确认
        var confirmPopup = $ionicPopup.confirm({
          title: '提示',
          template: '你确定取消此项待复核的操作吗？',
          cancelText: "取消",
          cancelType: "button-gray",
          okText: '确定',
          okType: "button-positive",
        });
        confirmPopup.then(function (res) {
          if (res) {
            //确认请求
            var promise = ZrangDetailCancel.http(idx);
            promise.then(function (res) {
              $scope.ZrangZhongs[$index].isswipe = false;//恢复
              afterResetHttp();

            })
          }
          else {
            $scope.ZrangZhongs[$index].isswipe = false;//恢复
          }
        });
      };

    });
    //下拉加载
    //$scope.load = {canBeLoad : true};
    //$scope.scroll = {
    //  loadMore : function () {
    //    console.log(111);
        //  //if (Math.ceil($scope.total / 10) <= pages) {
        //  //  $ionicLoading.show({template: "没有更多数据了", noBackdrop: true, duration: 1000});
        //  //
        //  //} else {
        //  //pages += 1;
        //  //afterResetHttp(pages)
        //$scope.canBeLoad = !$scope.canBeLoad;
        //$scope.$broadcast('scroll.infiniteScrollComplete');
        //  //ZrangDetailSearch.http(pages).then(function (res) {
        //  //
        //  //})
        //  //}
      //}
      //};
    //$scope.scroll.loadMore();



  })

  .controller('zrangMessageCtrl', function ($scope,$state,config,$ionicPopup,$ionicLoading,$stateParams,$rootScope,ToolService,ZRDetail,$stateParams,FileService,CertificatesFileDownload) {
    var promise = ZRDetail.http($stateParams.id)
    promise.then(function (res) {
      if(res.code === '000000'){
        $scope.ZRHistoryDetails = res.data;
        $scope.tool = ToolService;
        var appNo = $scope.ZRHistoryDetails.appNo;
        var bussType = '20';
        var tnCode = '2';
        var FileDownload = $rootScope.FileDownload;

        $scope.CafeXieYiFileLoad = function () {
          var fileType = 'MB05';
          FileDownload(appNo,bussType,fileType,tnCode);
        }
        $scope.CafeZrangFileLoad = function () {
            $state.go("tab.ZhuanRangPingZheng");
        }
        $scope.CafeZQZrangFileLoad = function () {
          var fileType = 'MB06';
          FileDownload(appNo,bussType,fileType,tnCode);
        }
      }else{
        $ionicLoading.show({template: "数据异常", noBackdrop: true, duration: 1000});
      }

    })
  })
  //协议
  .controller('ZRxieyiCtrl', function ($scope,ZrangDetailMsg,$stateParams,ToolService) {

    ZrangDetailMsg.http($stateParams.id).then(function (res) {
      console.log(res);
      $scope.tool = ToolService;
      //客户编号
      $scope.bianhao = res.data.srcDrftNo;
      $scope.jine = res.data.txnAmt;
      $scope.txnDt = res.data.txnDt;
      $scope.srcDueDt = res.data.srcDueDt;
      $scope.reqCustNm = res.data.reqCustNm;
      $scope.drwrNm = res.data.drwrNm;
      $scope.isseAmt = res.data.isseAmt;
      $scope.reqInfo = res.data.reqInfo;
      $scope.rcvInfo = res.data.rcvInfo;
    })
  })
  //通知
  .controller('ZRtongzhiCtrl', function ($scope,ZrangDetailMsg,$stateParams,ToolService) {
    ZrangDetailMsg.http($stateParams.id).then(function (res) {
      $scope.tool = ToolService;
      //客户编号
      $scope.bianhao = res.data.srcDrftNo;
      //日期
      var txnDt = res.data.txnDt;
      var arr = txnDt.split('');
      $scope.year = arr[0]+arr[1]+arr[2]+arr[3];
      $scope.mon = arr[4]+arr[5];
      $scope.day = arr[6]+arr[7]
      //金额
      $scope.piaomianjine = res.data.txnAmt;

      //不知道什么转入方还是什么转出方咯，已乱 - 开发人员已阵亡，勿找；
      $scope.zrper = res.data.rcvCustNm;

      $scope.zrbuss = res.data.drwrNm;
      $scope.isseAmt = res.data.isseAmt;
    })
  })
  //转让详情及是否撤回页面
  .controller('zrangMessageCheHuiCtrl', function ($scope,$stateParams,$rootScope,ZrangDetailMsg,ToolService,$ionicPopup,$interval,getSmsCode,ZrangDetailCheHui,$ionicHistory) {
    var promise = ZrangDetailMsg.http($stateParams.id);
    $scope.tool = ToolService;
    promise.then(function (res) {
      console.log(res);
      $scope.ZrangDetailMsg = res.data;

      var cint = '';//短信验证码定时器
      $scope.getmessageinfo = "发送验证码";
      $scope.msCode = {
        num:''
      }
      //撤回按钮
      $scope.CheHuiBtn = function () {
        var popUp1=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-zrang-chehui.html',
          scope:$scope
        });
        $scope.getMsgcode = function () {
          //防止多次点击
          if($scope.getmessageinfo != '发送验证码'){
            return;
          }else{
            //发送验证码
            var promiseGetCode = getSmsCode.getsmscode("ZR04");
            $scope.getmessageinfo = 60;
            cint = $interval(function(){
              $scope.getmessageinfo--;
              if($scope.getmessageinfo <= 0){
                $interval.cancel(cint);
                $scope.getmessageinfo = "发送验证码";
              };
            },1000);
            //获取的验证码校验逻辑--------------------未写
          }
        }
        $scope.makesure = function () {
          var promiseChehui = ZrangDetailCheHui.http($scope.msCode.num,$stateParams.id);
          promiseChehui.then(function (res) {
            console.log(res);
            popUp1.close();
            $ionicHistory.goBack(-1);
          })
            .catch(function (err) {
              console.log(err);
            })
        }
        $scope.giveout = function () {
          if(cint){
            $interval.cancel(cint);
            $scope.getmessageinfo = '发送验证码';
          }
          popUp1.close();
        }
      }
    })

  })
  //转让
  .controller('ZrangHistoryCtrl', function ($scope,ZRHistory,ToolService,$rootScope) {
    //init data
    //$scope.ZRHistoryMsg.sum = '0';

    var promise = ZRHistory.http();
    $scope.tool = ToolService;
    promise.then(function (res) {
      $scope.ZRHistoryMsg = res.data;
      console.log($scope.ZRHistoryMsg);
      $scope.ZRHistoryDetailBtn = function (id) {
          $rootScope.jumpto('tab.zrangMessage',{
          id:id
        })
      }
    })
  })
  //一转一
  .controller('YiZhuanYiCtrl', function ($scope,ZrangCorpBaoQuan,ToolService,$rootScope) {
    var condition = false;
    $scope.timeIconIsRotate = false;//图标旋转
    $scope.acountIconIsRotate = false;//图标旋转
    var HttpYZYchooseBaoQuan = function (condition) {
      $scope.ZrangCorpBaoQuanLists = [];
    var promise = ZrangCorpBaoQuan.http(condition);
    promise.then(function (res) {
      console.log(res);
      $scope.ZrangCorpBaoQuanLists = res.data.lists.list;
      //总金额
      $scope.ZrangCanUse = res.data.sum;
      $scope.cjs = ToolService;
      //
      $scope.YZYChoooseGys = function (id,isseAmt,drftNo,dueDt,dueDays) {
        $rootScope.YZYapplyId = id ;
        $rootScope.jumpto('tab.YZYxuanzebaoquan',{
          id:id,
          isseAmt:isseAmt,//可用宝券余额
          drftNo:drftNo,//宝券编号
          dueDt:dueDt,//到期日期
          dueDays:dueDays//到期时间
        })
      }
      $scope.parseInt = parseInt;
      //排序
      $scope.flag = '-dueDt';//默认时间从大到小排序


    })
    }
    HttpYZYchooseBaoQuan(condition);
    $scope.timeSort = function () {
      condition = !condition;
      if(condition){
        condition = '01';
      }else{
        condition = '02'
      }
      console.log(condition);
      HttpYZYchooseBaoQuan(condition);
      //图标旋转
      $scope.timeIconIsRotate = !$scope.timeIconIsRotate;
    };
    $scope.acountSort = function () {
      condition = !condition;
      if(condition){
        condition = '03';
      }else{
        condition = '04'
      }
      HttpYZYchooseBaoQuan(condition);
      //图标旋转
      $scope.acountIconIsRotate = !$scope.acountIconIsRotate;
    };
  })
  //一转一 选择供应商
  .controller('YZYxuanzebaoquanCtrl', function ($scope, $stateParams,ToolService,$rootScope,$ionicPopup,$ionicLoading) {

    $scope.ZrangCorpBaoQuanList = $stateParams;
    $scope.cjs = ToolService;
    //4.35
    //禁用下一步
    $scope.canBeClick = true;


    //判断页面是否经过了选择交易对手
    $scope.$on('$ionicView.enter', function () {

      if($rootScope.ChooseGYS != ''){
        $scope.canBeClick = false;
      }
      $scope.ZRcompany = {
        corpName:$rootScope.ChooseGYS
      }
    });
    //点击下一步传参
      $scope.ToYZYLastStepBtn = function (isseAmt,dueDt,dueDays,drftNo) {
      if($scope.canBeClick == false){
        $stateParams.ChooseGYS = $rootScope.ChooseGYS;
        $rootScope.jumpto('tab.YZYLastStep',{
          isseAmt:isseAmt,
          dueDt:dueDt,
          dueDays:dueDays,
          drftNo:drftNo,
          corpName:$scope.ZRcompany.corpName
        });
      }else{
        $ionicLoading.show({template: "请选择供应商", noBackdrop: true, duration:1000});
      };
    };


  })
  //一转一 交易对手
  .controller('YZYChoosegysCtrl', function ($scope,$rootScope,CounterpartyListPartner,JiaoYiDuiShouMsg,$state,$ionicHistory) {
    var promise = CounterpartyListPartner.http();
    promise.then(function (res) {
      console.log(res.data.list);
      $scope.JiaoYiDuiShouMsgs = res.data.list;
      $scope.ChooseGYSBtn = function (custCnNm,custNo) {
        //存储
        $rootScope.ChooseGYS = custCnNm;
        $rootScope.rcvCustNo = custNo;
        $ionicHistory.goBack(-1);
      }
    })
      .catch(function (err) {
      console.log(err);
    })
    //$scope.JiaoYiDuiShouMsgs = JiaoYiDuiShouMsg.all();

  })
  //一转一 添加交易对手
  .controller('YZYAddJiaoYiDuiShouCtrl', function ($scope, CounterpartyListAddPartner,SearchPartnerCorpName,$ionicLoading) {
      $scope.searchCorpName = {value : ''};
      $scope.AddPartnerBtn = function (custNo) {

        var promise = CounterpartyListAddPartner.http(custNo);
        promise.then(function (res) {
          console.log(res);
          if(res.code === '170013'){
            $ionicLoading.show({template: "您已添加了该交易对手，请勿重复添加", noBackdrop: true, duration: 1000});
            return;
          };
          if(res.code === '000000'){
            $ionicLoading.show({template: "添加成功", noBackdrop: true, duration: 1000});
            $scope.searchCorpName.value = '';
            $scope.corpLists = [];
          };
        })
      };
      //输入时发送
      $scope.searchCorp = function () {
        $scope.corpLists = [];
        console.log($scope.searchCorpName.value);
        if($scope.searchCorpName.value != ''){
          var qCustCnNm = $scope.searchCorpName.value;
          SearchPartnerCorpName.http(qCustCnNm).then(function (res) {
            console.log(res.data.list);
            $scope.corpLists = res.data.list;
          })
        }

      };

  })
  //一转一转让申请
  .controller('YZYLastStepCtrl',function($scope,$ionicPopup,$state,$stateParams,ToolService,$rootScope,getSmsCode,$interval,YZYApply,JiaoYiDuiShouMsg,$ionicHistory,$ionicLoading){

    $scope.ZrangCorpBaoQuanMsg = $stateParams;
    $scope.tool = ToolService;
    //重新选择交易对手
    $scope.reChooseGYS = function () {
      $rootScope.jumpto("tab.YZYChoosegys");
    }
    //重新监听页面参数
    $scope.$on('$ionicView.enter', function () {
      if ($rootScope.ChooseGYS != undefined) {
        $rootScope.CorpName = $rootScope.ChooseGYS;
      }
    });
    //到期日及收益金币计算
    //init收益率
    $scope.acc = 0.0435;
    $scope.yearAcc = 360;
    $scope.counts = {
      count:0
    };
    //输入的局到期日限制
    $scope.InputCountKeyUp = function () {
      if($scope.counts.count > 3600){
        $ionicLoading.show({template: "距到期日超过限制", noBackdrop: true, duration:1000});
        $scope.counts.count = 3600;
        return;
      }else{
        $scope.counts.count = $scope.counts.count;
      }
    }
    $scope.minusBtn = function(){
      if($scope.counts.count <= 0){
        $scope.counts.count = 0;
        return;
      }
      $scope.counts.count = $scope.counts.count - 1;
    }
    $scope.addBtn = function () {
      if($scope.counts.count >= 3600){
        $scope.counts.count = 3600;
        return;
      }
      $scope.counts.count = $scope.counts.count + 1;
    }
    $scope.sum = {
      res: $scope.ZrangCorpBaoQuanMsg.isseAmt * 1
    };

    //var cint = '';//短信验证码定时器
    //$scope.getmessageinfo = "发送验证码";

    //提示
    $scope.focusJuge = function () {
      if($scope.sum.res > $scope.ZrangCorpBaoQuanMsg.isseAmt){
        $scope.sum.res = $scope.ZrangCorpBaoQuanMsg.isseAmt * 1;
      }
      if($scope.sum.res < 0){
        $scope.sum.res = 0;
      }
    };

    //提交
    $scope.YZYSubmitBtn=function(){
          //提示框为消失、金额大于零、金额小于可转让金额
        if(  $scope.sum.res <= $scope.ZrangCorpBaoQuanMsg.isseAmt && $scope.sum.res > 0){
          var popUp=$ionicPopup.show({
            cssClass:'my-popup',
            templateUrl:'template/popup-YZY-ZYD-DYY.html',
            scope:$scope
          });
          $scope.getMsgcode = function () {
            //防止多次点击
            if($rootScope.getMessageInfo != '发送验证码'){
              return;
            }else{
              //发送验证码
              var promise = getSmsCode.getsmscode("ZR01");
              $rootScope.getMessageInfo = 60;
              $rootScope.cint = $interval(function(){
                $rootScope.getMessageInfo--;
                if($rootScope.getMessageInfo <= 0){
                  $interval.cancel($rootScope.cint);
                  $rootScope.getMessageInfo = "发送验证码";
                };
              },1000);
              //获取的验证码校验逻辑--------------------未写
            }
          };

          //确定
          //验证码获取
          $scope.msCode = {
            num:''
          };

          $scope.makesure=function(){
            var smsCode = $scope.msCode.num;//验证码
            var drftNo = $scope.ZrangCorpBaoQuanMsg.drftNo;//票据号码
            var rcvCustNm = $scope.ZrangCorpBaoQuanMsg.corpName;//企业名
            var rcvCustNo = $rootScope.rcvCustNo;//企业号
            var id = $rootScope.YZYapplyId;//id
            var isseAmt = $scope.sum.res;//金额
            var dueDays = $scope.counts.count;//延期天数
            if($scope.counts.count != 0){
              var isDelay = 1;//是否延期
            }else{
              var isDelay = 0;
            }
            var bouns = (( isseAmt * (dueDays + $scope.ZrangCorpBaoQuanMsg.dueDays * 1) * 0.0435 ) / 360).toFixed(2);//延期收益
            var delayDays =$scope.ZrangCorpBaoQuanMsg.dueDays * 1 + $scope.counts.count;
            //点击发送转让申请
            var ZRApplyList = [];
            var ZRApplyParams = {};
            ZRApplyParams.id = id;//id
            //ZRApplyParams.smsCode = smsCode;//验证码
            ZRApplyParams.rcvCustNo = rcvCustNo;//票据号码
            ZRApplyParams.rcvCustNm = rcvCustNm;//企业名
            ZRApplyParams.isDelay = isDelay;//是否延期
            ZRApplyParams.delayDays = delayDays;//是否延期
            ZRApplyParams.bouns = bouns;//延期收益
            ZRApplyParams.drftNo = drftNo;//票据号码
            ZRApplyParams.dueDays = dueDays;//延期天数
            ZRApplyParams.isseAmt = isseAmt;//金额
            ZRApplyList.push(ZRApplyParams);
            console.log(ZRApplyList);
            var promise = YZYApply.http(ZRApplyList,smsCode);
            promise.then(function (res) {
              console.log(res);
              //清除定时器恢复原样
              if($rootScope.cint){
                $interval.cancel($rootScope.cint);
                $rootScope.getMessageInfo = '发送验证码';
              };
              $scope.counts = {
                count:0
              };
              $scope.sum = {
                res:''
              };
              popUp.close();
              $rootScope.jumpto('tab.YZYIsSuccess',{isseAmt:isseAmt});
            })
              .catch(function (err) {
                console.log('验证码失败的情况未完成');
              });
          };
          //取消
          $scope.giveout = function () {
            if($rootScope.cint){
              $interval.cancel($rootScope.cint);
              $rootScope.getMessageInfo = '发送验证码';
            }
            popUp.close();
          }
          //到期日期小于0
        } else{
          $ionicLoading.show({template: "转让金额不能为零", noBackdrop: true, duration:1000});
        }
      }
  })
  .controller('YZYIsSuccessCtrl', function ($scope, $state,$ionicHistory,$stateParams,ToolService) {
    $scope.isseAmt = $stateParams.isseAmt;
    $scope.tool = ToolService;
    $scope.backFrom = function () {
      $ionicHistory.clearHistory();
      $ionicHistory.goBack(-4);
    }
  })
  //多转一
  .controller('DuoZhuanYiCtrl',function($scope,ZrangCorpBaoQuan,$rootScope,ToolService,$ionicLoading,$state){
    ZrangCorpBaoQuan.http().then(function (res) {
      $scope.ZrangCorpBaoQuans = res.data;
      $scope.tool = ToolService;
      $scope.canBeClick = {
        hasCorp:false,
        hasAmount:false
      };//禁用下一步,两个为true才能点击
      $rootScope.DYZBaoQuanArray.corpName = '请选择转入方企业';

      $scope.DZYInput = {amount:''};
      $scope.restSum = $scope.ZrangCorpBaoQuans.sum;//初始化
      //金额输入框
      $scope.DZYIputJugeAmount = function () {
        //$scope.restSum = $scope.ZrangCorpBaoQuans.sum - $scope.DZYInput.amount;
        //输入金额限制
        if($scope.restSum <= $scope.DZYInput.amount){
          //$scope.restSum = 0;
          $scope.DZYInput.amount  = $scope.ZrangCorpBaoQuans.sum;
        };
        if($scope.DZYInput.amount == null || $scope.DZYInput.amount == 0){
          $scope.canBeClick.hasAmount = false;
        }else{
          $scope.canBeClick.hasAmount = true;
        }
      };

      $scope.$on('$ionicView.enter', function () {
        if($rootScope.DYZBaoQuanArray.corpName != '请选择转入方企业'){
          $scope.canBeClick.hasCorp = true;
        }else{
          $scope.canBeClick.hasCorp = false;
        }
      });
      //是否禁用下一步
      $scope.DZYToNextStepBtn = function () {
        if($scope.canBeClick.hasCorp == false || $scope.canBeClick.hasAmount == false){
          $ionicLoading.show({template: "请选择转入企业或输入金额", noBackdrop: true, duration:1000});
        }else{
          $rootScope.DYZBaoQuanArray.sum = $scope.DZYInput.amount;
          $rootScope.jumpto('tab.DZYxuanzebaoquan')
        }
      };
      //全部转出
      //$scope.ZRallMoney = function (){
      //  $scope.DZYInput.amount  = $scope.ZrangCorpBaoQuans.sum;
      //
      //};
    });


  })
  //多转一选择交易对手
  .controller('DZYChooseGYSCtrl', function ($scope,CounterpartyListPartner,$ionicHistory,$rootScope) {
    CounterpartyListPartner.http().then(function (res) {
      $scope.DZYChooseGYS = res.data.list;
      console.log($scope.DZYChooseGYS);
      $scope.DZYChooseGYSBtn = function (custCnNm,custNo) {
        $rootScope.DYZBaoQuanArray.corpName = custCnNm;
        $rootScope.DYZBaoQuanArray.custNo = custNo;
        $ionicHistory.goBack(-1);
      }
    });
  })
  .controller('DZYAddJiaoYiDuiShouCtrl', function ($scope, CounterpartyListAddPartner,SearchPartnerCorpName,$ionicLoading) {
      $scope.searchCorpName = {value : ''};
      $scope.AddPartnerBtn = function (custNo) {

        var promise = CounterpartyListAddPartner.http(custNo);
        promise.then(function (res) {
          console.log(res);
          if(res.code === '170013'){
            $ionicLoading.show({template: "您已添加了该交易对手，请勿重复添加", noBackdrop: true, duration: 1000});
            return;
          }
          if(res.code === '000000'){
            $ionicLoading.show({template: "添加成功", noBackdrop: true, duration: 1000});
            $scope.searchCorpName.value = '';
            $scope.corpLists = [];
          }
        })
      };
      //输入时发送
      $scope.searchCorp = function () {
        $scope.corpLists = [];
        console.log($scope.searchCorpName.value);
        if($scope.searchCorpName.value != ''){
          var qCustCnNm = $scope.searchCorpName.value;
          SearchPartnerCorpName.http(qCustCnNm).then(function (res) {
            console.log(res.data.list);
            $scope.corpLists = res.data.list;
          })
        }

      };


  })
  //多转一选择宝券
  .controller('DZYBaoQuanDetail', function ($scope, DZYChoosebaoquanDetail,ToolService,ZrangCorpBaoQuan,$rootScope,$ionicLoading,ZrangDZYCorpBaoQuanHasCondition,ZrangDZYCorpBaoQuanHasNoCondition) {
    var hasNoConditionHttp = ZrangDZYCorpBaoQuanHasNoCondition;
    var hasConditionHttp = ZrangDZYCorpBaoQuanHasCondition;
    //初次加载不传condition,点击时间、金额排序之后发送带condition的请求
    var HttpDZYchooseBaoQuan = function (isHasCondition,condition) {
      isHasCondition.http(condition).then(function (res) {
      //$scope.DZYdetails = DZYChoosebaoquanDetail.all();

      $scope.DZYdetails = res.data.lists.list;
      $scope.DZYdetailsSum = res.data.sum;
      console.log(res.data);
        //根据金额大小，不同显示
      $scope.zero = '0';
      $scope.parseInt = parseInt;
      //转化时间格式
      $scope.cjs = ToolService;

      //init，记录被选中的checkbox
      $scope.ischecked = {};
      //自定义属性记录是否被选的金额
        var MoRenCheckSum = 0;
      for (var i = 0; i < $scope.DZYdetails.length; i++) {
        $scope.DZYdetails[i].flag = false;
        //初始化数据，使每个$scope.ischecked[index]都记录当前是否被选择
        $scope.ischecked[i] = $scope.DZYdetails[i].flag;
        //默认选中
        if($rootScope.DYZBaoQuanArray.sum > MoRenCheckSum){

          $scope.ischecked[i] = !$scope.ischecked[i];
          $scope.DZYdetails[i].flag = true;
          MoRenCheckSum += $scope.DZYdetails[i].isseAmt;
        }
      }
        $scope.TotalIsseAmt = Math.round(MoRenCheckSum / 10000);
      var TotalIsseAmt//已选金额
      //点击时改变flag状态
      $scope.ischeckedBtn = function ($index) {
        TotalIsseAmt = 0;
        //判断哪个被点中
        $scope.DZYdetails[$index].flag = !$scope.DZYdetails[$index].flag;
        $scope.ischecked[$index] = $scope.DZYdetails[$index].flag;
        var isCheckNum = 0;
        for (var i = 0; i < $scope.DZYdetails.length; i++) {
          if(!$scope.DZYdetails[i].flag){//如果有一个没有被选
            $scope.allCheck = false;

          }else if($scope.DZYdetails[i].flag){//计数比较
            isCheckNum++;
            TotalIsseAmt += $scope.DZYdetails[i].isseAmt;
          }
        }
        if(isCheckNum == $scope.DZYdetails.length){//如果全部都被选
          $scope.allCheck = true;
        }else{
          $scope.allCheck = false;
        }
        $scope.TotalIsseAmt = Math.round(TotalIsseAmt / 10000);
      };
      //定义全选框
      $scope.allCheck = false;
      //全选选择框点击
      $scope.DZYchose = function () {

        $scope.allCheck = !$scope.allCheck;
        if($scope.allCheck == true){
          $scope.DZYdetails.forEach(function (arr,i) {
            arr.flag = true;
            for(var k in $scope.ischecked){
              $scope.ischecked[k] = arr.flag;
            }
          });
          //全选金额为sum
          $scope.TotalIsseAmt = Math.round($scope.DZYdetailsSum / 10000);
        }else if($scope.allCheck == false){
          $scope.DZYdetails.forEach(function (arr,i) {
            arr.flag = false;
            for(var k in $scope.ischecked){
              $scope.ischecked[k] = arr.flag;
            }
          });
          //不全选金额为0
          $scope.TotalIsseAmt = 0;
        }
      };
      //点击 选好了 判断哪个被选中
      $scope.canBeClick = false;//可否点击
      $scope.ChoseGYSBtn = function () {
        var array = [];//放 被选中的集合
        for (var i in $scope.ischecked) {
          if($scope.ischecked[i]){
            var obj = {};
            obj.id = $scope.DZYdetails[i].id;
            obj.isseAmt = $scope.DZYdetails[i].isseAmt;
            obj.dueDays = $scope.DZYdetails[i].dueDays;
            obj.drftNo = $scope.DZYdetails[i].drftNo;
            array.push(obj);
          };
        };
        $rootScope.DYZBaoQuanArray.list = array;
        if(array.length == 0){
          $ionicLoading.show({template: "请选择宝券", noBackdrop: true, duration:1000});
          return;
        }
        $rootScope.jumpto('tab.DZYlaststep');
      };
    })
    };
    var condition = false;//正倒序
    HttpDZYchooseBaoQuan(hasNoConditionHttp,condition);
    //时间、金额排序
    $scope.timeIconIsRotate = false;
    $scope.acountIconIsRotate = false;
    $scope.timeSort = function () {
      var count;
      condition  = !condition;
      if(condition){
        count = '01';
      }else{
        count = '02'
      }
      HttpDZYchooseBaoQuan(hasConditionHttp,count);
      //图标旋转
      $scope.timeIconIsRotate = !$scope.timeIconIsRotate;
    };
    $scope.acountSort = function () {
      var acou;
      condition  = !condition;
      if(condition){
        acou = '03';
      }else{
        acou = '04'
      }
      HttpDZYchooseBaoQuan(hasConditionHttp,acou);
      //图标旋转
      $scope.acountIconIsRotate = !$scope.acountIconIsRotate;
    };
  })
  //多转一转让申请
  .controller('DZYyanzhengCtrl', function($scope,$ionicPopup,$state,ToolService,$rootScope,$ionicLoading,DZYToApply,$interval,getSmsCode) {
    $scope.tool = ToolService;
    var data = $rootScope.DYZBaoQuanArray.list ;
    $scope.DZYcoin = 0;//金币
    $scope.DZYtotalSum = 0;//合计
    $scope.acc = 0.0435;//利率
    $scope.DZYcounts = {};//加减距到期日
    $scope.DZYsum = {};//输入金额

    var MaxDueDt = $rootScope.MaxDueDt;
    var jugeTotalSum = 0;
    //数据初始化
    for (var i = 0; i < data.length; i++) {
      $scope.DZYcounts[i] = 0;
      $scope.DZYsum[i] = data[i].isseAmt;
      $scope.DZYtotalSum += data[i].isseAmt;
      jugeTotalSum += data[i].isseAmt;
    };

    //输入金额
    $scope.JugeDZYsum = function ($index) {
      //合计金额最大为宝券金额之和
      $scope.DZYtotalSum = 0;
      for (var i = 0; i < data.length; i++) {
        $scope.DZYtotalSum += $scope.DZYsum[i];
      };
      if($scope.DZYtotalSum > jugeTotalSum){
        $scope.DZYtotalSum = jugeTotalSum;
      };
      if($scope.DZYsum[$index] > data[$index].isseAmt){
        $ionicLoading.show({template: "金额超过限制", noBackdrop: true, duration: 1000});
        $scope.DZYsum[$index] = data[$index].isseAmt;
      };
      if($scope.DZYsum[$index] < 0){
        $ionicLoading.show({template: "金额不能为负", noBackdrop: true, duration: 1000});
        $scope.DZYsum[$index] = 0;
      };
    };
    //减
    $scope.minusBtn = function ($index) {
      $scope.DZYcounts[$index]--;
      if($scope.DZYcounts[$index] < 0){
        $scope.DZYcounts[$index] = 0;
      }
    };
    //加
    $scope.addBtn = function ($index) {
      $scope.DZYcounts[$index]++;
      if($scope.DZYcounts[$index] > MaxDueDt){
        $scope.DZYcounts[$index] = MaxDueDt;
      }
    };
    //输入距到期日
    $scope.DZYKeyUp = function ($index) {
      if ($scope.DZYcounts[$index] > MaxDueDt) {
        $ionicLoading.show({template: "距到期日超过限制", noBackdrop: true, duration: 1000});
        $scope.DZYcounts[$index] = MaxDueDt;
        return;
      } else {
        $scope.DZYcounts[$index] = $scope.DZYcounts[$index];
      };
    };

    //点击提交
    $scope.DZYyanzhengBtn = function(){
      if($scope.DYZBaoQuanArray.sum != $scope.DZYtotalSum){
        $ionicLoading.show({template: "合计金额与转让金额必须要相等", noBackdrop: true, duration: 1000});
        return;
      }
      for (var i = 0; i < data.length; i++) {
        if($scope.DZYsum[i] == 0 || $scope.DZYsum[i] == '' || $scope.DZYsum[i] == null){
          $ionicLoading.show({template: "转让金额不能为零", noBackdrop: true, duration:1000});
          return;
        };
        if($scope.DZYcounts[i] != parseInt($scope.DZYcounts[i])){
          $ionicLoading.show({template: "距到期日必须为整数", noBackdrop: true, duration:1000});
          return;
        }
      }

      var popUp3=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-YZY-ZYD-DYY.html',
        scope:$scope
      });
      $scope.getMsgcode = function () {
        //防止多次点击
        if($rootScope.getMessageInfo != '发送验证码'){
          return;
        }else{
          //发送验证码
          var promise = getSmsCode.getsmscode("ZR01");
          $rootScope.getMessageInfo = 60;
          $rootScope.cint = $interval(function(){
            $rootScope.getMessageInfo--;
            if($rootScope.getMessageInfo <= 0){
              $interval.cancel($rootScope.cint);
              $rootScope.getMessageInfo = "发送验证码";
            };
          },1000);
          //获取的验证码校验逻辑--------------------未写
        }
      };
      $scope.msCode = {num:''};
      $scope.makesure=function(){
        //点击发送转让申请
        var ZRApplyList = [];
        var smsCode = $scope.msCode.num;//验证码
        for (var i = 0; i < data.length; i++) {
          var ZRApplyParams = {};
          ZRApplyParams.id = data[i].id;//id
          ZRApplyParams.rcvCustNo = $rootScope.DYZBaoQuanArray.custNo;//企业号号custNo
          ZRApplyParams.rcvCustNm = $rootScope.DYZBaoQuanArray.corpName;//企业名custCnNm
          ZRApplyParams.isDelay = $scope.DZYcounts[i] == 0 ? '0' : '1' ;//是否延期
          ZRApplyParams.delayDays = data[i].dueDays * 1 + $scope.DZYcounts[i];//延期天数
          ZRApplyParams.bouns = $scope.DZYsum[i] * $scope.DZYcounts[i] * $scope.acc / 360 ;//金币收益
          ZRApplyParams.drftNo = data[i].drftNo;//票据号码
          ZRApplyParams.dueDays = data[i].dueDays;//距到期日
          ZRApplyParams.isseAmt = $scope.DZYsum[i];//转让金额
          ZRApplyList.push(ZRApplyParams);
        }
        console.log(ZRApplyList);
        DZYToApply.http(ZRApplyList,smsCode).then(function (res) {
          console.log(res);
          if(res.code === '000000'){
            popUp3.close();
            $state.go('tab.DZYIsSuccess',{isseAmt:$scope.DZYtotalSum});
          }
          else if(res.code === '180029'){
            $ionicLoading.show({template: "操作失败，宝券可用金额少于交易金额", noBackdrop: true, duration:1000});
            popUp3.close();
          }
          else{
            $ionicLoading.show({template: "操作失败", noBackdrop: true, duration:1000});
            popUp3.close();
          }

        }).catch(function (err) {
          console.log(err);

        })
      };
      //取消
      $scope.giveout = function () {
        popUp3.close();
      }
    };
  })
  //多转一成功
  .controller('DZYIsSuccessCtrl', function ($scope, $state,$ionicHistory,$stateParams,ToolService) {
    $scope.isseAmt = $stateParams.isseAmt;
    $scope.tool = ToolService;
    $scope.backFrom = function () {
      $ionicHistory.clearHistory();
      $state.go('tab.zhuanrang');
    }
  })

  //建议历史
  .controller('AdviceHistoryCtrl', function ($scope) {

  })
  //一转多
  .controller('YiZhuanDuoCtrl', function ($scope,ZrangCorpBaoQuan,ToolService,$rootScope) {
    var condition = false;
    $scope.timeIconIsRotate = false;
    var HttpYZYZchooseBaoQuan = function (condition) {
    ZrangCorpBaoQuan.http(condition).then(function (res) {
      $scope.ZrangCorpBaoQuans = res.data.lists.list;
      $scope.parseInt = parseInt;
      $scope.tool = ToolService ;
      $scope.sum = res.data.sum;//总金额
      console.log(res.data);
      $scope.ToNextStep = function (id) {
        $rootScope.jumpto('tab.YZDFirstStep',{id:id})
      }
    })
    };
    HttpYZYZchooseBaoQuan(condition);
    $scope.timeSort = function () {
      condition = !condition;
      if(condition){
        condition = '01';
      }else{
        condition = '02'
      }
      $scope.timeIconIsRotate = !$scope.timeIconIsRotate;
      HttpYZYZchooseBaoQuan(condition);
    }
    $scope.accountSort = function () {
      condition = !condition;
      if(condition){
        condition = '03';
      }else{
        condition = '04'
      }
      $scope.acountIconIsRotate = !$scope.acountIconIsRotate;
      HttpYZYZchooseBaoQuan(condition);
    }
  })
  //一转多详情及选择供应商
  .controller('YZDFirstStepCtrl',function($scope,$stateParams,BQDetail,ToolService,$rootScope,$ionicHistory,$ionicLoading){
    BQDetail.http($stateParams.id).then(function(res){
      $scope.BQDetails = res.data;
      $scope.tool = ToolService;
      $scope.$on('$ionicView.enter', function () {
        //下一步是否禁用
        $scope.canBeClick = true;
        //不禁用下一步
        if($rootScope.YZDGYSArray != undefined && $rootScope.YZDGYSArray.length != 0){
          $scope.canBeClick = false;
        }
        //移除供应商
        $scope.removeGYSBtn = function ($index) {
          $rootScope.YZDGYSArray.splice($index,1);
          if($rootScope.YZDGYSArray.length == 0){
            $scope.canBeClick = true;
          }
        }
        //下一步
          $scope.JumpToLastStep = function () {
            if($scope.canBeClick == true){
              $ionicLoading.show({template: "请选择供应商", noBackdrop: true, duration:1000});
            }else{
              $rootScope.jumpto('tab.YZDLastStep', {id: $stateParams.id});
            }
          }
      })
    })

  })
  //一转多选择供应商
  .controller('YZDChoosegysCtrl',function($scope,MineJiaoYiDuiShou,$ionicHistory,$rootScope){
    MineJiaoYiDuiShou.http().then(function(res){
      $scope.MineJiaoYiDuiShous = res.data.list;
      console.log($rootScope.YZDGYSArray);
      //初始化：在返回的数据添加flag属性
      $scope.ischecked = {} ;
      $scope.MineJiaoYiDuiShous.forEach(function (arr, i) {
        arr.flag = false;
        $scope.ischecked[i] = false;
      })

      //判断之前是否已选供应商，并将checkbox选中
      $scope.$on('$ionicView.enter', function () {
        if($rootScope.YZDGYSArray != undefined && $rootScope.YZDGYSArray.length != 0){
          $rootScope.YZDGYSArray.forEach(function (arr, i) {
            for (var k = 0; k < $scope.MineJiaoYiDuiShous.length; k++) {
              if(arr.custCnNm == $scope.MineJiaoYiDuiShous[k].custCnNm){
                $scope.ischecked[k] = !$scope.ischecked[k];
              }
            }
          })

        }
      })
      //记录被点击
      $scope.clickCheck = function ($index) {
          $scope.MineJiaoYiDuiShous[$index].flag = !$scope.MineJiaoYiDuiShous[$index].flag;
          $scope.ischecked[$index] = !$scope.ischecked[$index];

      }
      //确认按钮
      $scope.YZDChooseGYSBtn = function () {
        $rootScope.YZDGYSArray = [];//存放被选中的
        //取出被点击的
        for (var i = 0; i < $scope.MineJiaoYiDuiShous.length; i++) {
          if($scope.ischecked[i] == true){
            var obj = {};
            obj.custCnNm = $scope.MineJiaoYiDuiShous[i].custCnNm;
            obj.custNo = $scope.MineJiaoYiDuiShous[i].custNo;
            $rootScope.YZDGYSArray.push(obj);
          }
        }
        $ionicHistory.goBack(-1);
      };
    });
  })
  .controller('YZDAddJiaoYiDuiShouCtrl', function ($scope, CounterpartyListAddPartner,SearchPartnerCorpName,$ionicLoading) {
      $scope.searchCorpName = {value : ''};
      $scope.AddPartnerBtn = function (custNo) {

        var promise = CounterpartyListAddPartner.http(custNo);
        promise.then(function (res) {
          console.log(res);
          if(res.code === '170013'){
            $ionicLoading.show({template: "您已添加了该交易对手，请勿重复添加", noBackdrop: true, duration: 1000});
            return;
          }
          if(res.code === '000000'){
            $ionicLoading.show({template: "添加成功", noBackdrop: true, duration: 1000});
            $scope.searchCorpName.value = '';
            $scope.corpLists = [];
          }
        })
      };
      //输入时发送
      $scope.searchCorp = function () {
        $scope.corpLists = [];
        console.log($scope.searchCorpName.value);
        if($scope.searchCorpName.value != ''){
          var qCustCnNm = $scope.searchCorpName.value;
          SearchPartnerCorpName.http(qCustCnNm).then(function (res) {
            console.log(res.data.list);
            $scope.corpLists = res.data.list;
          })
        }

      };

  })
  //一转多lastStep
  .controller('YZDLastStepCtrl', function($scope,$ionicPopup,$state,$rootScope,ToolService,BQDetail,$stateParams,$ionicLoading,getSmsCode,$interval,YZDToApply,$ionicPopup) {
    $scope.tool = ToolService;
    var oldYZDGYSArray = $rootScope.YZDGYSArray;
    $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
      //判断由来，有变更数据则刷新页面
      if(from.name == 'tab.YZDChoosegys'){
        //原数据与更改后
        //检测供应商数量是增加时
        if(oldYZDGYSArray.length < $rootScope.YZDGYSArray.length) {

          for (var i = 0; i < $rootScope.YZDGYSArray.length - oldYZDGYSArray.length; i++) {
            var obj = {};
            obj.ipt = 0;
            obj.dut = 0;
            $scope.KeepIptVal.push(obj);
          }
          oldYZDGYSArray = $rootScope.YZDGYSArray;
          HttpFunc();
        }else{
          HttpFunc();
        }
        //}else if( oldYZDGYSArray.length == $rootScope.YZDGYSArray.length ){
        //  for (var i = 0; i < $rootScope.YZDGYSArray.length; i++) {
        //    if(oldYZDGYSArray[i].custNo != $rootScope.YZDGYSArray[i].custNo){
        //      HttpFunc();
        //      oldYZDGYSArray = $rootScope.YZDGYSArray;
        //      return;
        //    }
        //  }
        //}
        console.log($scope.KeepIptVal);
      }else if(from.name == 'tab.YZDFirstStep'){
        //保存输入框的值
        $scope.KeepIptVal = [];
        for (var i = 0; i < $rootScope.YZDGYSArray.length; i++) {
          var obj = {};
          obj.ipt = 0;
          obj.dut = 0;
          $scope.KeepIptVal.push(obj);
        }
      }
    });

    //输入框金额
    $scope.sum = {};
    var HttpFunc = function () {
      BQDetail.http($stateParams.id).then(function (res) {
        $scope.BQDetails = res.data;
        $scope.CorpOfGYSLists = $rootScope.YZDGYSArray;
        //自定义属性隔离数量变化
        $scope.counts = {};

        //宝券余额
        var balAcc = 0;
        $scope.rest = {
          isseAmt: ''
        };
        //初始化input的值
        //  if(JSON.stringify($scope.sum) == "{}"){
            for (var i = 0; i < $scope.CorpOfGYSLists.length; i++) {
              $scope.counts[i] = 0;
              $scope.sum[i] = 0;
              if (i == 0) {
                $scope.sum[i] = $scope.BQDetails.isseAmt;
              }
              //第一次初始化---
              //取出保存的值 目的：判断是否
              if($scope.KeepIptVal[i].ipt != 0){

                $scope.sum[i] = $scope.KeepIptVal[i].ipt;
                $scope.counts[i] = $scope.KeepIptVal[i].dut;
              };

              balAcc += $scope.sum[i];

            }
        //初始页面宝券余额计算
        $scope.balance = $scope.BQDetails.isseAmt - balAcc;
        //利率
        $scope.acc = 0.0435;
        //金额输入
        $scope.keyupJuge = function ($index) {
          //小于0限制
          if ($scope.sum[$index] < 0) {
            $scope.sum[$index] = 0;
            return;
          }
          ;
          //宝券余额重新计算
          balAcc = 0;
          for (var i = 0; i < $scope.CorpOfGYSLists.length; i++) {
            balAcc += $scope.sum[i];
          }
          ;
          if ($scope.BQDetails.isseAmt - balAcc >= 0) {
            $scope.balance = $scope.BQDetails.isseAmt - balAcc;
          } else {
            $ionicLoading.show({template: "金额超过限制", noBackdrop: true, duration: 1000});
            var morAcc = 0;
            for (var k = 0; k < $scope.CorpOfGYSLists.length; k++) {
              if (k != $index) {
                morAcc += $scope.sum[k];
              }
            }
            //重新计算
            $scope.sum[$index] = $scope.BQDetails.isseAmt - morAcc;
            //宝券余额
            $scope.balance = 0;
          };
          $scope.KeepIptVal[$index].ipt = $scope.sum[$index];

        };
        //增加、减少
        $scope.minusBtn = function ($index) {
          if ($scope.counts[$index] <= 0) {
            $scope.counts[$index] = 0;
            return
          }
          $scope.counts[$index] = $scope.counts[$index] - 1;
          //存入
          $scope.KeepIptVal[$index].dut = $scope.counts[$index];
        };
        var MaxDueDt = $rootScope.MaxDueDt;
        //增加
        $scope.addBtn = function ($index) {
          if ($scope.counts[$index] >= MaxDueDt) {
            $scope.counts[$index] = MaxDueDt;
            return
          }
          $scope.counts[$index] = $scope.counts[$index] + 1;
          $scope.KeepIptVal[$index].dut = $scope.counts[$index];
        };
        //输入局到期日
        $scope.InputCountKeyUp = function ($index) {
          if ($scope.counts[$index] > MaxDueDt) {
            $ionicLoading.show({template: "距到期日超过限制", noBackdrop: true, duration: 1000});
            $scope.counts[$index] = MaxDueDt;
            return;
          } else {
            $scope.counts[$index] = $scope.counts[$index];
            $scope.KeepIptVal[$index].dut = $scope.counts[$index];
          }
        }
        //更换供应商
        $scope.reSetGYSBtn = function () {
          $rootScope.jumpto('tab.YZDChoosegys');
          //如果没有更换数据，那么不刷新
        };
        //移出供应商
        $scope.removeGYSBtn = function ($index) {
          var ThisGYS = '';
            ThisGYS = $rootScope.YZDGYSArray[$index].custCnNm;
          //弹框确认
          var confirmPopup = $ionicPopup.confirm({
            title: '提示',
            template: "确定删除 " + ThisGYS + " 吗?",
            cancelText: "取消",
            cancelType: "button-gray",
            okText: '确定',
            okType: "button-positive",
          });
          confirmPopup.then(function(res) {
            if(res) {
              //确认
              $rootScope.YZDGYSArray.splice($index,1);
              $scope.KeepIptVal.splice($index,1);
              HttpFunc()
            } else {
              //取消
            }
          });
        };

      });
    };
    HttpFunc();
    $scope.YZDyanzhengBtn = function(){
      console.log($scope.KeepIptVal);
      var isseAmtTotal = 0;
      for (var i = 0; i < $rootScope.YZDGYSArray.length; i++) {
        if($scope.sum[i] == 0 || $scope.sum[i] == '' || $scope.sum[i] == null){
          $ionicLoading.show({template: "转让金额不能为零", noBackdrop: true, duration:1000});
          return;
        };
        if($scope.counts[i] != parseInt($scope.counts[i])){
          $ionicLoading.show({template: "距到期日必须为整数", noBackdrop: true, duration:1000});
          return;
        }
        isseAmtTotal += $scope.sum[i];
      };
        var popUp=$ionicPopup.show({
          cssClass:'my-popup',
          templateUrl:'template/popup-YZY-ZYD-DYY.html',
          scope:$scope
        });
        $scope.getMsgcode = function () {
          //防止多次点击
          if($rootScope.getMessageInfo != '发送验证码'){
            return;
          }else{
            //发送验证码
            var promise = getSmsCode.getsmscode("ZR01");
            $rootScope.getMessageInfo = 60;
            $rootScope.cint = $interval(function(){
              $rootScope.getMessageInfo--;
              if($rootScope.getMessageInfo <= 0){
                $interval.cancel($rootScope.cint);
                $rootScope.getMessageInfo = "发送验证码";
              };
            },1000);
            //获取的验证码校验逻辑--------------------未写
          }
        };

        //确定
      $scope.msCode = {num:''};//放验证码
      $scope.makesure=function(){
          //点击发送转让申请
        var ZRApplyList = [];
        var smsCode = $scope.msCode.num;//验证码
        for (var i = 0; i < $rootScope.YZDGYSArray.length; i++) {
          var ZRApplyParams = {};
          ZRApplyParams.id = $stateParams.id;//id
          ZRApplyParams.rcvCustNo = $rootScope.YZDGYSArray[i].custNo;//企业号号custNo
          ZRApplyParams.rcvCustNm = $rootScope.YZDGYSArray[i].custCnNm;//企业名custCnNm
          ZRApplyParams.isDelay = $scope.counts[i] == 0 ? '0' : '1' ;//是否延期
          ZRApplyParams.delayDays = $scope.BQDetails.dueDays * 1 + $scope.counts[i];//延期天数
          ZRApplyParams.bouns = $scope.sum[i] * $scope.counts[i] * $scope.acc / 360 ;//金币收益
          ZRApplyParams.drftNo = $scope.BQDetails.drftNo;//票据号码
          ZRApplyParams.dueDays = $scope.BQDetails.dueDays;//距到期日
          ZRApplyParams.isseAmt = $scope.sum[i];//转让金额
          ZRApplyList.push(ZRApplyParams);
        }

        var promise = YZDToApply.http(ZRApplyList,smsCode);
          promise.then(function (res) {
            console.log(res);
            //清除定时器恢复原样
            if($rootScope.cint){
              $interval.cancel($rootScope.cint);
              $rootScope.getMessageInfo = '发送验证码';
            };
            $scope.counts = {
              count:0
            };//归零
            $scope.sum = {
              res:''
            };//还原
            popUp.close();
            $rootScope.jumpto('tab.YZYIsSuccess',{isseAmt:isseAmtTotal});
          })
        };
        //取消
        $scope.giveout = function () {
          if($rootScope.cint){
            $interval.cancel($rootScope.cint);
            $rootScope.getMessageInfo = '发送验证码';
          }
          popUp.close();
        }

    }
  })
  //一转多成功页面
  .controller('YZDIsSuccessCtrl', function ($scope, $state,$ionicHistory) {
    $scope.backFrom = function () {
      $ionicHistory.clearHistory();
      $state.go('tab.zhuanrang');
    }
  })
;

