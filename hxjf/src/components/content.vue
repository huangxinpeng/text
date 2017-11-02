<template>
  <div class="content" >
    <div class="row">
    <div class=" text-center">
      
          <h2><b>保理融资</b></h2>
          <p>一站式金融服务，全线上便捷融资体验</p>
    </div>
    <div class="row">
        <div class="col-md-10 col-md-offset-1 text-center">
            <div class="col-md-3">
              <div class="col-md-12">
                    <img class="w37" src="../img/list-4.png" alt="融资成本低" />
                    <h4 >融资成本低</h4>
              </div>
            </div>
            <div class="col-md-3">
              <div class="col-md-12">
                    <img class="w37" src="../img/list-3.png" alt="融资期限长" />
                    <h4 >融资期限长</h4>
              </div></div>
            <div class="col-md-3">
              <div class="col-md-12">
                    <img class="w37" src="../img/list-2.png" alt="操作便捷" />
                    <h4 >操作便捷</h4>
              </div></div>
            <div class="col-md-3">
              <div class="col-md-12">
                    <img class="w37" src="../img/list-1.png" alt="额度实时更新" />
                    <h4 >额度实时更新</h4>
              </div></div>
        </div>
        <div class="col-md-12 text-center mg-tb-30">
      <router-link to="/loanApply"   class="btn btn-color">立即融资</router-link>

        </div>
    </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'content',
  data () {
    return {
  
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content{width: 100%; overflow: hidden;}
.w37{
    display: block;
      width: 37px;
      height: 44px;
      margin: 20px auto;
}
.mg-tb-30{
  margin-bottom: 40px;
  margin-top: 30px;
}
.btn-color{
  border:1px solid #fca91d;
  color: #fca91d;
  text-align: center;
  padding: 17px 53px;
  font-size: 22px;
  font-weight: bold
}
</style>
