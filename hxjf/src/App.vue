<template>
  <div id="app">
  <headers></headers> 
  <!-- <banner></banner> -->
  <router-view></router-view>
  <!-- <contents></contents> -->
  <footder></footder> 
  </div>
</template>
<script>
import footder from './components/footder.vue'
import headers from './components/header.vue'
import banner from './components/banner.vue'
import contents from './components/content.vue'

export default {
  name: 'app',
  components:{
      footder,headers,contents,banner
  }
}
</script>
<style>
.page-bar a{
  color: #333;
}
</style>
