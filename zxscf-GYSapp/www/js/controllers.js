/**
 * Created by HHS on 2017/8/2.
 */
/* 主版块控制(包含登录、企业注册、忘记密码)，tab四栏版块控制(包含首页、融资、转让、我的) */
angular.module('zxscf.controllers', ['zxscf.controllers.home','zxscf.controllers.rongzi','zxscf.controllers.zrang','zxscf.controllers.mine'])
  // //公共
  .controller('InitCtrl',function($rootScope,$state,$ionicPopup,config,FileService,$cordovaStatusbar){
    $rootScope.jumpto=function(desPath,args){
      $state.go(desPath,args);
    };
    $rootScope.FileDownload = function (appNo,bussType,fileType,tnCode) {
      var confirmPopup = $ionicPopup.confirm({
        title: '提示',
        template: "您确定加载和预览此文件吗?",
        cancelText: "取消",
        cancelType: "button-gray",
        okText: '确定',
        okType: "button-positive"
      });
      confirmPopup.then(function(res) {
        if (res) {
          //console.log(config.envPath + config.httpInsertApi.CM1007 + '?' + 'appNo=' + appNo + '&bussType=' + bussType + '&fileType=' + fileType + '&tnCode=' + tnCode);
          FileService.openFile(config.envPath + config.httpInsertApi.CM1007 + '?' + 'appNo=' + appNo + '&bussType=' + bussType + '&fileType=' + fileType + '&tnCode=' + tnCode);
          //FileService.openFile("http://192.168.43.169:8080/esif-webapp/certificates/fileDownload?appNo=200220171009000092&bussType=20&fileType=MB06");
          //取消
        } else {
        }
      })
    };
    //最大到期日限定
    $rootScope.MaxDueDt = 3600;




  })
  //引导页
  .controller('NavSlideAppCtrl', function ($scope, $state, $ionicSlideBoxDelegate) {
    window.localStorage.setItem("isSlide", "seen");
    $scope.startApp = function () {
      $state.go('login');
    }
  })
  //首页登录
  .controller('LoginCtrl', function (OtgetSmsCode,$scope,Login,$ionicLoading,$ionicPopup,$state){
    if (window.localStorage.getItem("isSlide") === null) {
      $state.go('NavSlideApp');
    };
    $scope.user = {
      username:'15802575333',// 18576759368
      password:''
    };
    //验证码输入次数错误三次记录
    var vertityTyp = 0;
    $scope.active = false;
    $scope.LoginBtn = function () {
      //alert(window.localStorage.getItem('RegistrationID'))

      if ($scope.user.username == undefined || $scope.user.username == "" || $scope.user.password == "") {
        $ionicLoading.show({template: '账号或密码不能为空!', noBackdrop: true, duration:1000});
      } else {
        //$state.go('tab.home');
        var num = $scope.user.username;
        var pwd = $scope.user.password;

        var promise = Login.toLogin(num,pwd,vertityTyp,$scope.user.yanzhengma);
        //成功登陆
        promise.then(function (res) {
          //$state.go('tab.home');
          //登录成功基本信息缓存设置
          console.log(res);
           if(res.code == "000000"){
             console.log(res);
             //存储
             var userData = {
               usrNm:res.data.usrNm,
               usrCd:res.data.usrCd,
               custCnNm:res.data.custCnNm,
               custNo:res.data.custNo,
               sid:res.data.sid
             };
             var userDataStr = JSON.stringify(userData);
             window.localStorage.setItem('sid',res.data.sid);
             window.localStorage.setItem('user',userDataStr);
             window.localStorage.setItem('isLogin',"true");
             $state.go('tab.home');
          }else if(res.code == "160004"){
             $ionicLoading.show({template: '用户名或密码错误!', noBackdrop: true, duration:1000});
           }else if(res.code == "160011"){
             $scope.active = true;
             vertityTyp="3";
             $ionicLoading.show({template: '用户名或密码连续错误3次,请输入验证码!', noBackdrop: true, duration:1000});
           }else if(res.code == "150005"){
            $ionicLoading.show({template: '服务器异常,请稍后重试!', noBackdrop: true, duration:1000});
           }else{
             $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
           }
        });
      }
    };

      /*获取验证码*/
      $scope.code = function(){
        //console.log('1')
        OtgetSmsCode.getsmscode('DL01',$scope.user.username);
      }

  })
  // 忘记密码
  .controller('ResetpasswordCtrl',function($interval,$scope,$state,$ionicLoading,$ionicPopup,OtgetSmsCode,ResetPwd){
    $scope.changepwd={};
    $scope.codeinfo = '获取验证码';
    var cint = '';
    /*获取短信验证码*/
    $scope.getmsgcode=function(){
      var phone=$scope.changepwd.username;
      if(!(/^1[34578]\d{9}$/.test(phone))){
        $ionicLoading.show({template: '请输入正确的手机号码!', noBackdrop: true, duration:1000});
        return;
      }
      if($scope.codeinfo == '获取验证码'){
        $scope.ss = 120;
        OtgetSmsCode.getsmscode('MM03',phone);
        cint = $interval(function(){
          $scope.ss--;
          $scope.codeinfo = $scope.ss-- + 's';
          if($scope.ss <= 0){
            $interval.cancel(cint);
            $scope.codeinfo = "获取验证码";
          }
        },1000);
      }
    };
      /*看见密码*/
      $scope.isseeA = false;
      $scope.isseeB = false;
      $scope.seepwdA = function(){
        $scope.isseeA = !$scope.isseeA;
        if($scope.isseeA){
          document.getElementById("inputA").setAttribute('type','number')
        }else{
          document.getElementById("inputA").setAttribute('type','password')
        }
      };
      $scope.seepwdB = function(){
        $scope.isseeB = !$scope.isseeB;
        if($scope.isseeB){
          document.getElementById("inputB").setAttribute('type','number')
        }else{
          document.getElementById("inputB").setAttribute('type','password')
        }
      };
    $scope.rest=function(){
      var phone=$scope.changepwd.username;
      var password=$scope.changepwd.newpwd;
      var cifpwd=$scope.changepwd.confirmpwd;
      var msgcode=$scope.changepwd.msgcode;
      if(password !== cifpwd){
        $ionicLoading.show({template:'前面密码输入不一致，请重新输入!', noBackdrop: true, duration:1000});
        return;
      }
      //console.log(phone,password,cifpwd,msgcode);
      var promise = ResetPwd.resetpwd(phone,password,cifpwd,msgcode);
      promise.then(
        function(res){
          if(res.code=='000000'){
            $ionicLoading.show({template: '修改密码成功,请登入!', noBackdrop: true, duration:1000});
            $state.go('login');
          }else{
            $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
          }
        }
      ).catch()
    }
  })
  //   注册一
  .controller('CompanyRegister1Ctrl',function($ionicLoading,GetDictByNo,$state,GetArea,$ionicModal,$rootScope,$scope,$ionicActionSheet,$cordovaCamera,$ionicPopup,CheckCorInfo,FileService,$cordovaImagePicker){
    $scope.chooseCardType="请选择证件类型";
    $scope.companyInfo={};//提交注册
    $scope.imgData={};
    $scope.imgData.imgSrcOri = './img/icon2.x/zhizao-zhengmian.png';
    $scope.imgData.imgSrcCop = './img/icon2.x/zhizao-fanmian.png';

      var ii = [];
      /*数据字典*/
      var p = GetDictByNo.http('900003',1,10).then(function(res){
        if(res.code == '000000'){
          $scope.item = res.data.list;
          $scope.item.forEach(function (arr,i) {
            ii.push({text:arr.dataName});
          });
        }
      });

    //弹出选择证件类型
    $scope.show=function(){
      $ionicActionSheet.show({
        buttons:ii,
        titleText: '请选择证件类型',
        //cancelText: 'Cancel',
        buttonClicked:function(index){
          $scope.chooseCardType = $scope.item[index].dataName;

          $scope.companyInfo.idTyp = $scope.item[index].dataNo;
          return true;
        }
      })
    };
    //调用相机和图库
    $scope.picture=function(taskID){
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
            case 0:$scope.takePhoto(taskID); break;
            case 1:$scope.pickImage(taskID); break;
            default : break;
          }
          return true;
        }
      })
    };
    // 调用相机
    $scope.takePhoto=function(taskID){
      navigator.camera.getPicture(function (imgUrl) {
        if(taskID==0){
          $scope.imgData.imgSrcOri=imgUrl;
          window.resolveLocalFileSystemURL(imgUrl, function(fileEntry) {
            fileEntry.file(function(file) {
              $scope.companyInfo.attachDivOri=file;
            });
          });
        }else if(taskID==1){
          $scope.imgData.imgSrcCop=imgUrl;
          window.resolveLocalFileSystemURL(imgUrl, function(fileEntry) {
            fileEntry.file(function(file) {
              $scope.companyInfo.attachDivCop=file;
            });
          });
        }
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
      // $cordovaCamera.getPicture(options).then(function(imgData){
      //     var image="";
      //     if(taskID==0){
      //       $scope.isImage0=false;
      //       $scope.imgSrcOri="data:image/jpeg;base64,"+imgData;
      //       // image=document.querySelector('#get_picture_card .reg1_proscard');
      //       // image.setAttribute("src","data:image/jpeg;base64,"+imgData);
      //       // 转换为实体文件对象
      //       window.resolveLocalFileSystemURL(imgData, function(fileEntry) {
      //         $scope.companyInfo.attachDivOri=fileEntry;
      //         alert(JSON.stringify(fileEntry));
      //         // fileEntry.file(function(file) {
      //         //   var reader = new FileReader();
      //         //   reader.onloadend = function(ev) {
      //         //     $scope.$apply(function () {
      //         //       $scope.fileImage.attachOriImage=ev.target.result;
      //         //     });
      //         //   };
      //         // });
      //       });
      //       $scope.proscard=imageUri
      //     }else if(taskID==1){
      //       $scope.isImage1=false;
      //       $scope.imgSrcCop="data:image/jpeg;base64,"+imgData;
      //       // image=document.querySelector('#get_picture_card .reg1_conscard');
      //       // image.setAttribute("src","data:image/jpeg;base64,"+imageUri);
      //       // $scope.conscard=imageUri
      //       window.resolveLocalFileSystemURL(imgData, function(fileEntry) {
      //         $scope.companyInfo.attachDivCop=fileEntry;
      //         alert(JSON.stringify(fileEntry));
      //         // fileEntry.file(function(file) {
      //         //   var reader = new FileReader();
      //         //   reader.onloadend = function(ev) {
      //         //     $scope.$apply(function () {
      //         //       $scope.fileImage.attachOriImage=ev.target.result;
      //         //     });
      //         //   };
      //         // });
      //       });
      //     }
      //     // FileService.upLoadFile(imageUri,config.httpInsertApi.ZC1001,function(){
      //     //   $ionicPopup.alert({
      //     //     title:"温馨提示",
      //     //     template:"<p class='text-center'>"+'设置成功'+"</p>",
      //     //     buttons:[{
      //     //       text:'确定',
      //     //       type:'button-positive'
      //     //     }]
      //     //   });
      //     // });
      //   },function(err){
      //     $ionicPopup.alert({
      //       title:"提示",
      //       template:"<div class='text-center'>"+err.message+"</div>",
      //       buttons:[{
      //         text:'确定',
      //         type:'button-positive'
      //       }]
      //     });
      // });
    };
    // 选择图库
    $scope.pickImage=function(taskID){
      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
      };
      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
              if(taskID==0){
                $scope.imgData.imgSrcOri=results[0];
                // 转换为实体文件对象
                // window.resolveLocalFileSystemURL(results[0], function(fileEntry) {
                //   fileEntry.file(function (file) {
                //     // $scope.companyInfo.attachDivOri=file;
                //     alert(1312);
                //     alert(JSON.stringify(file));
                //     var reader = new FileReader();
                //     reader.onloadend = function(e) {
                //       alert('read ...');
                //       // $scope.companyInfo.attachDivOri=new File(new Blob([e.target.result],{type: file.type}),file.name);
                //       var the_file = new Blob([e.target.result],{type: file.type});
                //       formData.append("attachDivOri",the_file);
                //       alert(JSON.stringify(the_file));
                //       alert('read end...');
                //     };
                //     reader.readAsArrayBuffer(file);
                //   });
                // });
              }
              else if(taskID==1){
                $scope.imgData.imgSrcCop=results[0];
                // window.resolveLocalFileSystemURL(results[0], function(fileEntry) {
                //   fileEntry.file(function(file) {
                //     // $scope.companyInfo.attachDivCop=file;
                //     var reader = new FileReader();
                //     reader.onloadend = function(e) {
                //       // $scope.companyInfo.attachDivCop=new File(new Blob([e.target.result],{type: file.type}),file.name);
                //       var the_file=new Blob([e.target.result],{type: file.type});
                //       formData.append("attachDivCop",the_file);
                //     };
                //     reader.readAsArrayBuffer(file);
                //   });
                // });
              };
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

      // alert('调用图库');
      // var options={
      //   quality:100,
      //   destinationType: Camera.DestinationType.DATA_URL,
      //   sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      //   allowEdit: false,
      //   encodingType: Camera.EncodingType.JPEG,
      //   targetWidth: 120,
      //   targetHeight: 90,
      //   mediaType: 0,
      //   cameraDirection: 0,
      //   popoverOptions: CameraPopoverOptions,
      //   saveToPhotoAlbum: true,
      //   correctOrientation:true
      // };
      // $cordovaCamera.getPicture(options).then(function(imageData){
      //     var image="";
      //     if(taskID==0){
      //       $scope.isImage0=false;
      //       image=document.querySelector('#get_picture_card .reg1_proscard');
      //       image.setAttribute("src","data:image/jpeg;base64,"+imageData);
      //       // $scope.proscard=imageData
      //       alert('开始转换');
      //       alert(typeof (imageData));
      //       alert(imageData);
      //       window.resolveLocalFileSystemURL(imageData, function(fileEntry) {
      //         alert('选择图库 z');
      //         alert(typeof (fileEntry));
      //         $scope.proscard=fileEntry
      //       },function(err){
      //         alert('错误 z');
      //         alert(err.message);
      //       });
      //     }else if(taskID==1){
      //       $scope.isImage1=false;
      //       image=document.querySelector('#get_picture_card .reg1_conscard');
      //       image.setAttribute("src","data:image/jpeg;base64,"+imageData);
      //       // $scope.conscard=imageData
      //       alert(imageData);
      //       window.resolveLocalFileSystemURL(imageData, function(fileEntry) {
      //         alert('选择图库 f');
      //         alert(typeof (fileEntry));
      //         $scope.conscard=fileEntry
      //       },function(err){
      //         alert('错误 z');
      //         alert(err.message);
      //       });
      //     }
      //   },function(err){
      //     $ionicPopup.alert({
      //       title:"提示",
      //       template:"<div class='text-center'>"+err.message+"</div>",
      //       buttons:[{
      //         text:'确定',
      //         type:'button-positive'
      //       }]
      //     });
      //   }
      // );

    };
    /*城市查询*/
    $scope.isshow = true;
    $scope.citys = function(){
      $scope.isshow = true;
      var promise = GetArea.http();
      promise.then(
        function(res){
          $scope.provLists = res.data.list;
          $scope.modal.show()
        }
      ).catch()
    };
    $ionicModal.fromTemplateUrl('template/modal-citylists.html',{scope:$scope}).then(
      function(modal){
        $scope.modal = modal;
      }
    );
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
      ).catch()
    };
    $scope.checkcity = function(city){
      $scope.chocity = city;
    };
    /*确定*/
    $scope.closemodal = function(){
      $scope.modal.hide();
      if($scope.choprov && $scope.chocity){
        $scope.provcity = $scope.choprov + $scope.chocity;
      }
      $scope.companyInfo.regAdrProv = $scope.choprov;
      $scope.companyInfo.regAdrCity = $scope.chocity
    };
    /**/
    // function imgFile(file) {
    //   var reader = new FileReader();
    //   $scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
    //   reader.onload = function (ev) {
    //     $scope.$apply(function () {
    //       $scope.thumb.push(ev.target.result);
    //     });
    //   };
    //   reader.readAsDataURL(file);  //FileReader的方法，把图片转成base64
    // }
    $scope.fileImage={};
    $scope.fileImage.attachOriImage = './img/icon2.x/zhizao-zhengmian.png';
    $scope.fileImage.attachCopImage = './img/icon2.x/zhizao-fanmian.png';
    $scope.fileChanged=function(file){
      var reader = new FileReader();
      reader.readAsDataURL(file.files[0]);
      if(file.id == "fileOri"){
        $scope.companyInfo.attachDivOri=file.files[0];
        reader.onload = function (ev) {
          $scope.$apply(function () {
            $scope.fileImage.attachOriImage=ev.target.result;
          });
        };
      }else{
        $scope.companyInfo.attachDivCop=file.files[0];
        reader.onload = function (ev) {
          $scope.$apply(function () {
            $scope.fileImage.attachCopImage=ev.target.result;
          });
        };
      }
    };


    $scope.nextAndreg=function(){
      var files=[
        {
          fileKey:"attachDivOri",
          filePath:$scope.imgData.imgSrcOri
        },
        {
          fileKey:"attachDivCop",
          filePath:$scope.imgData.imgSrcCop
        }
      ];
     CheckCorInfo.regcorInfo({
       files:files,
       params:$scope.companyInfo
     }).then(function(res) {
           if (res.code == '000000') {
             $rootScope.idTyp = $scope.companyInfo.idTyp;
             $rootScope.idNo = $scope.companyInfo.idNo;
             $rootScope.CnNm = $scope.companyInfo.custCnNm;
             $rootScope.addr = $scope.provcity + $scope.companyInfo.regAdr;
             $state.go('register2')
           } else {
             $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
           }
        }
      )
    };
    //载入网络文件并预览
    $scope.fileLoad=function(){
      FileService.openFile("http://119.23.38.230:28080/esif-webapp/current/viewAttach?id=2");
    };
  })

  //  法人信息
  .controller('Register2Ctrl',function($ionicLoading,$cordovaImagePicker,GetDictByNo,$ionicModal,$scope,$rootScope,$ionicActionSheet,CorpInfo,$cordovaCamera,FileService,$ionicPopup,$state){
    $scope.chooseCardType = '请选择证件类型';
    $scope.companyInfo = {};
    $scope.imgData={};
    $scope.imgData.attachDivFront = './img/icon2.x/zhizao-zhengmian.png';
    $scope.imgData.attachDivBack = './img/icon2.x/zhizao-fanmian.png';

      var ii = [];
      /*数据字典*/
      GetDictByNo.http('900004',1,10).then(function(res){
        if(res.code == '000000'){
          $scope.item = res.data.list;
        }
        $scope.item.forEach(function (arr,i) {
          ii.push({text:arr.dataName});
        });
      });
      /*选择证件类型*/
      $scope.show=function(){
        $ionicActionSheet.show({
          buttons: ii ,
          titleText: '请选择证件类型',
          //cancelText: 'Cancel',
          buttonClicked:function(index){
            $scope.chooseCardType = $scope.item[index].dataName;
            $scope.companyInfo.lglIdType = $scope.item[index].dataNo;
            return true;
          }
        })
      };

      /*获取图片路径和对象*/
      $scope.fileImage={};
      $scope.fileImage.attachDivFront = './img/icon2.x/zhizao-zhengmian.png';
      $scope.fileImage.attachDivBack = './img/icon2.x/zhizao-fanmian.png';
      $scope.fileChanged=function(file){
        var reader = new FileReader();
        reader.readAsDataURL(file.files[0]);
        if(file.id == "fileA"){
          $scope.companyInfo.attachDivFront=file.files[0];
          reader.onload = function (ev) {
            $scope.$apply(function () {
              $scope.fileImage.attachDivFront=ev.target.result;
            });
          };
        }else{
          $scope.companyInfo.attachDivBack=file.files[0];
          reader.onload = function (ev) {
            $scope.$apply(function () {
              $scope.fileImage.attachDivBack=ev.target.result;
            });
          };
        }
      };

      /*调用相机和图库*/
      $scope.picture=function(taskID){
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
              case 0:$scope.takePhoto(taskID); break;
              case 1:$scope.pickImage(taskID); break;
              default : break;
            }
            return true;
          }
        })
      };

      /*相机*/
      $scope.takePhoto = function(taskID){
        navigator.camera.getPicture(function (imgUrl) {
          if(taskID==0){
            $scope.imgData.attachDivFront=imgUrl;
            window.resolveLocalFileSystemURL(imgUrl, function(fileEntry) {
              fileEntry.file(function(file) {
                $scope.companyInfo.attachDivFront=file;
              });
            });
          }else if(taskID==1){
            $scope.imgData.attachDivBack=imgUrl;
            window.resolveLocalFileSystemURL(imgUrl, function(fileEntry) {
              fileEntry.file(function(file) {
                $scope.companyInfo.attachDivBack=file;
              });
            });
          }
        },function(err){
          $ionicPopup.alert({
            title:"提示",
            template:"<div class='text-center'>"+err.message+"</div>",
            buttons:[{
              text:'确定',
              type:'button-positive'
            }]
          });
        })
      };
      /*选择图库*/
      $scope.pickImage = function(taskID){
        var options = {
          maximumImagesCount: 1,
          width: 800,
          height: 800,
          quality: 80
        };
        $cordovaImagePicker.getPictures(options).then(function(resullts){
          if(taskID == 0){
            $scope.imgData.attachDivFront=resullts[0];
          }else if(taskID == 1){
            $scope.imgData.attachDivBack=resullts[0];
          }
        },function(err){
          $ionicPopup.alert({
            title:"提示",
            template:"<div class='text-center'>"+err.message+"</div>",
            buttons:[{
              text:'确定',
              type:'button-positive'
            }]
          });
        })

      };


    /*提交*/
    $scope.regnext = function(){

      $rootScope.faren = $scope.companyInfo.lglPerNm;//法人
      $rootScope.farenlglIdType = $scope.companyInfo.lglIdType;//法人证件类型
      $rootScope.farenlglIdNo = $scope.companyInfo.lglIdNo;//法人证件号码
      $rootScope.farenphone = $scope.farenphone;//法人联系电话
      $scope.companyInfo.idTyp = $rootScope.idTyp;//企业证件类型
      $scope.companyInfo.idNo = $rootScope.idNo; //企业证件号码

      var files=[
        {
          fileKey:"attachDivFront",
          filePath:$scope.imgData.attachDivFront
        },
        {
          fileKey:"attachDivBack",
          filePath:$scope.imgData.attachDivBack
        }
      ];
      CorpInfo.regcorInfo({
        files:files,
        params:$scope.companyInfo
      }).then(function(res){
        if(res.code == '000000'){
          $state.go('register3')
        }else{
          $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
        }
      })
    };


  })


  //  企业注册-管理员信息
  .controller('Register3Ctrl',function($interval,$cordovaImagePicker,$ionicLoading,FileService,config,$ionicModal,RegUser,$rootScope,OtgetSmsCode,UserInfo,$scope,$state,$ionicActionSheet,$cordovaCamera,$ionicPopup){
    $scope.newadmin=false;
    $scope.companyInfo = {};
    $scope.imgData={};
    $scope.imgData.attachDivFront = './img/icon2.x/ID-fanmian.png';
    $scope.imgData.attachDivBack = './img/icon2.x/ID-zhengmian.png';
    $scope.imgData.attachDivPoa = './img/index/Photo2@2x.png';
    $scope.agree = false;
    $scope.isagree = function(){
      $scope.agree = !$scope.agree
    };

      /*异步请求确认新旧管理员*/
      var reg = /1(\d{2})\d{4}(\d{4})/g;
      $scope.blur = function(){
        if($scope.companyInfo.usrNm && $scope.companyInfo.userIdNo){
          RegUser.http($scope.companyInfo.usrNm,$scope.companyInfo.userIdNo).then(function(res){
            if(res.code == '000000'){
              if(res.data.mobileNo){
                $scope.newadmin=false;
                $scope.adress = res.data.rAddress;
                $scope.companyInfo.usrCd = res.data.mobileNo.replace(reg,"1$1****$2");
              }else{
                $scope.newadmin=true;
              }
            }else{
              $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
            }
          })
        }
      };

      /*查看协议*/
      $rootScope.xieyi = {};
      $scope.seexieyi = function(){
        $rootScope.xieyi.user = $rootScope.CnNm;
        $rootScope.xieyi.faren = $rootScope.faren;
        $rootScope.xieyi.addr = $rootScope.addr;
        $rootScope.xieyi.connc = $scope.companyInfo.usrNm;
        $rootScope.xieyi.email = $scope.companyInfo.email;
        $rootScope.xieyi.phone = $scope.companyInfo.usrCd;

        $state.go('register3-xieyi')
      };

      /*短信接口*/
      $scope.codeinfo = '获取验证码';
      var cint = "";
      $scope.getcode = function(){
        if($scope.codeinfo == '获取验证码'){
          OtgetSmsCode.getsmscode('ZC01',$scope.companyInfo.usrCd);
          $scope.ss = 120;
          cint = $interval(function(){
            $scope.ss--;
            $scope.codeinfo = $scope.ss-- + 's';
            if($scope.ss <= 0){
              $interval.cancel(cint);
              $scope.codeinfo = "发送验证码";
            }
          },1000);
        }
      };

      /*file方式*/
      $scope.fileImage={};
      $scope.fileImage.attachDivFront = './img/icon2.x/ID-fanmian.png';
      $scope.fileImage.attachDivBack = './img/icon2.x/ID-zhengmian.png';
      $scope.fileImage.attachDivPoa = './img/icon2.x/ID-zhengmian.png';
      $scope.fileChanged=function(file){
        var reader = new FileReader();
        reader.readAsDataURL(file.files[0]);
        if(file.id == "fileA"){
          $scope.companyInfo.attachDivFront=file.files[0];
          reader.onload = function (ev) {
            $scope.$apply(function () {
              $scope.fileImage.attachDivFront=ev.target.result;
            });
          };
        }else if(file.id == "fileB" ){
          $scope.companyInfo.attachDivBack=file.files[0];
          reader.onload = function (ev) {
            $scope.$apply(function () {
              $scope.fileImage.attachDivBack=ev.target.result;
            });
          };
        }else if(file.id == 'fileC'){
          $scope.companyInfo.attachDivPoa=file.files[0];
          reader.onload = function (ev) {
            $scope.$apply(function () {
              $scope.fileImage.attachDivPoa=ev.target.result;
            });
          };
        }
      };

      /*选择相机或者从手机相册选择*/
      $scope.picture=function(taskID){
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
              case 0:$scope.takePhoto(taskID); break;
              case 1:$scope.pickImage(taskID); break;
              default : break;
            }
            return true;
          }
        })
      };

      $scope.takePhoto = function(taskID){
        navigator.camera.getPicture(function (imgUrl) {
          if(taskID==0){
            $scope.imgData.attachDivFront=imgUrl;
            window.resolveLocalFileSystemURL(imgUrl, function(fileEntry) {
              fileEntry.file(function(file) {
                $scope.companyInfo.attachDivFront=file;
              });
            });
          }else if(taskID==1){
            $scope.imgData.attachDivBack=imgUrl;
            window.resolveLocalFileSystemURL(imgUrl, function(fileEntry) {
              fileEntry.file(function(file) {
                $scope.companyInfo.attachDivBack=file;
              });
            });
          }else if(taskID==2){
            $scope.imgData.attachDivPoa=imgUrl;
            window.resolveLocalFileSystemURL(imgUrl, function(fileEntry) {
              fileEntry.file(function(file) {
                $scope.companyInfo.attachDivPoa=file;
              });
            });
          }
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
      /*选择图库*/
      $scope.pickImage = function(taskID){
        var options = {
          maximumImagesCount: 1,
          width: 800,
          height: 800,
          quality: 80
        };
        $cordovaImagePicker.getPictures(options).then(function(results){
          if(taskID==0){
            $scope.imgData.attachDivFront=results[0];
          }else if(taskID==1){
            $scope.imgData.attachDivBack=results[0];
          }else if(taskID==2){
            $scope.imgData.attachDivPoa=results[0];
          }
        },function (err) {
          $ionicPopup.alert({
            title:"提示",
            template:"<div class='text-center'>"+err.message+"</div>",
            buttons:[{
              text:'确定',
              type:'button-positive'
            }]
          });
        })
      };


    /*注册*/
    $scope.regnext = function(){
      $scope.companyInfo.mobileNo = $scope.companyInfo.usrCd;
      $scope.companyInfo.userIdTyp = '0';
      $scope.companyInfo.idTyp = $rootScope.idTyp;
      $scope.companyInfo.idNo = $rootScope.idNo;
      if($scope.newadmin){$scope.companyInfo.isRepeat = 'N'}else{$scope.companyInfo.isRepeat = 'Y'};
      if($scope.agree){$scope.companyInfo.agree = 'Y'}else{$scope.companyInfo.agree = 'N'};
      var files=[
        {
          fileKey:"attachDivFront",
          filePath:$scope.imgData.attachDivFront
        },
        {
          fileKey:"attachDivBack",
          filePath:$scope.imgData.attachDivBack
        },
        {
          fileKey:"attachDivPoa",
          filePath:$scope.imgData.attachDivPoa
        }
      ];

      UserInfo.regcorInfo({
        files:files,
        params:$scope.companyInfo
      }).then(function(res){
        if(res.code == '000000'){
          $state.go('registersuccess');
        }else{
          $ionicLoading.show({template: res.message, noBackdrop: true, duration:1000});
        }
      })
    };

      /*委托书pdf*/
      var tnCode = '1';
      var bussType = 'MB02';
      var username = $rootScope.faren;//法人姓名
      var idType = $rootScope.farenlglIdTypen;//法人证件类型
      var cardNo = $rootScope.farenlglIdNo;//法人证件号码
      var mobile = $rootScope.farenphon;//法人电话号码
      var rUsername = $scope.companyInfo.usrNm;//被授权人姓名
      var rCardNo = $scope.companyInfo.userIdNo;//被授权人证件号码
      var rMobile = $scope.companyInfo.usrCd;//被授权人电话号码
      var rAddress = "";//被授权人地址
      if($scope.newadmin){rAddress = $scope.companyInfo.adminaddress}else{rAddress = $scope.adress}

      $scope.downpdf = function(){
        var confirmPopup = $ionicPopup.confirm({
          title: '提示',
          template: "您确定加载和预览此文件吗?",
          cancelText: "取消",
          cancelType: "button-gray",
          okText: '确定',
          okType: "button-positive"
        });
        confirmPopup.then(function(res){
          if(res){
            FileService.openFile(config.envPath + config.httpInsertApi.CM1009 + '?' + 'tnCode=' + tnCode + '&bussType=' + bussType
            + '&username=' + username + '&cardNo=' + cardNo + '&mobile=' + mobile + '&rUsername=' + rUsername + '&rCardNo=' + rCardNo
            + '&rMobile=' + rMobile + '&rAddress=' + rAddress + '&idType=' + idType);
            //console.log(config.envPath + config.httpInsertApi.CM1009 + '?' + 'tnCode=' + tnCode + '&bussType=' + bussType + '&usrId=' + usrId + '&rUsrId=' + rUsrId);
          }
        })

      }

  })

    .controller('Register3XieyiCtrl',function($scope,$rootScope){
      $scope.xieyi = $rootScope.xieyi;
      //console.log($rootScope.xieyi)
    })

  // 页面加载富文本
  .controller('PageBrowserCtrl',function($scope,$stateParams,$sce) {
    console.log($stateParams.browser);
    $scope.browser = {
      title: $stateParams.browser.title,
      src:$sce.trustAsResourceUrl($stateParams.browser.src)
    };
  });
