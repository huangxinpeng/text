<template>
  <div class="banner ">
    <div class="container-fluid">
      <div class="row-fluid">
        <div class="span12">
          <div class="carousel slide bannerimg" id="carousel-ad" data-ride="carousel" data-interval="2000">
            <ol class="carousel-indicators">
              <li data-slide-to="0" data-target="#carousel-ad">
              </li>
              <li data-slide-to="1" data-target="#carousel-ad" class="active">
              </li>
              <!-- <li data-slide-to="2" data-target="#carousel-ad">
              </li> -->
            </ol>
            <div class="carousel-inner">
              <div class="item" style="background: url(./static/img/banner1.png) no-repeat 100% 100%;background-size: 100% 100%">
                <!-- <img alt="" src="../img/banner1.png" /> -->
              </div>
              <div class="item active"  style="background: url(./static/img/banner2.png) no-repeat 100% 100%;background-size: 100% 100%">
                <!-- <img alt="" src="../img/banner2.png" /> -->
              </div>
              <!-- <div class="item" style="background: url(./static/img/banner3.png)  0 0 no-repeat;;background-size: 100% 100% "> -->
                <!-- <img alt="" src="../img/banner3.png" /> -->
              <!-- </div> -->
            </div> <a data-slide="prev" href="#carousel-ad" class="left carousel-control">‹</a> <a data-slide="next" href="#carousel-ad" class="right carousel-control">›</a>
          </div>
        </div>
      </div>
    </div>
    <contents></contents>
  </div>
</template>
<script>
import  '../../static/js/bootstrap.min.js'
import contents from './content.vue'
export default {
  name: 'banners',
  components:{
    contents
  },
  data () {
    return {
    }
  }  ,
  mounted(){
    $(function(){
     $('.carousel').carousel({
       interval: 2000
     })
   })
  } 
}
</script>
<style  scoped >
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  color: #666;
}
.container-fluid {
 padding-right: 0px; 
 padding-left: 0px; 
}
.banner{
  padding: 0;
  width: 100%;
  margin: 0;
}
.carousel-control {
  line-height: 450px;
  text-align: center;
  font-size: 100px;
}
.img-block{
  display: inline-block;
  margin: 0 auto
}
.item{
  height: 450px;
}
</style>
