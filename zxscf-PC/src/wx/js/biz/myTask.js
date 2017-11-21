  var scrNum=1; //第一页
  var total;//总条数
  var tabOptions=1;//选项卡id
  taskLoadData(1,10,'0010_600001');//默认加载
  var loadFlag = true;
  var oi = 0;
  var mySwiper = new Swiper('.swiper-container',{
    direction: 'vertical',
    scrollbar: '.swiper-scrollbar',
    slidesPerView: 'auto',
    mousewheelControl: true,
    freeMode: true,
    onTouchMove: function(swiper){    //手动滑动中触发
      var _viewHeight = document.getElementsByClassName('swiper-wrapper')[0].offsetHeight;
      var _contentHeight = document.getElementsByClassName('swiper-slide')[0].offsetHeight;
      if(mySwiper.translate < 50 && mySwiper.translate > 0) {
        $(".init-loading").html('下拉刷新...').show();
        console.log(mySwiper.translate);
      }else if(mySwiper.translate > 50 ){
        $(".init-loading").html('释放刷新...').show();
      }
    },
    onTouchEnd: function(swiper) {
      var _viewHeight = document.getElementsByClassName('swiper-wrapper')[0].offsetHeight;
      var _contentHeight = document.getElementsByClassName('swiper-slide')[0].offsetHeight;
             // 上拉加载
             if(mySwiper.translate <= _viewHeight - _contentHeight - 50 && mySwiper.translate < 0) {

              if(loadFlag){
                $(".loadtip").html('正在加载...');
              }else{
                $(".loadtip").html('没有更多啦！');
              }
              setTimeout(function() {
                /*------------------*/
                if(Math.ceil(total/10)>= scrNum){
                  scrNum++;
                  if(tabOptions==1){
                    taskLoadData(scrNum,10,'0010_600001');
                    $(this).html("加载更多");
                  }else if(tabOptions==2){
                    taskLoadData(scrNum,10,'0030_600001');
                    $(this).html("加载更多");
                  }else if(tabOptions==3){
                    taskLoadData(scrNum,10,'0020_600003');
                    $(this).html("加载更多");
                  }
                }else{
                  $(".loadtip").html("没有更多啦！");
                  setTimeout(function(){
                    $(".loadtip").hide();
                  },500);
                }
                //console.log(scrNum);
                /*---------------------------*/
                $(".loadtip").html('上拉加载更多...');
                    mySwiper.update(); // 重新计算高度;
                  }, 800);
            }
            // 下拉刷新
            if(mySwiper.translate >= 50) {
              $(".init-loading").html('正在刷新...').show();
              $(".loadtip").html('上拉加载更多');
              loadFlag = true;

              setTimeout(function() {
                $(".refreshtip").show(0);
                $(".init-loading").html('刷新成功！');
                setTimeout(function(){
                  $(".init-loading").html('').hide();
                },800);
                $(".loadtip").show(0);
                if(tabOptions==1){
                  taskLoadData(1,10,'0010_600001');
                }else if(tabOptions==2){
                  taskLoadData(1,10,'0030_600001');
                }else if(tabOptions==3){
                  taskLoadData(1,10,'0020_600003');
                }
                    //刷新操作
                    mySwiper.update(); // 重新计算高度;
                  }, 1000);
            }else if(mySwiper.translate >= 0 && mySwiper.translate < 50){
              $(".init-loading").html('').hide();
            }
            return false;
          }
        });
  var mySwiper2 = new Swiper('.swiper-container2',{
    onTransitionEnd: function(swiper){
      $('.swiperWdt').css('transform', 'translate3d(0px, 0px, 0px)')
      $('.swiper-container2 .swiper-slide-active').css('height','auto').siblings('.swiper-slide').css('height','0px');
      mySwiper.update();
      $('.tab a').eq(mySwiper2.activeIndex).addClass('active').siblings('a').removeClass('active');
    }
    
  });
  $('.tab a').click(function(){
    var that=this;
    tabOptions=$(that).attr("data-id");
    $(this).addClass('active').siblings('a').removeClass('active');
    mySwiper2.slideTo($(this).index(), 500, false)
    $('.w').css('transform', 'translate3d(0px, 0px, 0px)')
    $('.swiper-container2 .swiper-slide-active').css('height','auto').siblings('.swiper-slide').css('height','0px');
    mySwiper.update();
    //-----切换执行-----
    if(tabOptions == 1){
      taskLoadData(1,10,'0010_600001');
    }
    else if(tabOptions == 2){
      taskLoadData(1,10,'0030_600001');
    }else if(tabOptions == 3){
      taskLoadData(1,10,'0020_600003');
    }
    //--------------
  });
  //执行的方法
  function taskLoadData(pageNum,pageSize,url){
    $(window).IFSAjax({
      code:url,
      method:"POST",
      data:{openId:openId,pageNum:pageNum,pageSize:pageSize},
      async:true,
      complete:function(result){
        if(result.code=IFSConfig.resultCode){
          //签收
          if(url=='0010_600001'){
            total=result.data.total;
            signforSuccessFun(result.data);
          }else if(url=='0030_600001'){
          //转让
          total=result.data.total;
          transfersuccessFun(result.data);
        }else if(url=='0020_600003'){
          //融资审核
          total=result.data.total;
          console.log(total);
          financesuccessFun(result.data);
        }
        if(total==0){
          $(".noDataTip").show();
          $(".refreshtip").hide();
          $(".loadtip").hide();
        }else{
          $(".noDataTip").hide();
        }
      }else{
        pluginObj.alert(IFSCommonMethod.getErrorMsg(result.message));
      }
    },
    error:function(statue,XMLHttpRequest){}
  });
  }

  //签收--签收详情
  function draftSignDtl(id){
    var id=$(id).attr("data-id");
    location.href='draftSignDtl.html?id='+id;
  }
  //签收成功回调
  function signforSuccessFun(data){
    if(IFSCommonMethod.isNotBlank(data.list)){
      var list=data.list;
      //alert(list);
      var html=[];
      for(var i=0;i<list.length;i++){
        html.push('<div class="list-group-item " data-id="'+list[i].id+'"  onclick="draftSignDtl(this)">\
          <span>'+IFSCommonMethod.str2Date(list[i].txnDt)+'</span>\
          <p>您收到一笔来自供应商 <span>'+list[i].reqCustNm+'的宝券转让</p></div>')
      }
      $(".qs-list").empty().append(html.join(""));
      renderDataDic();
    }
  }
  //转让审核-跳转到转让详情
  function transferDetail(id){
    var id=$(id).attr("data-id");
    location.href='draftTxnDtl.html?id='+id;
  }
  //转让成功回调
  function transfersuccessFun(data){
    if(IFSCommonMethod.isNotBlank(data.list)){
      var list=data.list;
      //console.log(list);
      var html=[];
      var type="";
      for(var i=0;i<list.length;i++){
        if(list[i].txnStat=="01"){
          type='transferPendingReview">转让待复核';
        }else if(list[i].txnStat=="04"){
          type='transferToCancel">转让撤销待复核';
        }
        html.push('<div class="list-group-item" data-id="'+list[i].id+'" onclick="transferDetail(this)">\
          <span class="pull-left '+type+'</span>\
          <span class="pull-right" >'+IFSCommonMethod.str2Date(list[i].txnDt)+'</span>\
          <p class="flx">您收到一笔来自供应商'+list[i].appUsrNm+'的宝券转让</p></div>');
      }
      $(".zrs-list").empty().append(html.join(""));
      renderDataDic();
    }
  }
  //融资审核--跳转融资详情
  function financeDetail(id){
    var id=$(id).attr("data-id");
    location.href='draftDisctDtl.html?id='+id;
  }
  //融资成功回调
  function financesuccessFun(data){
    if(IFSCommonMethod.isNotBlank(data)){
      var list=data.list;
      var html=[];
      var type="";
      for(var i=0;i<list.length;i++){
        if(list[i].txnStat=="01"){
          type='transferPendingReview">融资待复核';
        }else if(list[i].txnStat=="04"){
          type='transferToCancel">融资撤销待复核';
        }
        html.push('<div class="list-group-item" data-id="'+list[i].id+'" onclick="financeDetail(this)">\
          <span class="pull-left '+type+'</span>\
          <span class="pull-right" >'+IFSCommonMethod.str2Date(list[i].txnDt)+'</span>\
          <p class="flx">您收到一笔来自供应商'+list[i].custMgrStfNo+'的宝券转让</p></div>');
      }
      $(".rzsl-list").empty().append(html.join(""));
      renderDataDic();
    }
  }
  /*判断颜色*/

//  页脚提示
  $("#taskBtn").on("touchend",function(){
    $(".footer").css("display","none");
  });
