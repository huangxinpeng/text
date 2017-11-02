<template>
<div class="col-md-12 title">
  <a href="#">
    <!-- <img src="../../img/u26.png" alt="" /> -->
    <span class="h4">{{ text }}</span>
  </a>
  <router-link
    class="btn btn-default pull-right margint btn-sm"
    to='/homepage'
    style="margin-top:15px;"
    >返回
  </router-link>
</div>
</template>

<script>
export default {
  props: {
    text: String
  }
}
</script>

<style scoped>
.title {
  margin-top: 20px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 4px solid #f0ad4e;
}
span {
  margin-top: 10px;
}
</style>