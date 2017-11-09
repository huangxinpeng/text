/**
 * Created by haibo on 2017/8/12.
 */
/* 我的版块控制 */
angular.module('zxscf.controllers.mine', [])
  .controller('MineCtrl', function ($scope,$cordovaToast,MineChangeCompany,$ionicHistory,$ionicNavBarDelegate,getUserMsg,GetCorpList){
    // 好友分享
    $scope.wxfShare=function(){
      wxShare(Wechat.Scene.SESSION);
    }
    // 朋友圈分享
    $scope.wxqShare=function(){
      wxShare(Wechat.Scene.TIMELIN);
    }

    function wxShare(scene){
      var shareInfo={
        title:"中兴蜜蜂金融", // 分享标题
        desc:"中兴描述信息中兴描述信息",  // 分享描述信息
        icon:"",  // 分享图标（网络地址的图标）
        url:"http://www.baidu.com"    // 分享路径
      };
      Wechat.share({
        message: {
          title: shareInfo.title,
          description: shareInfo.desc,
          thumb: shareInfo.icon,
          media: {
            type: Wechat.Type.WEBPAGE,
            webpageUrl: shareInfo.url
          }
        },
        scene: scene
      }, function () {
        $cordovaToast.showShortCenter('分享成功~');
      }, function (reason) {
        if (reason === "未安装微信") {
          $cordovaToast.showShortCenter(reason);
        }
      });
    };


    //user center
    getUserMsg.http().then(function (res) {
      console.log(res);
      if(res.code === '000000'){

      $scope.getUserInfo = res.data;
      $scope.jinbangang = false;
      $scope.fuhegang = false;
      $scope.guanliyuan = false;
      $scope.shouquangang = false;
      $scope.getUserInfo.corpRoleIdList.forEach(function (arr, idx) {
        if(arr == 100){
          $scope.guanliyuan = true;
        };
        if(arr == 200){
          $scope.jinbangang = true;
        };
        if(arr == 300){
          $scope.fuhegang = true;
        };
        if(arr == 400){
          $scope.shouquangang = true;
        };
      });
      }
    })

    $scope.$on('$ionicView.enter', function () {
      //获取企业归属列表
      GetCorpList.http().then(function (res) {
        //切换企业
        //$scope.MineChangeCompanys = MineChangeCompany.all();
        $scope.MineChangeCompanys = res.data.list;
        console.log(res.data.list);
        for (var i = 0; i < $scope.MineChangeCompanys.length; i++) {
          if($scope.MineChangeCompanys[i].isLogin === '1')
          //默认企业设置
            $scope.corpname = $scope.MineChangeCompanys[i].custCnNm;
        };
      });
    })
    //接收企业传入的名称
    //$scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
    //  if(toParams.data){
    //    $scope.corpname = toParams.data;
    //  };
    //  if(from.name === 'tab.ChangeCompany'){
    //    //由于state.go，主页会出现返回按钮
    //    $ionicHistory.clearHistory();
    //    $ionicNavBarDelegate.showBackButton(false);
    //  }else{
    //    $ionicNavBarDelegate.showBackButton(true);
    //  };
    //});

  })
  //个人中心
  .controller('MineSelfMessageCtrl', function ($scope,getUserMsg,$state,$ionicActionSheet,$cordovaCamera,config,$ionicPopup,$cordovaImagePicker,AddUserPic) {
    $scope.imgData = {};
    $scope.imgData.imgSrcOri = './img/icon2.x/touxiang-xiao.png';
    $scope.idCard1 = './img/icon2.x/shenfenzheng1.png';
    $scope.idCard2 = './img/icon2.x/shenfenzheng2.png';

    $scope.$on('$ionicView.enter', function () {
      getUserMsg.http().then(function (res) {
        console.log(res);
        $scope.getUserInfo = res.data;
        $scope.jinbangang = false;
        $scope.fuhegang = false;
        $scope.guanliyuan = false;
        $scope.shouquangang = false;
        $scope.getUserInfo.corpRoleIdList.forEach(function (arr, idx) {
          if(arr == 100){
            $scope.guanliyuan = true;
          };
          if(arr == 200){
            $scope.jinbangang = true;
          };
          if(arr == 300){
            $scope.fuhegang = true;
          };
          if(arr == 400){
            $scope.shouquangang = true;
          };
        });
        //修改邮箱
        $scope.resetEmail = function () {
          $state.go('tab.MineResetEmail');
        }
        $scope.resetAddress = function () {
          $state.go('tab.MineResetAddress');
        }
        //获取图片
        if($scope.getUserInfo.headImg){
        var idImg = $scope.getUserInfo.headImg;
        $scope.imgData.imgSrcOri = config.envPath + config.httpInsertApi.CMG1010 + '?id=' + idImg;
        }
        if($scope.getUserInfo.idCardImgFont){
          var cardImg1 = $scope.getUserInfo.idCardImgFont;
          $scope.idCard1 = config.envPath + config.httpInsertApi.CMG1010 + '?id=' + cardImg1;
        }
        if($scope.getUserInfo.idCardImgReverse){
          var cardImg2 = $scope.getUserInfo.idCardImgReverse;
          $scope.idCard2 = config.envPath + config.httpInsertApi.CMG1010 + '?id=' + cardImg2;
        }
      })

    });
    //调用相机和图库
    $scope.picture=function(){
      $ionicActionSheet.show({
        buttons:[
          {text:"相机"},
          {text:'从手机相册选择'}
        ],
        cancelText:"取消",
        cancel:function(){
          return true;
        },
        buttonClicked:function(index){
          switch(index){
            case 0:$scope.takePhoto(); break;
            case 1:$scope.pickImage(); break;
            default : break;
          }
          return true;
        }
      })
    };
    // 调用相机
    $scope.takePhoto=function(){
      navigator.camera.getPicture(function (imgUrl) {
          $scope.imgData.imgSrcOri=imgUrl;
          window.resolveLocalFileSystemURL(imgUrl, function(fileEntry) {
            fileEntry.file(function(file) {

              //发送
              var files = $scope.imgData.imgSrcOri;
              alert(files);
              AddUserPic.http('YH','YH04','YH0101','1','userImg','YH',files).then(function (res) {
                alert(res);
              }).catch(function (err) {
                alert(err)
              })
            });
          });
      }, function (err) {
        $ionicPopup.alert({
          title:"提示",
          template:"<div class='text-center'>"+err.message+"</div>",
          buttons:[{
            text:'确定',
            type:'button-positive'
          }]
        });
      });
    };
    // 选择图库
    $scope.pickImage=function(){
      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
      };
      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
            $scope.imgData.imgSrcOri=results[0];
          //发送
          var files = $scope.imgData.imgSrcOri;
          alert(files);
          AddUserPic.http('YH','YH04','YH0101','1','userImg','YH',files).then(function (res) {
            alert(res);
          }).catch(function (err) {
            alert(err)
          })
        }, function (err) {
          $ionicPopup.alert({
            title:"提示",
            template:"<div class='text-center'>"+err.message+"</div>",
            buttons:[{
              text:'确定',
              type:'button-positive'
            }]
          });
        });
    };



  })
  //修改邮箱
  .controller('MineResetEmailCtrl', function ($scope,ToolService,$ionicLoading,$ionicHistory,ResetMail,ResetAddress) {
    $scope.hasReset = function () {
      var REG =  ToolService.setEmail($scope.email.value);
      if(!REG){
        $ionicLoading.show({template: "请输入正确的邮箱地址", noBackdrop: true, duration: 1000});
          return;
      }
      var emialText = $scope.email.value;
      console.log(emialText);

      ResetMail.http(emialText).then(function (res) {
        console.log(res);
      })
      $ionicHistory.goBack(-1);
    };
  })
  //修改住址
  .controller('MineResetAddressCtrl', function ($scope,$ionicModal,GetArea,$ionicLoading,ResetAddress,$ionicHistory) {
    $scope.address = {value : ''};
    $scope.isshow = true;
    $scope.street = {value:''}
    $scope.citys = function(){
      $scope.isshow = true;
      var promise = GetArea.http();
      promise.then(
        function(res){
          $scope.provLists = res.data.list;
          $scope.modal.show();
        });
    };

    $ionicModal.fromTemplateUrl('template/modal-citylists.html',{scope:$scope}).then(
      function(modal){
        $scope.modal = modal;
      });

    /*城市选择*/
    $scope.checkprov = function(id,prov){
      $scope.choprov = prov;
      $scope.chocity = '';
      var promise = GetArea.http(id,'2');
      promise.then(
        function(res){
          $scope.isshow = false;
          $scope.cityLists = res.data.list;
          var div = document.querySelectorAll('.scroll')[1];
          div.setAttribute('style','transform:translate3d(0px, 0px, 0px) scale(1)')
        }
      )};
    $scope.checkcity = function(city){
      $scope.chocity = city;
    };
    /*确定*/
    $scope.closemodal = function(){
      $scope.modal.hide();
      $scope.provcity = $scope.choprov + $scope.chocity;
      //$scope.companyInfo.regAdrProv = $scope.choprov;
      //$scope.companyInfo.regAdrCity = $scope.chocity
    };
    $scope.hasReset = function () {
      console.log($scope.provcity + $scope.street.value);
      var newAddress = $scope.provcity + $scope.street.value;
      if(!$scope.provcity || $scope.street.value == ''){
        $ionicLoading.show({template: "请输入正确的住址", noBackdrop: true, duration: 1000});
        return;
      }
      ResetAddress.http(newAddress).then(function (res) {
        console.log(res);
        $ionicHistory.goBack(-1);
      });
    };
  })
  //我的宝券查询
  .controller('MineBaoQuanCtrl', function ($scope,MineBaoQuan,Minebaoquanchaxun,ToolService,$rootScope) {


    //$scope.MineBaoQuans = MineBaoQuan.all()
    $scope.$on('$ionicView.enter', function () {

    var promise = Minebaoquanchaxun.http();
    promise.then(function (res) {
        $scope.MinebaoquanchaxunData = res.data.list;
        console.log(res);
        //时间格式转化
        $scope.tool = ToolService;
        $scope.toMineBaoQuanMsgBtn = function (id) {
          $rootScope.jumpto('tab.MineBaoQuanMessage',{id:id})
        }
    });
    })

  })
  .controller('MineBaoQuanMessageCtrl', function ($scope, $stateParams,$rootScope,MinebaoquanDetail,ToolService) {
    var id = $stateParams.id;
    var promise = MinebaoquanDetail.http(id);
    promise.then(function (res) {
      console.log(res.data);
      $scope.MineBaoQuanDetails = res.data;
      $scope.tool = ToolService;
      $scope.toNextstep = function (validAmt,dueDays,drftNo) {
        $rootScope.jumpto('tab.ApplyInsurance',{validAmt:validAmt,dueDays:dueDays,drftNo:drftNo});
      }
    })
  })
  .controller('ApplyInsuranceCtrl', function ($scope,$ionicPopup,$state,$stateParams,$ionicLoading,ToolService,$interval,getSmsCode,freeQuery,ConfirmList,MineCoin,ConfirmApply) {
    $scope.tool = ToolService;
    $scope.validAmt = $stateParams.validAmt;//宝券金额
    $scope.dueDays = $stateParams.dueDays;//距到期日
    $scope.drftNo = $stateParams.drftNo;//票据号码
    //实际费用
    $scope.realSum = 0;
    $scope.diKouCoin = 0;
    //年利率获取
    freeQuery.http('0201','1','2').then(function (res) {
      $scope.rate = res.data.rate || 0;
      $scope.sum = $scope.validAmt * $scope.dueDays * $scope.rate ;

    })
    //抵扣
    MineCoin.http().then(function (res) {
      $scope.coin = res.data.validBonus || 0;
      //实际费用
      if($scope.sum >= $scope.coin){
        $scope.realSum = $scope.sum - $scope.coin;
        $scope.diKouCoin = $scope.coin;
      }
      if($scope.sum < $scope.coin){
        $scope.realSum = 0;
        $scope.diKouCoin = $scope.sum;
      }
    })
    //加保机构取了第一个
    ConfirmList.http().then(function (res) {
      console.log(res.data.list);
      //机构名称
      $scope.confirmCorp = res.data.list[0].brname || '无';
      //机构代码
      $scope.brno = res.data.list[0].brno;
    })
    //费用利率
    $scope.ApplyInsuranceBtn = function () {
      $scope.checked = {value:false};
      $scope.msCode = {value:''};
      $scope.getMessageInfo = '发送验证码';
      var popUp=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-mine-apply-insurance.html',
        scope:$scope
      });
      $scope.getCodeBtn = function () {
        console.log(111);
        //防止多次点击
        if($scope.getMessageInfo != '发送验证码'){
          return;
        }else{
          //发送验证码
          var promise = getSmsCode.getsmscode("CM01");
          var count = 60;
          $scope.cint = $interval(function(){
            count--;
            $scope.getMessageInfo = count + 'S';
            if(count <= 0){
              $interval.cancel($scope.cint);
              $scope.getMessageInfo = "发送验证码";
            };
          },1000);
        }
      };
      //确认
      $scope.makesure=function(){
        if($scope.msCode.value == ''){
          $ionicLoading.show({template: "请输入验证码", noBackdrop: true, duration: 1000});
          return;
        }
        if(!$scope.checked.value){
          $ionicLoading.show({template: "请先阅读并接受同意", noBackdrop: true, duration: 1000});
          return;
        }
        var orgId = $scope.brno;
        var orgNm = $scope.confirmCorp;
        var smsCode = $scope.msCode.value;
        var applyList = [];
        var obj = {};
        obj.srcDrftNo = $scope.drftNo;
        obj.txnAmt = $scope.validAmt;
        obj.txnFee = $scope.sum;
        //是否抵扣
        if($scope.diKouCoin == 0){
          obj.isBouns = '0';
        }else{
          obj.isBouns = '1';
        }
        obj.payAmt = $scope.realSum;
        obj.chargeType = '2';
        obj.useBouns = $scope.diKouCoin;
        applyList.push(obj);
        //500000
        ConfirmApply.http(orgId,orgNm,smsCode,applyList).then(function (res) {
          if(res.code === '000000'){
            popUp.close();
            $state.go('tab.ApplyInsuranceSuccess');
          }else{
            $ionicLoading.show({template: "操作失败", noBackdrop: true, duration: 1000});
          }

        })

      };
      //取消
      $scope.giveout = function () {
        popUp.close();
      }
      //查看协议须知
      $scope.JiaBaoXuZhi = function () {
        popUp.close();
        $state.go('tab.BaoQuanXuZhi');
      }
    }
  })
  .controller('ApplyInsuranceSuccessCtrl', function ($scope,$ionicHistory) {
    $scope.backBtn = function () {
      $ionicHistory.goBack(-3);
    }
  })
  .controller('MineBankIDCtrl', function ($scope,MineBankID,$state,MineBankSearch,$rootScope) {
    $scope.$on('$ionicView.enter', function () {
      var promise = MineBankSearch.http();
      promise.then(function (res) {
        console.log(res);
        $scope.MineBankIDs = res.data.list;

        //$scope.MineBankIDs = MineBankID.all();
        //把银行名字和信息转换成米字号
        $scope.numberTurn = '';
        $scope.bankNameTurn = '';
        $scope.bankDifStateGo = function (checkStu,id) {
          //已生效
          if(checkStu == '2') {
            console.log('只能删除账户的页面');
            //$rootScope.jumpto('tab.AlreadySendMoneyFirst',{id:id})
          };
          //未生效
          if(checkStu == '0'){
            $rootScope.jumpto('tab.BankIDCheckLostFir',{id:id})
          }
          //待验证 和 验证失败
          if(checkStu == '3' || checkStu == '1'){
            $rootScope.jumpto('tab.AlreadySendMoneyFirst',{id:id})

          }
        };
      });
    })

  })
  .controller('BankIDCheckLostFirCtrl', function ($scope,$stateParams,getSmsCode,$interval,$ionicLoading,$state,MineBankPayCheckNoNeedMoney) {
    //ZH03
    $scope.msCode = {value:''}
    $scope.sendCodeWord = '发送验证码';
    $scope.bankNoPopupSendCodeBtn = function () {
      //防止多次点击
      if ($scope.sendCodeWord != '发送验证码') {
        return;
      } else {
        //发送验证码
        getSmsCode.getsmscode("ZH02").then(function (res) {
          console.log(res);
        }).catch(function (err) {
          console.log(err);
        })
        var count = 60;
        cint = $interval(function () {
          count--;
          $scope.sendCodeWord = count + 'S';
          if (count <= 0) {
            $interval.cancel(cint);
            $scope.sendCodeWord = "发送验证码";
          };
        }, 1000);
        //获取的验证码校验逻辑--------------------
      }
    };
    $scope.toNextStepBtn = function () {
      if($scope.msCode.value == ''){
        $ionicLoading.show({template: "请输入验证码", noBackdrop: true, duration: 1000});
        return;
      }
      //验证不正确情况未完善

      //请求
      var smsCode = $scope.msCode.value;
      console.log($stateParams.id,smsCode);
      MineBankPayCheckNoNeedMoney.http($stateParams.id,smsCode).then(function (res) {
        console.log(res);
        if(res.code === '180018'){
          $ionicLoading.show({template: "验证码无效", noBackdrop: true, duration: 1000});
        };
        if(res.code === '160002'){
          $ionicLoading.show({template: "验证码不正确", noBackdrop: true, duration: 1000});
        };
        $state.go('tab.BankIDCheckLostSec');
      })
    }
  })
  .controller('BankIDCheckLostSecCtrl', function ($scope,$ionicHistory) {
    $scope.BankCheckLostSecBtn = function () {
      $ionicHistory.goBack(-2);
    };
  })
  .controller('AlreadySendMoneyFirstCtrl', function ($scope,$ionicPopup,$state,getSmsCode,$interval,$ionicLoading,$stateParams,MineBankPayCheck,$rootScope,ToolService,MineDeleteBank) {
    var id = $stateParams.id
    $scope.tool = ToolService;
    $scope.MoRen = {value:false};
    MineBankPayCheck.http(id).then(function (res) {
      console.log(res.data);
      $scope.bankAccNoInfo = res.data;

      if($scope.bankAccNoInfo.defRecNo == '1'){
        $scope.MoRen.value = true;
      };
    });
    $scope.IDVerifyBtn = function () {
      $rootScope.jumpto('tab.AlreadySendMoneySec',{id:id});
    };
    $scope.IDDeleBtn = function () {
      //弹框确认
      var confirmPopup = $ionicPopup.confirm({
        title: '提示',
        template: "确定删除该账户吗?",
        cancelText: "取消",
        cancelType: "button-gray",
        okText: '确定',
        okType: "button-positive",
      });
      confirmPopup.then(function(res) {
        if(res) {
          //确认 短信验证
          $scope.msCode = {value:''}
          var popUp=$ionicPopup.show({
            cssClass:'my-popup',
            templateUrl:'template/popup-ID-verify.html',
            scope:$scope
          });
          //点击发送验证码
          $scope.getMsgcode = function () {
            //防止多次点击
            if($scope.getMessageInfo != '发送验证码'){
              return;
            }else{
              //发送验证码
              var promise = getSmsCode.getsmscode("ZH05");
              var count = 60;
              $scope.cint = $interval(function(){
                count--;
                $scope.getMessageInfo = count + 'S';
                if(count <= 0){
                  $interval.cancel($rootScope.cint);
                  $scope.getMessageInfo = "发送验证码";
                };
              },1000);
            }
          }
          //确认
          $scope.makesure=function(){

            if($scope.msCode.value == ''){
              $ionicLoading.show({template: "请输入验证码", noBackdrop: true, duration: 1000});
            }
            //验证校验逻辑未写




            MineDeleteBank.http(id).then(function (res) {
              console.log(res);
            })
            //popUp.close();
          };
          //取消
          $scope.giveout = function () {
            popUp.close();
          };





        } else {
          //取消
        }
    })
    }

  })
  .controller('AlreadySendMoneySecCtrl', function ($scope,$stateParams,MineBankPayCheckNeedMoney,MineBankPayCheck,ToolService,getSmsCode,$interval,$ionicLoading,$state) {
    var id = $stateParams.id;
    $scope.tool = ToolService;
    $scope.transfer = {value:''};
    MineBankPayCheck.http(id).then(function (res) {
      console.log(res.data);
      $scope.bankAccNoInfo = res.data;

    });
    $scope.msCode = {value:''}
    $scope.sendCodeWord = '发送验证码';
    $scope.bankNoPopupSendCodeBtn = function () {
      //防止多次点击
      if ($scope.sendCodeWord != '发送验证码') {
        return;
      }
      if($scope.transfer.value == ''){
        $ionicLoading.show({template: "请输入金额", noBackdrop: true, duration: 1000});
        return;
      }
        //发送验证码
        getSmsCode.getsmscode("ZH03").then(function (res) {
          console.log(res);
        }).catch(function (err) {
          console.log(err);
        })
        var count = 60;
        cint = $interval(function () {
          count--;
          $scope.sendCodeWord = count + 'S';
          if (count <= 0) {
            $interval.cancel(cint);
            $scope.sendCodeWord = "发送验证码";
          }
          ;
        }, 1000);
        //获取的验证码校验逻辑--------------------
    };
  //  验证
    $scope.toNextStepBtn = function () {
      if($scope.transfer.value == ''){
        $ionicLoading.show({template: "请输入金额", noBackdrop: true, duration: 1000});
        return;
      }
      if($scope.msCode.value == ''){
        $ionicLoading.show({template: "请输入验证码", noBackdrop: true, duration: 1000});
        return;
      }
    //  验证码校验逻辑未完成
      MineBankPayCheckNeedMoney.http(id,$scope.msCode.value,$scope.transfer.value).then(function (res) {
        console.log(res);
        if(res.code === '000000'){
          $ionicLoading.show({template: "验证成功", noBackdrop: true, duration: 1000});
        }else {
          $ionicLoading.show({template: "验证失败", noBackdrop: true, duration: 1000});
        }
        $state.go('tab.AlreadySendMoneyThird');
      })
    }
  })
  .controller('AlreadySendMoneyThirdCtrl', function ($scope,$ionicHistory) {
    $scope.backBankIDBtn = function () {
      $ionicHistory.goBack(-3);
    }
  })
  .controller('MineBankIDAddCtrl', function ($scope,$ionicHistory,GetArea,$ionicModal,$ionicLoading,MineAddBank) {
    $scope.address = {value : ''};
    $scope.openAcctNm = {value:''};
    $scope.acctNo = {value:''};
    $scope.openBrhCd = {value:'888888'};//开户行
    $scope.openBrhNm = {value:''};


    $scope.isshow = true;
    $scope.MoRen = {value:false}
    $scope.citys = function(){
      $scope.isshow = true;
      var promise = GetArea.http();
      promise.then(
        function(res){
          $scope.provLists = res.data.list;
          $scope.modal.show();
        });
    };
    $ionicModal.fromTemplateUrl('template/modal-citylists.html',{scope:$scope}).then(function(modal){
        $scope.modal = modal;
      });
    //城市选择
    $scope.checkprov = function(id,prov){
      $scope.choprov = prov;
      $scope.chocity = '';
      $scope.areaId = id;
      var promise = GetArea.http(id,'2');
      promise.then(
        function(res){
          $scope.isshow = false;
          $scope.cityLists = res.data.list;
          var div = document.querySelectorAll('.scroll')[1];
          div.setAttribute('style','transform:translate3d(0px, 0px, 0px) scale(1)')
        }
      )};
    $scope.checkcity = function(city){
      $scope.chocity = city;

    };
    //确定
    $scope.closemodal = function(){
      $scope.modal.hide();
      $scope.provcity = $scope.choprov + $scope.chocity;

    };
    //提交
    $scope.submitBtb = function () {
      var defRecNo = '';
      //$scope.openAcctNm = {value:''};
      //$scope.acctNo = {value:''};
      $scope.openBrhCd = {value:'888888'};//开户行
      //$scope.openBrhNm = {value:''};
    if($scope.openAcctNm.value == '' || $scope.acctNo.value == '' || $scope.openBrhCd.value == ''|| $scope.openBrhNm.value ==''){
      $ionicLoading.show({template: "内容不能为空", noBackdrop: true, duration: 1000});
      return;
    }
      if($scope.MoRen.value){
         defRecNo = '1';
      }else{
         defRecNo = '0';
      }
      var bankCity = $scope.provcity;
      var openBrhCd = $scope.openBrhCd.value;
      var openBrhNm = $scope.openBrhNm.value;
      var acctNo = $scope.acctNo.value + '';
      var openAcctNm = $scope.openAcctNm.value;
      console.log(bankCity,$scope.areaId,openBrhCd,openBrhNm,acctNo,openAcctNm,defRecNo);
      MineAddBank.http(bankCity,$scope.areaId,openBrhCd,openBrhNm,acctNo,openAcctNm,defRecNo).then(function (res) {
        if(res.code === '000000'){
          $ionicLoading.show({template: "银行账户添加成功", noBackdrop: true, duration: 1000});
          $ionicHistory.goBack(-1);
        }
      })
    }
  })
  .controller('ChangeCompanyCtrl', function ($scope,MineChangeCompany,$state,$rootScope,GetCorpList,ReturnCorp,$ionicLoading,$ionicHistory) {
    GetCorpList.http().then(function (res) {
      //$scope.MineChangeCompanys = MineChangeCompany.all();
      $scope.MineChangeCompanys = res.data.list;
      for (var i = 0; i < $scope.MineChangeCompanys.length; i++) {
        if($scope.MineChangeCompanys[i].isLogin === '1')
        //默认企业设置
          $scope.choice = $scope.MineChangeCompanys[i].custCnNm;
      };
      //根据页面传进来的index显示名称
      $scope.radioChange = function(idx,custNo){
        //如果点击的是上次的那个
        if($scope.choice == $scope.MineChangeCompanys[idx].custCnNm){
          //什么也不做
        }
          ReturnCorp.http(custNo).then(function (res) {
            if(res.code === '000000'){
              $ionicLoading.show({template: "操作成功", noBackdrop: true, duration: 1000});
              $ionicHistory.goBack(-1);
            }else{
              $ionicLoading.show({template: "操作失败", noBackdrop: true, duration: 1000});
            }
          })
        };

    });

  })
  //交易对手custCnNm
  .controller('MineJiaoYiDuiShouCtrl', function ($scope,$ionicPopup,$ionicLoading,MineMailAdmin,MineJiaoYiDuiShou,ToolService,SearchPartnerCorpName) {
    $scope.$on('$ionicView.enter', function () {
      JiaoYiDuiShouHttpList();
      $scope.toTellManager = false;
        $scope.searchCorpName = {value:''};
        $scope.searchCorp = function () {
          $scope.JYDSLists = [];
          console.log($scope.searchCorpName.value);
          if($scope.searchCorpName.value != ''){
            var qCustCnNm = $scope.searchCorpName.value;
            SearchPartnerCorpName.http(qCustCnNm).then(function (res) {
              console.log(res.data.list);
              $scope.JYDSLists = res.data.list;

            })
          }else{
            JiaoYiDuiShouHttpList();
          }
        };
    })
    var JiaoYiDuiShouHttpList = function () {
      var promise = MineJiaoYiDuiShou.http(1);
      promise.then(function (res) {
        console.log(res);
        $scope.JYDSLists = res.data.list;
        $scope.tool = ToolService;
      });

    }
    $scope.text = {value:''};
    $scope.MailAdmin = function () {

      var popUp=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-mailAdmin.html',
        scope:$scope
      });
      $scope.makesure = function () {
      var mailMsg =$scope.text.value;
        if(mailMsg == ''){
          $ionicLoading.show({template: "发送内容不能为空", noBackdrop: true, duration: 1000});
          return;
        }
        MineMailAdmin.http(mailMsg).then(function (res) {
          if(res.code === '000000'){
            $ionicLoading.show({template: "操作成功", noBackdrop: true, duration: 1000});
            popUp.close();
          }else{
            $ionicLoading.show({template: "操作失败", noBackdrop: true, duration: 1000});
            popUp.close();
          }
        })
      }
      $scope.giveout = function () {
        popUp.close();
      }
    };
  })
  //添加交易对手
  .controller('AddJiaoyiduishouCtrl', function ($scope, $ionicPopup,MineMailAdmin,CounterpartyListAddPartner,SearchPartnerCorpName,$ionicLoading) {
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
    $scope.text = {value:''};
    $scope.MailAdmin = function () {

      var popUp=$ionicPopup.show({
        cssClass:'my-popup',
        templateUrl:'template/popup-mailAdmin.html',
        scope:$scope
      });
      $scope.makesure = function () {
        var mailMsg =$scope.text.value;
        if(mailMsg == ''){
          $ionicLoading.show({template: "发送内容不能为空", noBackdrop: true, duration: 1000});
          return;
        }
        MineMailAdmin.http(mailMsg).then(function (res) {
          if(res.code === '000000'){
            $ionicLoading.show({template: "操作成功", noBackdrop: true, duration: 1000});
            popUp.close();
          }else{
            $ionicLoading.show({template: "操作失败", noBackdrop: true, duration: 1000});
            popUp.close();
          }
        })
      }
      $scope.giveout = function () {
        popUp.close();
      }
    };
  })
  //我的企业信息查询
  .controller('MineCompanyCtrl', function ($scope,MineCompanyHttp,$state,$http,$ionicPopup,SettingMoRenCorp,$ionicLoading,config,$http) {
    //$scope.isApply = '';
    //$scope.isRegister = '';
    $scope.$on('$ionicView.enter', function () {

    var promise = MineCompanyHttp.http();
    promise.then(function (res) {

      if(res.code === '000000'){
        $scope.CorpMsgs = res.data;
        $scope.attachDivList = res.data.attachDivList;
        if($scope.attachDivList.length != 0){
          //营业执照显示

          var id1 = $scope.attachDivList[0].id;
          var id2 = $scope.attachDivList[1].id;

          $scope.PictureOffUrl = config.envPath + config.httpInsertApi.CMG1010 + '?id=' + id1;
          $scope.PictureOnUrl = config.envPath + config.httpInsertApi.CMG1010 + '?id=' + id2;
        }

        //是否申请数字证书
        if($scope.CorpMsgs.isCert == '1'){
          $scope.isApply = '已申请';
        }else if($scope.CorpMsgs.isCert == '0' || $scope.CorpMsgs.isCert == null){
          $scope.isApply = '未申请';
        }
        //是否签约
        if($scope.CorpMsgs.isRegister == '1'){
          $scope.isRegister = '已签约';
        }else if($scope.CorpMsgs.isRegister == '0' || $scope.CorpMsgs.isRegister == null){
          $scope.isRegister = '未签约';
        }
        //申请数字证书
        $scope.isApplyBtn = function () {
          if($scope.CorpMsgs.isCert != '1'){
            $state.go('tab.ApplyZhengShu');
          }else{
            $ionicLoading.show({template: "恭喜您已申请", noBackdrop: true, duration: 1000});
          }
        };
        $scope.MoRen = {value:false};
        if(res.data.isDefault == '1'){
          $scope.MoRen.value = true;
        };
        if(res.data.isDefault == '0'){
          $scope.MoRen.value = false;
        };
        $scope.isMoRenBtn = function () {
          //弹框确认
          var confirmPopup = $ionicPopup.confirm({
            title: '提示',
            template: "确定进行默认企业操作吗?",
            cancelText: "取消",
            cancelType: "button-gray",
            okText: '确定',
            okType: "button-positive",
          });
          confirmPopup.then(function(res) {
            if(res) {
              SettingMoRenCorp.http($scope.CorpMsgs.custNo).then(function (res) {
                if(res.code === '000000'){
                  $ionicLoading.show({template: "操作成功", noBackdrop: true, duration: 1000});
                }else{
                  $ionicLoading.show({template: res.message, noBackdrop: true, duration: 1000});
                  $scope.MoRen.value = !$scope.MoRen.value;
                }
              })
            }else{
              $scope.MoRen.value = !$scope.MoRen.value;
            }
          })
        };




        //$http({
        //  method: 'GET',
        //  url: config.envPath + config.httpInsertApi.CMG1010,
        //  params: {
        //    id:id2
        //  }
        //}).success(function (res) {
        //  console.log(res);
        //}).error(function (err) {
        //  console.log(err);
        //})
      };
    });
      //是否签约
      $scope.isRegisterBtn = function () {
        if($scope.CorpMsgs.isRegister != '1'){
          $state.go('tab.ApplyRegister');
        }else{
          $ionicLoading.show({template: "恭喜您已签约", noBackdrop: true, duration: 1000});
        };
      };
    });

  })
  //协议签
  .controller('ApplyRegisterCtrl', function ($scope,$ionicPopup,ApplyRegisterQian,getSmsCode,$interval,MineCompanyHttp,$ionicLoading,$ionicHistory) {
    MineCompanyHttp.http().then(function (res) {
      if(res.code === '000000'){
        $scope.corpInfo = res.data;
        console.log($scope.corpInfo);
        $scope.makeSureBtn = function () {
          var popUp=$ionicPopup.show({
            cssClass:'my-popup',
            templateUrl:'template/popup-mine-apply-zhengshu.html',
            scope:$scope
          });
          $scope.msCode = {num:''};
          $scope.getMessageInfo = '发送验证码';

          $scope.getCodeBtn = function () {
            console.log(111);
            //防止多次点击
            if($scope.getMessageInfo != '发送验证码'){
              return;
            }else{
              //发送验证码
              var promise = getSmsCode.getsmscode("AC02");
              var count = 60;
              $scope.cint = $interval(function(){
                count--;
                $scope.getMessageInfo = count + 'S';
                if(count <= 0){
                  $interval.cancel($scope.cint);
                  $scope.getMessageInfo = "发送验证码";
                };
              },1000);
            }
          };
          $scope.giveout = function () {
            popUp.close()
          };
          $scope.makesure = function () {
            if($scope.msCode.num == ''){
              $ionicLoading.show({template: "请输入验证码", noBackdrop: true, duration: 1000});
              return;
            }
            ApplyRegisterQian.http($scope.msCode.num).then(function (res) {
              console.log(res);
              if(res.code === '000000'){
                popUp.close();
                $ionicLoading.show({template: "签约成功", noBackdrop: true, duration: 1000});
                $ionicHistory.goBack(-1);
              }else{
                $ionicLoading.show({template: res.message, noBackdrop: true, duration: 1000});
              }
            });
          };
        };

      }
    })


  })
  //申请数字证书
  .controller('ApplyZhengShuCtrl', function ($scope,MineCompanyHttp,$ionicPopup,$ionicHistory,getSmsCode,$interval,ApplyCert,$ionicLoading) {
    $scope.isApplyBtn = false;
    MineCompanyHttp.http().then(function (res) {
      if(res.code === '000000'){
        $scope.applyMsg = res.data;
        console.log($scope.applyMsg);
        if($scope.applyMsg.isCert != '1'){
          $scope.isApplyBtn = true;
        }
        $scope.applyBtn = function(){
          var popUp=$ionicPopup.show({
            cssClass:'my-popup',
            templateUrl:'template/popup-mine-apply-zhengshu.html',
            scope:$scope
          });
          $scope.msCode = {num:''};
          $scope.getMessageInfo = '发送验证码';

          $scope.getCodeBtn = function () {
            console.log(111);
            //防止多次点击
            if($scope.getMessageInfo != '发送验证码'){
              return;
            }else{
              //发送验证码
              var promise = getSmsCode.getsmscode("AC01");
              var count = 60;
              $scope.cint = $interval(function(){
                count--;
                $scope.getMessageInfo = count + 'S';
                if(count <= 0){
                  $interval.cancel($scope.cint);
                  $scope.getMessageInfo = "发送验证码";
                };
              },1000);
            }
          };
          $scope.giveout = function () {
            popUp.close()
          };
          $scope.makesure = function () {
            if($scope.msCode.num == ''){
              $ionicLoading.show({template: "请输入验证码", noBackdrop: true, duration: 1000});
              return;
            }
            ApplyCert.http($scope.msCode.num).then(function (res) {
              console.log(res);

              if(res.code === '000000'){
                popUp.close();
                $ionicLoading.show({template: '操作成功', noBackdrop: true, duration: 1000});
                $ionicHistory.goBack(-1);
              }else{
                $ionicLoading.show({template: res.message, noBackdrop: true, duration: 1000});
              }
            });
          };
        };

      }
    })
  })
  //用户信息列表
  .controller('MineUserManageCtrl', function ($scope,UserListSearch,$rootScope) {
    $scope.$on('$ionicView.enter', function () {
      UserListSearch.http().then(function (res) {
        console.log(res.data.list);
        if(res.code === '000000'){
          $scope.getUserLists = res.data.list;
          //用户详情
          $scope.toUserMessageBtn = function (id) {
            $rootScope.jumpto('tab.UserMessage',{id:id});
          }
          //编辑
          $scope.userMessageEditBtn = function (id) {
            $rootScope.jumpto('tab.UserMessageVerify',{id:id});

          }
        }

      });

    });
  })
  //用户详情
  .controller('UserMessageCtrl', function ($scope,$stateParams,UserMessageDetail,$rootScope,$ionicPopup,$ionicHistory,UserDeletePwd) {
    console.log('详情');
    UserMessageDetail.http($stateParams.id).then(function (res) {
      console.log(res.data);
      $scope.userInfos = res.data;
      //密码重置
      $scope.passwordResetBtn = function (id) {
        console.log(id);
        $rootScope.jumpto('tab.PassworkReset',{id:id});
      }
      //删除用户
      $scope.deleteThisUserBtn = function (id) {
        console.log(id);
        //弹框确认
        var confirmPopup = $ionicPopup.confirm({
          title: '提示',
          template: "确定删除该用户吗?",
          cancelText: "取消",
          cancelType: "button-gray",
          okText: '确定',
          okType: "button-positive",
        });
        confirmPopup.then(function(res) {
          if(res) {
            UserDeletePwd.http(id).then(function (del) {
              console.log(del);
                $ionicHistory.goBack(-1);
            })
          }else{

          }
          })
      }
    })
  })
  //用户编辑
  .controller('UserMessageVerifyCtrl', function ($scope,$stateParams,UserMessageDetail,$rootScope,$ionicLoading,$state,UserEdit,$ionicHistory,$ionicPopup,getSmsCode,$interval) {
      var reloadUserMsgFunc = function () {
        UserMessageDetail.http($stateParams.id).then(function (res) {
          $scope.userInfo = res.data;
          $rootScope.userChooseRole = $scope.userInfo.corpRoleIdList;//存放角色
          $scope.ownRoles = '';
          $rootScope.userChooseRole.forEach(function (arr, i) {
            if (arr == '100') {
              $scope.ownRoles += '管理员 ';
            };
            if (arr == '200') {
              $scope.ownRoles += '经办人 ';
            };
            if (arr == '300') {
              $scope.ownRoles += '复核人 ';
            };
            //if(arr == '400'){
            //  $rootScope.userChooseRole += '授权人 ';
            //}
          });
          $scope.chooserole = function (id) {
            $rootScope.jumpto('tab.UserMessageKindsChoose', {id: id});
          };
          $scope.sendCodeWord = '发送验证码';
          $scope.msCode = {value:''};
          $scope.sendCodeBtn = function () {
            //防止多次点击
            if ($scope.sendCodeWord != '发送验证码') {
              return;
            } else {
              //发送验证码
              getSmsCode.getsmscode("YH02").then(function (res) {
                console.log(res);
              }).catch(function (err) {
                console.log(err);
              })
              var count = 60;
              cint = $interval(function () {
                count--;
                $scope.sendCodeWord = count + 'S';
                if (count <= 0) {
                  $interval.cancel(cint);
                  $scope.sendCodeWord = "发送验证码";
                };
              }, 1000);
              //获取的验证码校验逻辑--------------------
            }
          }
          $scope.userEditSubmitBtn = function () {
            if($scope.msCode.value == ''){
              $ionicLoading.show({template: "请输入验证码", noBackdrop: true, duration: 1000});
              return;
            }

            UserEdit.http($scope.msCode.value,$stateParams.id,$rootScope.userChooseRole).then(function (res) {
              console.log(res);
              if(res.code === '000000'){
                $ionicLoading.show({template: "修改成功", noBackdrop: true, duration: 1000});
                $ionicHistory.goBack(-1);
              }
            })

          }
        });
      };
      reloadUserMsgFunc();
      $scope.$on('$stateChangeSuccess', function (event, toState,toParams,from) {
        if(from.name == 'tab.UserMessageKindsChoose'){
          $scope.ownRoles = '';
          $rootScope.userChooseRole.forEach(function (arr, i) {
            if (arr == '100') {
              $scope.ownRoles += '管理员 ';
            };
            if (arr == '200') {
              $scope.ownRoles += '经办人 ';
            };
            if (arr == '300') {
              $scope.ownRoles += '复核人 ';
            };
            //if(arr == '400'){
            //  $rootScope.userChooseRole += '授权人 ';
            //}
          });
        }
      })
    })
  .controller('UserMessageKindsChooseCtrl', function ($scope,UserMessageDetail,$rootScope,$stateParams,$ionicHistory) {
    $scope.$on('$ionicView.enter', function () {

      $scope.guanLiYuan = {value:false};
      $scope.jingBanRen = {value:false};
      $scope.fuHeRen = {value:false};
    //UserMessageDetail.http($stateParams.id).then(function (res) {
    //  console.log(res.data);
    //  if(res.code === '000000'){
    //    $scope.corpRoleIdList = res.data.corpRoleIdList;
        $rootScope.userChooseRole.forEach(function (arr, i) {
          console.log(arr);
          if(arr == '100'){
            $scope.guanLiYuan.value = true;
          }
          if(arr == '200'){
            $scope.jingBanRen.value = true;
          }
          if(arr == '300'){
            $scope.fuHeRen.value = true;
          }
        })
    //  }
    //})
    $scope.guanLiYuanBtn = function () {
      $scope.guanLiYuan.value = !$scope.guanLiYuan.value;
    }
    $scope.jingBanRenBtn = function () {
      $scope.jingBanRen.value = !$scope.jingBanRen.value;
    }
    $scope.fuHeRenBtn = function () {
      $scope.fuHeRen.value = !$scope.fuHeRen.value;
    }
    $scope.userEditBtn = function () {
      console.log($rootScope.userChooseRole);
      $rootScope.userChooseRole = [];
      if($scope.guanLiYuan.value){
        $rootScope.userChooseRole.push('100');
      }
      if($scope.jingBanRen.value){
        $rootScope.userChooseRole.push('200');
      }
      if($scope.fuHeRen.value){
        $rootScope.userChooseRole.push('300');
      }
      $ionicHistory.goBack(-1);

    };
    })

  })
  .controller('PassworkResetCtrl', function ($scope,$stateParams,UserMessageDetail,$ionicLoading,UserUpdatePwd,$ionicHistory) {
    $scope.name = {value:''};
    $scope.idNo = {value:''};
    $scope.mobile = {value:''};

    UserMessageDetail.http($stateParams.id).then(function (res) {
      console.log(res);
      $scope.userInfo = res.data;
    })
    $scope.resetMakeSureBtn = function () {
      if($scope.name.value == '' || $scope.idNo.value == '' || $scope.mobile.value == ''){
        $ionicLoading.show({template: "内容不能为空", noBackdrop: true, duration: 1000});
        return;
      }
      if($scope.name.value != $scope.userInfo.usrNm){
        $ionicLoading.show({template: "姓名输入不正确", noBackdrop: true, duration: 1000});
        return;
      }
      if($scope.idNo.value != $scope.userInfo.idNo){
        $ionicLoading.show({template: "身份证输入不正确", noBackdrop: true, duration: 1000});
        return;
      }
      if($scope.mobile.value != $scope.userInfo.mobile){
        $ionicLoading.show({template: "电话号码输入不正确", noBackdrop: true, duration: 1000});
        return;
      }
      UserUpdatePwd.http($stateParams.id).then(function (res) {
        if(res.code === '000000'){
          $ionicLoading.show({template: "操作成功", noBackdrop: true, duration: 1000});
          $ionicHistory.goBack(-2);
        }else{
          $ionicLoading.show({template: "操作失败", noBackdrop: true, duration: 1000});
        }
      })
    }
  })
  //用户增加
  .controller('MineUserAddCtrl', function ($scope,$rootScope,$interval,getSmsCode,$ionicLoading,UserAdd) {
    $scope.usrNm ={value :''};
    $scope.idNo ={value :''};
    $scope.mobile ={value :''};
    $rootScope.userRoleChoose = [];
    $scope.$on('$ionicView.enter', function () {

      $scope.userRoleChooseWord = '';
      if($rootScope.userRoleChoose.length == 0){
        $scope.userRoleChooseWord = '无';
        $scope.rolesLength = false;//身份证隐藏
      }else{
        $scope.rolesLength = true;//身份证显示
        $rootScope.userRoleChoose.forEach(function (arr, i) {
          if(arr=='100'){
            $scope.userRoleChooseWord += '管理人 ';
          }
          if(arr=='200'){
            $scope.userRoleChooseWord += '经办人 ';
          }
          if(arr=='300'){
            $scope.userRoleChooseWord += '复核人 ';
          }
        })
      }

    });
    $scope.sendCodeWord = '发送验证码';
    $scope.mscode = {value:''};
    $scope.getCodeBtn = function () {
      //防止多次点击
      if ($scope.sendCodeWord != '发送验证码') {
        return;
      } else {
        //发送验证码
        getSmsCode.getsmscode("YH01").then(function (res) {
          console.log(res);
        })
        var count = 60;
        cint = $interval(function () {
          count--;
          $scope.sendCodeWord = count + 'S';
          if (count <= 0) {
            $interval.cancel(cint);
            $scope.sendCodeWord = "发送验证码";
          };
        }, 1000);
        //获取的验证码校验逻辑--------------------
      }
    }
    $scope.userAddBtn = function () {
    if($scope.usrNm.value == '' || $scope.idNo.value == '' || $scope.mobile.value == ''){
      $ionicLoading.show({template: "内容不能为空", noBackdrop: true, duration: 1000});
      return;
    }
      if($scope.mscode.value == ''){
        $ionicLoading.show({template: "验证码不能为空", noBackdrop: true, duration: 1000});
        return;
      }
      var idTyp = '0';
      //还缺三个参数
      UserAdd.http($scope.usrNm.value,idTyp,$scope.idNo.value,$scope.mobile.value,$scope.mscode.value,$rootScope.userRoleChoose).then(function (res) {
        console.log(res);
      })
    }
  })
  //用户增加-选择角色
  .controller('MineUserAddChooseRoleCtrl', function ($scope,$rootScope,$ionicHistory) {
    $scope.guanLiYuan = {value:false};
    $scope.fuHeRen = {value:false};
    $scope.jingBanRen = {value:false};
    //if($rootScope.userRoleChoose.length != 0){
    //  $rootScope.userRoleChoose.forEach(function (arr, i) {
    //    if(arr == '100'){
    //      $scope.guanLiYuan.value = true;
    //    }
    //    if(arr == '200'){
    //      $scope.jingBanRen.value = true;
    //    }
    //    if(arr == '300'){
    //      $scope.fuHeRen.value = true;
    //    }
    //  })
    //}
    $scope.userEditBtn = function () {
      $rootScope.userRoleChoose = [];
      console.log($scope.guanLiYuan.value, $scope.fuHeRen.value, $scope.jingBanRen.value);
      if($scope.guanLiYuan.value == true){
        $rootScope.userRoleChoose.push('100');
      }
      if($scope.fuHeRen.value == true){
        $rootScope.userRoleChoose.push('300');
      }
      if($scope.jingBanRen.value == true){
        $rootScope.userRoleChoose.push('200');
      }
      $ionicHistory.goBack(-1);
    }
  })
  //重置手机号码
  .controller('ResetPhoneNumberCtrl', function ($scope,getUserMsg,getSmsCode,$interval,CheckMobile,$state,$ionicLoading) {
    getUserMsg.http().then(function (res) {
      if(res.code === '000000'){
        $scope.mobile = res.data.mobile;
        $scope.msCode = {value:''};
        $scope.getMessageInfo = '发送验证码';
        $scope.getCodeBtn = function () {
          //防止多次点击
          if($scope.getMessageInfo != '发送验证码'){
            return;
          }else{
            //发送验证码
            var promise = getSmsCode.getsmscode("MM04");
            var count = 60;
            $scope.cint = $interval(function(){
              count--;
              $scope.getMessageInfo = count + 'S';
              if(count <= 0){
                $interval.cancel($scope.cint);
                $scope.getMessageInfo = "发送验证码";
              };
            },1000);
          }
        };
        $scope.toNextStepBtn = function(){

          CheckMobile.http($scope.mobile,$scope.msCode.value,'MM04').then(function (res) {
            console.log(res);
            if(res.code === '000000'){
              $ionicLoading.show({template: "身份校验成功", noBackdrop: true, duration: 1000});
              $state.go('tab.ResetPhoneOutside');
            }else{
              $ionicLoading.show({template: "校验错误", noBackdrop: true, duration: 1000});
            }
            $state.go('tab.ResetPhoneOutside');

          })
        }
      }
    })
  })
  //重置电话号码
  .controller('ResetPhoneOutsideCtrl', function ($scope,$interval,getSmsCode,$ionicLoading,$ionicHistory,ChangeMobile,OtgetSmsCode) {
    $scope.mobile = {value:''};
    $scope.msCode = {value:''};
    $scope.getMessageInfo = '发送验证码';
    $scope.getCodeBtn = function () {
      if($scope.mobile.value == ''){
        $ionicLoading.show({template: "请输入手机号", noBackdrop: true, duration: 1000});
        return;
      }
      //防止多次点击
      if($scope.getMessageInfo != '发送验证码'){
        return;
      }else{
        //发送验证码
        var promise = OtgetSmsCode.getsmscode("MM04",$scope.mobile.value);
        var count = 60;
        $scope.cint = $interval(function(){
          count--;
          $scope.getMessageInfo = count + 'S';
          if(count <= 0){
            $interval.cancel($scope.cint);
            $scope.getMessageInfo = "发送验证码";
          };
        },1000);
      }
    };
    $scope.toNextStepBtn = function () {
      if($scope.mobile.value == '' || $scope.msCode.value == ''){
        $ionicLoading.show({template: "请输入验证码或者手机号", noBackdrop: true, duration: 1000});
        return;
      }
      ChangeMobile.http($scope.mobile.value,$scope.msCode.value,'MM04').then(function (res) {
        console.log(res);
        if(res.code === '000000'){
          $ionicHistory.goBack(-2);
        }
      })
    }
  })
  //重置密码
  .controller('ResetPasswordCtrl', function ($scope,$ionicLoading,$interval,getSmsCode,ChangePassword,$ionicHistory) {
    $scope.oldPwd = {value:''};
    $scope.newPwd = {value:''};
    $scope.newPwdMakeSure = {value:''};
    $scope.msCode = {value:''};
    //发送验证码
    $scope.getMessageInfo = '发送验证码';
    $scope.getCodeBtn = function () {
      //防止多次点击
      if($scope.getMessageInfo != '发送验证码'){
        return;
      }else{
        //发送验证码
        var promise = getSmsCode.getsmscode("MM01");
        var count = 60;
        $scope.cint = $interval(function(){
          count--;
          $scope.getMessageInfo = count + 'S';
          if(count <= 0){
            $interval.cancel($scope.cint);
            $scope.getMessageInfo = "发送验证码";
          };
        },1000);
      }
    };
    //确定
    $scope.MakeSureBtn = function(){
      if($scope.oldPwd.value == ''){
        $ionicLoading.show({template: "原密码不能为空", noBackdrop: true, duration: 1000});
      }
      if($scope.newPwd.value == ''){
        $ionicLoading.show({template: "新密码不能为空", noBackdrop: true, duration: 1000});
      }
      if($scope.newPwdMakeSure.value == ''){
        $ionicLoading.show({template: "确认密码不能为空", noBackdrop: true, duration: 1000});
      }
      if($scope.msCode.value == ''){
        $ionicLoading.show({template: "验证码不能为空", noBackdrop: true, duration: 1000});
      }
      ChangePassword.http($scope.oldPwd.value,$scope.msCode.value,$scope.newPwd.value).then(function (res) {
        if(res.code === '000000'){
          $ionicHistory.goBack(-2);
          $ionicLoading.show({template: "操作成功", noBackdrop: true, duration: 1000});
        }else{
          $ionicLoading.show({template: "操作失败", noBackdrop: true, duration: 1000});
        }
      })
    }
  })


  // 使用帮助
  .controller('MineUseHelpCtrl',function($rootScope,$scope,QueryHelpList,$state,$ionicLoading){
      var pageSize = 10;
      $scope.inputTxt = {kw: ''};
      /*请求方法*/
      var load = function(pageNum,pageSize,title){
        QueryHelpList.http(pageNum,pageSize,title).then(function(res){
          if(res.code == '000000'){
            console.log(res.data);
            $scope.hlist = res.data.list;
          }else{
            $ionicLoading.show({template:res.message,noBackdrop: true, duration: 1000})
          }
        })
      };
      /*页面初次加载*/
      load(1,10,$scope.inputTxt.kw);
      /*跳转方法*/
      $scope.gotowhere = function(t,i){
        switch(t){
          case '1':/*文档*/
            $rootScope.help={};
            $rootScope.help.title = $scope.hlist[i].title;
            $rootScope.help.content = $scope.hlist[i].content;
            $state.go('tab.MineUseHelpDetail');
            break;
          case '2':/*链接*/
            location.href = $scope.hlist[i].url;
            break;
          case '3':/*图片*/
            break;
          case '4':/*文字*/
            $rootScope.help={};
            $rootScope.help.title = $scope.hlist[i].title;
            $rootScope.help.content = $scope.hlist[i].content;
            $state.go('tab.MineUseHelpDetail');
            break;
          case '5':/*视频*/
            break;
          default:location.href = 'https://www.baidu.com';
        }
      };
      /*关键词搜索*/
      $scope.$watch('inputTxt.kw',function(n,o){
        if(n.length > 0){
          load(1,pageSize,$scope.inputTxt.kw);
        }else{
          load(1,pageSize,$scope.inputTxt.kw);
        }
      })
  })
  // 使用帮助 详情信息
  .controller('MineusehelpdetailCtrl',function($scope,$rootScope){
      $scope.help = $rootScope.help;
  })
  // 提交尊贵建议
  .controller('DistinguishedAdviceCtrl',function($ionicPopup,$state,$scope,$ionicLoading,Adviceadd){
    $scope.my={};
    $scope.subbtn = function(){
      console.log($scope.my.advice);
      Adviceadd.http($scope.my.advice).then(function(res){
        if(res.code == '000000'){
          $ionicPopup.confirm({
            title: '提示',
            template: "您的意见已提交，返回设置",
            cancelText: "取消",
            cancelType: "button-gray",
            okText: '确定',
            okType: "button-positive"
          }).then(function(res){
            if(res){
              $scope.my.advice = "";
              $state.go('tab.MineSetting');
            }else{
              $scope.my.advice = "";
            }
          });
        }
      })
    }
  })
  // 意见历史查询
  .controller('AdviceHistoryCtrl',function($ionicPopup,$state,$scope,$ionicLoading,Advicequer,ToolService){
      $scope.cjs = ToolService;
      var pageSize = 10;
      /*请求方法*/
      var load = function(pageNum,pageSize){
        Advicequer.http(pageNum,pageSize).then(function(res){
          if(res.code == '000000'){
            console.log(res.data)
            if(pageNum == 1){
              $scope.alist = res.data.list;
            }else{

            }
          }else{
            $ionicLoading.show({template:res.message,noBackdrop: true, duration: 1000})
          }
        })
      };
      /*页面初次加载*/
      load(1,10);

  })
  //设置， 退出登录
  .controller('MineSettingCtrl',function($scope,$state,LoginOut,$location){
      $scope.loginout = function(){
        LoginOut.http().then(function(res){
          if(res.code == '000000'){
            window.localStorage.clear();
            //$state.go('login');
            $location.path('/login')
          }
        })
      }
      $scope.$on('$ionicView.beforeEnter', function() {
        if(!window.localStorage.isLogin){
          $state.go('login')
        }
      });
  })
  //产品版本
  .controller('ProductVersionsCtrl',function($scope,config){
    $scope.version= config.appVersion;
  })


;

