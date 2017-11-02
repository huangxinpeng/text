<template>
<div class="text-right">
  <div class="page-bar">
    <ul>
      <li>
        <a v-if="current > 1"
          @click="current--, pageClick()"
          >上一页
        </a>
        <a v-else class="banclick">上一页</a>
      </li>
      <li v-for="index in myTotal" :class="{ 'active': current === index}">
        <a @click="btnClick(index)">{{ index }}</a>
      </li>
      <li>
        <a v-if="current < myTotal"
          @click="current++, pageClick()"
          >下一页
        </a>
        <a v-else class="banclick">下一页</a>
      </li>
      <li>
        <a>共<i>{{ myTotal }}</i>页</a>
      </li>
    </ul>
 </div>
</div>
</template>

<script>
import url from '@/http/url'
export default {
  props: {
    data: Array,
    total: {
      default: () => 1,
      type: Number
    },
    // --------------
    url: String,
    value: Object,
    table: String,
    k: String
  },
  computed: {
    myTotal () {
      let total
      total = Math.ceil(this.total / 5)
      return total
    }
  },
  data() {
    return {
      current: 1
    };
  },
  watch: {
    current (val) {
      let value = this.value
      value.pageIndex = val
      this.getData(value)
    }
  },
  mounted () {
    this.getData(this.value)
  },
  methods: {
    btnClick (val) {
      this.current = val
    },
    pageClick () {},
    getData (value) { // 换页请求数据
      this.$http.post(this.url, value, {
        headers: url.headers
      }).then(res => {
        console.log(res)
        this.$emit('update:data', JSON.parse(res.body.rows)[this.k])
      }, res => alert(this.k + '出错了'))
    }
  }
};
</script>
