<template>
<div>
  <span class="verify-code"
    @click="getCode"
    style="cursor: pointer"
    >{{ verifyCode || '验证码' }}
  </span>
</div>
</template>

<script>
import url from '@/http/url'
export default {
  data () { return {
    verifyCode: ''
  }},
  mounted () {
    this.getCode()
  },
  methods: {
    getCode () {
      this.$http.post(url.external.sessionVali)
        .then(res => {
          this.verifyCode = res.bodyText
        }
        , res => alert('获取验证码出错'))
    }
  }
}
</script>

<style scoped>
.verify-code {
  background-image: url(../../img/verify-code.png);
  width: 100%;
  height: 100%;
  letter-spacing: 2px;
  text-align: center;
  border-color: #46b8da;
  border-radius: 3px;
  font-weight: bold;
  color: #333;
  display: inline-block;
  padding: 6px 10px;
}
</style>