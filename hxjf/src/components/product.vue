<template>
  <div class="product ">
  <div class="container-fluid ">
  <div class="row-fluid">
    <div class="span12">
      <div class="carousel slide col-md-12" id="carousel-655509" data-ride="carousel" data-interval="2000" style="padding:0">
        <ol class="carousel-indicators">
          <li data-slide-to="0" data-target="#carousel-655509">
          </li>
          <li data-slide-to="1" data-target="#carousel-655509" class="active">
          </li>
        </ol>
        <div class="carousel-inner col-md-12" style="padding:0">
          <div class="item" style="background: url(./static/img/product1.png) 0 0 no-repeat;background-size: 100% 100%">
            <!-- <img alt="" src="static/img/u0.jpg" /> -->
          </div>
          <div class="item active" style="background: url(./static/img/product2.png) 0 0 no-repeat;background-size: 100% 100%">
          </div>
        </div> <a data-slide="prev" href="#carousel-655509" class="left carousel-control">‹</a> <a data-slide="next" href="#carousel-655509" class="right carousel-control">›</a>
      </div>
    </div>
  </div>
</div>
</div>
</template>
<script>
export default {
  name: 'product',
  components:{
},
data () {
    return {
   }
} ,
 mounted(){
    $(function(){
     $('.carousel').carousel({
       interval: 2000
     })
   })
  }   
}
</script>
<style  scope >
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
.item{height: 450px;}
</style>
