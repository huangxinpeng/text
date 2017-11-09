/**
 * Created by haibo on 2017/8/12.
 */
/* 融资版块控制 */
angular.module('zxscf.controllers.rongzi', [])
  .controller('RongziCtrl', function ($scope, DisctDrftList, ToolService, $rootScope, $ionicLoading, $ionicPopup, rongzixuanzegongyingshang) {
    //眼睛控制
    $scope.isOpen = true;
    $scope.eyeCtrl = function () {
      $scope.isOpen = !$scope.isOpen;
    };

    //$scope.rongzixuanzegongyingshangs = rongzixuanzegongyingshang.all();

    $scope.httpSuccessShow = false;
    $scope.tool = ToolService;
    $scope.$on('$ionicView.enter', function () {
      var promise = DisctDrftList.http(1);
      promise.then(function (res) {
        $scope.httpSuccessShow = true;//请求成功显示
        $scope.rzdisctList = res.data;
        var RongZiList = $scope.rzdisctList.lists.list;
        $scope.RongZiLists = RongZiList;
        //init，记录被选中的checkbox
        $scope.ischecked = {};
        //自定义属性记录是否被选
        for (var i = 0; i < RongZiList.length; i++) {
          RongZiList[i].flag = false;
          //初始化数据，使每个$scope.ischecked[index]都记录当前是否被选择
          $scope.ischecked[i] = RongZiList[i].flag;
        }
        var TotalIsseAmt//已选金额
        //点击时改变flag状态
        $scope.ischeckedBtn = function ($index) {
          TotalIsseAmt = 0;
          //判断哪个被点中
          RongZiList[$index].flag = !RongZiList[$index].flag;
          $scope.ischecked[$index] = RongZiList[$index].flag;
          var isCheckNum = 0;
          for (var i = 0; i < RongZiList.length; i++) {
            if (!RongZiList[i].flag) {//如果有一个没有被选
              $scope.allCheck = false;

            } else if (RongZiList[i].flag) {//计数比较
              isCheckNum++;
              TotalIsseAmt += RongZiList[i].isseAmt;
            }
          }
          if (isCheckNum == RongZiList.length) {//如果全部都被选
            $scope.allCheck = true;
          } else {
            $scope.allCheck = false;
          }
          $scope.TotalIsseAmt = $scope.tool.formMoney(TotalIsseAmt);
        }
        ;
        //定义全选框
        $scope.allCheck = false;
        //全选选择框点击
        $scope.RongZiallCheckBtn = function () {
          $scope.allCheck = !$scope.allCheck;
          if ($scope.allCheck == true) {
            RongZiList.forEach(function (arr, i) {
              arr.flag = true;
              for (var k in $scope.ischecked) {
                $scope.ischecked[k] = arr.flag;
              }
            });
            //全选金额为sum
            $scope.TotalIsseAmt = $scope.tool.formMoney($scope.rzdisctList.sum);
          } else if ($scope.allCheck == false) {
            RongZiList.forEach(function (arr, i) {
              arr.flag = false;
              for (var k in $scope.ischecked) {
                $scope.ischecked[k] = arr.flag;
              }
            });
            //不全选金额为0
            $scope.TotalIsseAmt = 0;
          }
        };
        $rootScope.RongZiCheckInfoLists = {};//页面回到融资，数据不保留
        $scope.RongZiHasChosenBtn = function () {
          var array = [];//放 被选中的集合
          for (var i = 0; i < RongZiList.length; i++) {
            if (RongZiList[i].flag) {
              var obj = {};
              obj.id = RongZiList[i].id;
              obj.isseAmt = RongZiList[i].isseAmt;
              obj.drftNo = RongZiList[i].drftNo;
              obj.dueDays = RongZiList[i].dueDays;
              obj.dueDt = RongZiList[i].dueDt;
              obj.freezAmt = RongZiList[i].freezAmt;

              array.push(obj);
            }
            ;
          }
          ;
          $rootScope.RongZiCheckInfoLists.TotalIsseAmt = $scope.TotalIsseAmt;
          $rootScope.RongZiCheckInfoLists.list = array;
          if (array.length == 0) {
            $ionicLoading.show({template: "请选择宝券", noBackdrop: true, duration: 1000});
            return;
          }
          $rootScope.jumpto('tab.baoquanBianJi');
        }
      })
        .catch(function () {
          $scope.httpSuccessShow = false;//请求失败隐藏
        });
    });


  })
  //融资宝券选择-->nextStep
  .controller('BaoQuanBianJiCtrl', function ($scope, $rootScope, ToolService, MineCoin, $ionicLoading, $state) {
    $scope.bankName = '请选择收款账号';
    //获取金币
    MineCoin.http().then(function (res) {
      console.log(res);
      $scope.coin = res.data.validBonus;//金币
      $scope.mineCoin = {coin: 0};//页面model
      $scope.tool = ToolService;
      $scope.baoquanInfoLists = $rootScope.RongZiCheckInfoLists.list;
      $scope.TotalIsseAmt = $rootScope.RongZiCheckInfoLists.TotalIsseAmt;//可融资金额
      var yearRate = 0.053;//年利率
      var DisInt = 0.95;//优惠后利息率
      $scope.initMoney = {};//宝券输入金额
      var AntiInterestPayable = 0;//预计应付利息
      $scope.RealInterestPayable = 0;//预计实付利息
      $scope.PreferentialInterest = 0;//优惠后利息
      for (var i = 0; i < $scope.baoquanInfoLists.length; i++) {
        $scope.initMoney[i] = $scope.baoquanInfoLists[i].isseAmt;
        //预计应付利息
        AntiInterestPayable += $scope.baoquanInfoLists[i].isseAmt * yearRate * $scope.baoquanInfoLists[i].dueDays / 360;
      }
      $scope.AntiInterestPayable = AntiInterestPayable;//预计应付利息
      $scope.PreferentialInterest = AntiInterestPayable * DisInt;//优惠后利息
      //判断金币是否大于优惠后利息
      if ($scope.coin <= $scope.PreferentialInterest) {
        $scope.mineCoin.coin = $scope.coin;//页面model
      }
      if ($scope.coin > $scope.PreferentialInterest) {
        $scope.mineCoin.coin = $scope.PreferentialInterest.toFixed(2) * 1;
      }
      ;
      $scope.RealInterestPayable = $scope.PreferentialInterest - $scope.mineCoin.coin;//预计实付利息

      //金币输入
      // 可用比利息多 输入比利息多的时候，最多为利息
      // 可用比利息少 输入不超过可用
      $scope.InputCoin = function () {
        //金币大于优惠后利息的时候
        if ($scope.coin >= $scope.PreferentialInterest) {
          if ($scope.mineCoin.coin >= $scope.PreferentialInterest) {
            $scope.mineCoin.coin = $scope.PreferentialInterest.toFixed(2) * 1;
            $scope.RealInterestPayable = $scope.PreferentialInterest - $scope.mineCoin.coin > 0 ? $scope.PreferentialInterest - $scope.mineCoin.coin : 0;//预计实付利息
            return;
          } else {
            $scope.RealInterestPayable = $scope.PreferentialInterest - $scope.mineCoin.coin > 0 ? $scope.PreferentialInterest - $scope.mineCoin.coin : 0;//预计实付利息
          }
          //金币小于优惠后利息的时候
        } else {
          if ($scope.mineCoin.coin >= $scope.coin) {
            $scope.mineCoin.coin = $scope.coin;
            $scope.RealInterestPayable = $scope.PreferentialInterest - $scope.mineCoin.coin > 0 ? $scope.PreferentialInterest - $scope.mineCoin.coin : 0;//预计实付利息
            return;
          } else {
            $scope.RealInterestPayable = $scope.PreferentialInterest - $scope.mineCoin.coin > 0 ? $scope.PreferentialInterest - $scope.mineCoin.coin : 0;//预计实付利息
          }
        }
      };
      $scope.textAlignCenter = function () {
        document.querySelector('#InputCoin').style.textAlign = 'center';
      };
      $scope.textAlignRight = function () {
        document.querySelector('#InputCoin').style.textAlign = 'right';
        if ($scope.mineCoin.coin == null) {
          $scope.mineCoin.coin = 0;
        }
        ;
      };

      //已选融资金额输入
      $scope.InputRZMoney = function ($index) {
        if ($scope.initMoney[$index] >= $scope.baoquanInfoLists[$index].isseAmt) {
          $scope.initMoney[$index] = $scope.baoquanInfoLists[$index].isseAmt;
        }
        //输入金额时重新计算
        AntiInterestPayable = 0;
        for (var i = 0; i < $scope.baoquanInfoLists.length; i++) {
          //预计应付利息
          AntiInterestPayable += $scope.initMoney[i] * yearRate * $scope.baoquanInfoLists[i].dueDays / 360;
        }
        ;
        $scope.AntiInterestPayable = AntiInterestPayable;//预计应付利息
        $scope.PreferentialInterest = AntiInterestPayable * DisInt;//优惠后利息
        //优惠后利息 - 金币
        $scope.RealInterestPayable = AntiInterestPayable * DisInt - $scope.mineCoin.coin >= 0 ? AntiInterestPayable * DisInt - $scope.mineCoin.coin : 0;//预计实付利息
      }
      $scope.$on('$stateChangeSuccess', function (event, toState, toParams, from) {
        //判断由来，有变更数据则刷新页面
        if (from.name == 'tab.RZChooseBank') {
          //收款账号
          if ($rootScope.BankInfo.length != 0) {
            $scope.bankName = $rootScope.BankInfo[0].openBrhNm;
          }
          ;
        }
        ;

      });
      $scope.RZToNextBtn = function () {
        $rootScope.RZhttpParams = {};
        //必须选择银行账号
        if ($rootScope.BankInfo == undefined) {
          $ionicLoading.show({template: "请选择银行账号", noBackdrop: true, duration: 1000});
          return;
        }
        ;
        //融资金额不能为零
        var baoquanTotalAsseAmt = 0;//已输入的宝券融资总额
        var calcRes = {};//计算所得应付、实付利息
        var rateData = {};//年利率、优惠利率、抵扣
        var baoquanInfo;
        for (var k in $scope.initMoney) {
          if ($scope.initMoney[k] == 0 || $scope.initMoney[k] == '' || $scope.initMoney[k] == undefined) {
            $ionicLoading.show({template: "融资金额不能为零", noBackdrop: true, duration: 1000});
            return;
          }
          //输入的宝券金额总和
          baoquanTotalAsseAmt += $scope.initMoney[k];
        }
        ;

        calcRes.baoquanTotalAsseAmt = baoquanTotalAsseAmt;
        calcRes.RealInterestPayable = $scope.RealInterestPayable;//实付利息
        calcRes.AntiInterestPayable = $scope.AntiInterestPayable;//应付利息
        //是否抵扣
        $scope.mineCoin.coin == 0 ? rateData.isBouns = '0' : rateData.isBouns = '1';
        rateData.yearRate = yearRate;
        rateData.DisInt = DisInt;
        rateData.coin = $scope.mineCoin.coin;

        baoquanInfo = $rootScope.RongZiCheckInfoLists.list;
        //获取页面输入的宝券金额initMoney
        for (var i = 0; i < baoquanInfo.length; i++) {
          baoquanInfo[i].InputIsseAmt = $scope.initMoney[i];
        };
        //获取数据准备传参
        $rootScope.RZhttpParams.baoquanInfo = baoquanInfo;//已选宝券信息
        $rootScope.RZhttpParams.bankInfo = $rootScope.BankInfo;//已选银行信息
        $rootScope.RZhttpParams.calcRes = calcRes;//计算所得
        $rootScope.RZhttpParams.rateData = rateData;//存放利率及是否抵扣


        console.log($rootScope.RZhttpParams);
        $state.go('tab.rongziLastStep');
      }
    });

  })
  //银行选择
  .controller('RZChooseBankCtrl', function ($scope, RZMineBankList, $rootScope, $ionicHistory) {
    RZMineBankList.http().then(function (res) {
      $scope.BankLists = res.data.list;
      $scope.numberTurn = '';
      console.log($scope.BankLists);
      $scope.bankChooseBtn = function ($index) {
        $rootScope.BankInfo = [];
        $rootScope.BankInfo.push($scope.BankLists[$index]);
        $ionicHistory.goBack(-1);
      }
    })
  })
  //融资中宝券查询
  .controller('RzzhongCtrl', function ($scope, $state, DrftList,getSmsCode,RZDetailCancel, RongziDetailCheHui,$ionicLoading,$interval,ToolService, $ionicPopup, $rootScope) {
    $scope.tool = ToolService;
    $scope.$on('$ionicView.enter', function () {
      var promise = DrftList.getdrflist('1', 10);
      promise.then(function (res) {
        console.log(res);

        $scope.RZzhongList = res.data;
        $scope.swipeLists = res.data.lists.list;
        //左右滑动
        $scope.addTransform = function (idx) {
          if ($scope.swipeLists[idx].txnStat == '11' || $scope.swipeLists[idx].txnStat == '04' || $scope.swipeLists[idx].txnStat == '13') {
            $scope.swipeLists[idx].isswipe = false;
            return;
          }
          $scope.swipeLists[idx].isswipe = true;
        }
        $scope.transformNone = function (idx) {
          $scope.swipeLists[idx].isswipe = false;
        }
        //撤回
        $scope.RZBaiQuanCheHuiBtn = function ($event, id,$index) {
          $event.stopPropagation();
          var cint = '';//短信验证码定时器
          $scope.getmessageinfo = "发送验证码";
          $scope.msCode = {
            value: ''
          }
          var popUp = $ionicPopup.show({
            cssClass: 'my-popup',
            templateUrl: 'template/popup-rongzi-chehui.html',
            scope: $scope
          });
          //获取验证码
          $scope.getCodeBtn = function () {
            //防止多次点击
            if ($scope.getmessageinfo != '发送验证码') {
              return;
            } else {
              //发送验证码
              var promiseGetCode = getSmsCode.getsmscode("RZ10");
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
            console.log(id, $scope.msCode.value);
            var promiseChehui = RongziDetailCheHui.http(id, $scope.msCode.value);
            promiseChehui.then(function (res) {
              console.log(res);
              if (res.code === '000000') {
                $ionicLoading.show({template: "操作成功", noBackdrop: true, duration: 1000});
                popUp.close();
                $scope.swipeLists[$index].isswipe = false;//恢复

              }else{
                $ionicLoading.show({template: "操作失败", noBackdrop: true, duration: 1000});
                $scope.swipeLists[$index].isswipe = false;//恢复
              }
            })
          };
          //取消
          $scope.giveout = function () {
            if (cint) {
              $interval.cancel(cint);
              $scope.getmessageinfo = '发送验证码';
            }
            $scope.swipeLists[$index].isswipe = false;//恢复
            popUp.close();
          };
        };
        //取消
        $scope.RZBaiQuanCancelBtn = function ($event, id, $index) {
          var cint = '';//短信验证码定时器
          $scope.getMessageInfo = "发送验证码";
          $scope.msCode = {
            num: ''
          };
          //阻止冒泡
          $event.stopPropagation();
          var popUp = $ionicPopup.show({
            cssClass: 'my-popup',
            templateUrl: 'template/popup-rongzi-daifuhe.html',
            scope: $scope
          });

          $scope.getMsgcode = function () {
            //防止多次点击
            if ($scope.getMessageInfo != '发送验证码') {
              return;
            } else {
              //发送验证码
              getSmsCode.getsmscode("RZ09").then(function (res) {
                console.log(res);
              }).catch(function (err) {
                console.log(err);
              })
              $scope.getMessageInfo = 60;
              cint = $interval(function () {
                $scope.getMessageInfo--;
                if ($scope.getMessageInfo <= 0) {
                  $interval.cancel(cint);
                  $scope.getMessageInfo = "发送验证码";
                }
                ;
              }, 1000);
              //获取的验证码校验逻辑--------------------
            }
          }

          $scope.makesure = function () {
            $scope.RZbussDetails = {};
            $scope.RZbussDetails.srcDrftNo = $scope.swipeLists[$index].srcDrftNo;
            $scope.RZbussDetails.disctAmt = $scope.swipeLists[$index].disctAmt;

            if (cint) {
              $interval.cancel(cint);
              $scope.getMessageInfo = '发送验证码';
            }
            var msCode = $scope.msCode.num;
            popUp.close();
            var popUpAgain = $ionicPopup.show({
              cssClass: 'my-popup',
              templateUrl: 'template/popup-rongzi-daifuhe-makesure.html',
              scope: $scope
            });
            //真的确定
            $scope.againMakesure = function () {
              RZDetailCancel.http(id, msCode).then(function (res) {
                console.log(res);
                //tab.chehuiSuccess
                if(res.code === '000000'){
                  $rootScope.jumpto('tab.chehuiSuccess', {
                    txnStat: $scope.swipeLists[$index].txnStat,
                    appNo: $scope.swipeLists[$index].appNo,
                    disctAmt: $scope.swipeLists[$index].disctAmt
                  });
                  popUpAgain.close();
                }else{
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration: 1000});

                }

              })
            };
            //取消
            $scope.againGiveout = function () {
              popUpAgain.close();
              $scope.swipeLists[$index].isswipe = false;//恢复

            }

          }
          //取消
          $scope.giveout = function () {
            if (cint) {
              $interval.cancel(cint);
              $scope.getMessageInfo = '发送验证码';
            }
            popUp.close();
            $scope.swipeLists[$index].isswipe = false;//恢复

          }
        };
        //详情
        $scope.RZDetailBtn = function (id, $index) {
          if ($scope.swipeLists[$index].txnStat == '11') {
            $rootScope.jumpto('tab.baoquanShouLiZhong', {id: id});
          } else {
            $rootScope.jumpto('tab.baoquanDaiFuHe', {id: id});
          }
        }

      })
    })
  })
  //融资历史查询
  .controller('RzhistoryCtrl', function ($scope, $state, DisctHisList, ToolService) {
    $scope.cjs = ToolService;
    $scope.$on('$ionicView.enter', function () {
      var promise = DisctHisList.discthislist(1);
      promise.then(
        function (res) {
          console.log(res);
          $scope.Rzhistory = res.data;
        }
      ).catch()
    })
  })
  //融资历史明细 详情消息查询
  .controller('RongziMessageCtrl', function ($scope, $state, $stateParams, QueryDisctDetail,$rootScope) {
    var getmsgID = $stateParams.pid;
    console.log(getmsgID);
    var promise = QueryDisctDetail.gettxnapprdetail(getmsgID);
    promise.then(function (res) {
        console.log(res);
        if (res.code == '000000') {
          $scope.rzhisList = res.data;

          //协议、凭证、通知书
          var appNo = $scope.rzhisList.appNo;
          var bussType = '30';
          var tnCode = '2';
          var FileDownload = $rootScope.FileDownload;
          $scope.RZXieYiFileload = function () {
            var fileType = 'MB07';
            console.log(appNo, bussType, fileType, tnCode);
            FileDownload(appNo,bussType,fileType,tnCode);
          };
          $scope.RZPingZhengFileload = function () {
            //var fileType = 'MB11';
            //console.log(appNo, bussType, fileType, tnCode);
            //FileDownload(appNo,bussType,fileType,tnCode);
            $state.go('tab.rongziPingZheng')
          };
          $scope.RZZrangFileload = function () {
            var fileType = 'MB08';
            console.log(appNo, bussType, fileType, tnCode);
            FileDownload(appNo,bussType,fileType,tnCode);
          };
        }
      })
  })
  //融资业务详情（进度条）
  .controller('BussDetailProgressCtrl', function ($scope, RZbusinessDetail, $stateParams) {
    RZbusinessDetail.http($stateParams.id).then(function (res) {
      console.log(res);
    })
  })
  //融资业务详情
  .controller('BaoQuanDaiFuHeCtrl', function ($scope, $ionicPopup, $stateParams, RZbusinessDetail, ToolService, getSmsCode, $interval, RZDetailCheHui, RZDetailCancel, $rootScope) {

    RZbusinessDetail.http($stateParams.id).then(function (res) {
      console.log(res);
      $scope.tool = ToolService;
      $scope.RZbussDetails = res.data;
      console.log($scope.RZbussDetails);
    })
    var cint = '';//短信验证码定时器
    $scope.getMessageInfo = "发送验证码";
    $scope.msCode = {
      num: ''
    };
    //确认签收
    $scope.RZchehuiBtn = function () {
      var popUp = $ionicPopup.show({
        cssClass: 'my-popup',
        templateUrl: 'template/popup-rongzi-daifuhe.html',
        scope: $scope
      });

      $scope.getMsgcode = function () {
        //防止多次点击
        if ($scope.getMessageInfo != '发送验证码') {
          return;
        } else {
          //发送验证码
          getSmsCode.getsmscode("RZ10").then(function (res) {
            console.log(res);
          }).catch(function (err) {
            console.log(err);
          })
          $scope.getMessageInfo = 60;
          cint = $interval(function () {
            $scope.getMessageInfo--;
            if ($scope.getMessageInfo <= 0) {
              $interval.cancel(cint);
              $scope.getMessageInfo = "发送验证码";
            }
            ;
          }, 1000);
          //获取的验证码校验逻辑--------------------
        }
      }

      $scope.makesure = function () {
        if (cint) {
          $interval.cancel(cint);
          $scope.getMessageInfo = '发送验证码';
        }
        var msCode = $scope.msCode.num;
        popUp.close();
        var popUpAgain = $ionicPopup.show({
          cssClass: 'my-popup',
          templateUrl: 'template/popup-rongzi-daifuhe-makesure.html',
          scope: $scope
        });
        //真的确定
        $scope.againMakesure = function () {
          RZDetailCheHui.http($stateParams.id, msCode).then(function (res) {
            console.log(res);
            //tab.chehuiSuccess
            $rootScope.jumpto('tab.chehuiSuccess', {
              txnStat: $scope.RZbussDetails.txnStat,
              srcDrftNo: $scope.RZbussDetails.srcDrftNo,
              disctAmt: $scope.RZbussDetails.disctAmt
            });
            popUpAgain.close();
          })
        };
        //取消
        $scope.againGiveout = function () {
          popUpAgain.close();
        }

      }
      //取消
      $scope.giveout = function () {
        if (cint) {
          $interval.cancel(cint);
          $scope.getMessageInfo = '发送验证码';
        }
        popUp.close();
      }
    };
    $scope.RZcancelBtn = function () {
      var popUp = $ionicPopup.show({
        cssClass: 'my-popup',
        templateUrl: 'template/popup-rongzi-daifuhe.html',
        scope: $scope
      });

      $scope.getMsgcode = function () {
        //防止多次点击
        if ($scope.getMessageInfo != '发送验证码') {
          return;
        } else {
          //发送验证码
          getSmsCode.getsmscode("RZ09").then(function (res) {
            console.log(res);
          }).catch(function (err) {
            console.log(err);
          })
          $scope.getMessageInfo = 60;
          cint = $interval(function () {
            $scope.getMessageInfo--;
            if ($scope.getMessageInfo <= 0) {
              $interval.cancel(cint);
              $scope.getMessageInfo = "发送验证码";
            }
            ;
          }, 1000);
          //获取的验证码校验逻辑--------------------
        }
      }

      $scope.makesure = function () {
        if (cint) {
          $interval.cancel(cint);
          $scope.getMessageInfo = '发送验证码';
        }
        var msCode = $scope.msCode.num;
        popUp.close();
        var popUpAgain = $ionicPopup.show({
          cssClass: 'my-popup',
          templateUrl: 'template/popup-rongzi-daifuhe-makesure.html',
          scope: $scope
        });
        //真的确定
        $scope.againMakesure = function () {
          RZDetailCancel.http($stateParams.id, msCode).then(function (res) {
            console.log(res);
            //tab.chehuiSuccess
            if(res.code === '000000'){
              $rootScope.jumpto('tab.chehuiSuccess', {
                txnStat: $scope.RZbussDetails.txnStat,
                appNo: $scope.RZbussDetails.appNo,
                disctAmt: $scope.RZbussDetails.disctAmt
              });
              popUpAgain.close();
            }

          })
        };
        //取消
        $scope.againGiveout = function () {
          popUpAgain.close();
        }

      }
      //取消
      $scope.giveout = function () {
        if (cint) {
          $interval.cancel(cint);
          $scope.getMessageInfo = '发送验证码';
        }
        popUp.close();
      }
    };
  })
  //融资撤回或取消成功
  .controller('RZchehuiSuccessCtrl', function ($scope, $stateParams, ToolService, $ionicHistory) {
    $scope.srcDrftNo = $stateParams.srcDrftNo;
    $scope.disctAmt = $stateParams.disctAmt;

    if ($stateParams.txnStat == '10') {
      $scope.stateWord = '撤回'
    }
    if ($stateParams.txnStat == '01') {
      $scope.stateWord = '取消'
    }
    $scope.tool = ToolService;
    $scope.Jumpto = function () {
      $ionicHistory.goBack(-2);
    }
  })
  //融资
  .controller('RongZiLastStepCtrl', function ($scope, $ionicPopup, $state, $rootScope, ToolService,getSmsCode,$interval,RZapply) {
    $scope.tool = ToolService;
    //宝券信息获取
    $scope.checkedBQMsgs = $rootScope.RZhttpParams.baoquanInfo;
    //计算所得
    $scope.checkedCalcRes = $rootScope.RZhttpParams.calcRes;
    //融资利率等
    $scope.checkedRateData = $rootScope.RZhttpParams.rateData;
    //银行信息
    $scope.checkedBankInfo = $rootScope.RZhttpParams.bankInfo;
    $scope.numberTurn = '';
    var cint = '';//短信验证码定时器
    $scope.getMessageInfo = "发送验证码";
    $scope.msCode = {
      num: ''
    };
    //融资申请
    $scope.RZapplyBtn = function () {
      var popUp = $ionicPopup.show({
        cssClass: 'my-popup',
        templateUrl: 'template/popup-rongzi-apply.html',
        scope: $scope
      });

      $scope.getMsgcode = function () {
        console.log(111);
        //防止多次点击
        if ($scope.getMessageInfo != '发送验证码') {
          return;
        } else {
          //发送验证码
          getSmsCode.getsmscode("RZ01").then(function (res) {
            console.log(res);
          }).catch(function (err) {
            console.log(err);
          })
          $scope.getMessageInfo = 60;
          cint = $interval(function () {
            $scope.getMessageInfo--;
            if ($scope.getMessageInfo <= 0) {
              $interval.cancel(cint);
              $scope.getMessageInfo = "发送验证码";
            }
            ;
          }, 1000);
          //获取的验证码校验逻辑--------------------
        }
      }

      $scope.makesure = function () {
        if (cint) {
          $interval.cancel(cint);
          $scope.getMessageInfo = '发送验证码';
        }
        var msCode = $scope.msCode.num;
        var drftApplyList = [];
        //预计实付利息计算
        var coin = $scope.checkedRateData.coin;

        for (var i = 0; i < $scope.checkedBQMsgs.length; i++) {
          //应付利息
          var isse = $scope.checkedBQMsgs[i].InputIsseAmt * $scope.checkedRateData.yearRate * $scope.checkedBQMsgs[i].dueDays / 360;
          //优惠后利息
          var disInt = isse * $scope.checkedRateData.DisInt;
          //实付利息
          var rcInterest = 0
          var httpParams = {};
          httpParams.srcDrftNo = $scope.checkedBQMsgs[i].drftNo;
          httpParams.disctAmt = $scope.checkedBQMsgs[i].InputIsseAmt;
          httpParams.intRate = $scope.checkedRateData.yearRate;
          httpParams.rateDisct = $scope.checkedRateData.DisInt;
          //预计应付利息
          httpParams.dcInterest = $scope.tool.formMoney(isse);
          //实付 = 应付 * 优惠 - coin
          if(coin == 0){
            //实付利息 = 优惠后利息
            httpParams.rcInterest = disInt;
          }else if(disInt >= coin){
            httpParams.rcInterest = disInt - coin;
            coin = 0;
          }else if(disInt < coin){
            httpParams.rcInterest = 0;
            coin -= disInt;
          }
          httpParams.rcInterest = $scope.tool.formMoney(httpParams.rcInterest);
          httpParams.isBouns = $scope.checkedRateData.isBouns;
          httpParams.useBouns = $scope.checkedRateData.coin;
          httpParams.intDays = $scope.checkedBQMsgs[i].dueDays;
          httpParams.srcDueDt = $scope.checkedBQMsgs[i].dueDt;
          httpParams.finTyp = '1';//融资类型

          httpParams.pyeeBankCity = $scope.checkedBankInfo[0].bankCity;
          httpParams.pyeeBankNm = $scope.checkedBankInfo[0].openBrhNm;
          httpParams.pyeeBankNo = '123456789' //收款银行行号暂无
          httpParams.pyeeAcct = $scope.checkedBankInfo[0].acctNo;
          httpParams.pyeeAcctNm = $scope.checkedBankInfo[0].openAcctNm;
          drftApplyList.push(httpParams);
        }
        console.log(drftApplyList);
        RZapply.http(msCode,drftApplyList).then(function (res) {
          console.log(res);
          popUp.close();
          $state.go('tab.BankSuccess');

        })



      }
      //取消
      $scope.giveout = function () {
        if (cint) {
          $interval.cancel(cint);
          $scope.getMessageInfo = '发送验证码';
        }
        popUp.close();
      }
    };

  });

