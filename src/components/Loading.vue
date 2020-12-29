<template>
  <div class="loading " v-show="$root.isloading">
    <span></span><i>正在加载中...</i>
  </div>
</template>

<script>
export default {
  methods: {
    bodyScroll(event) {
      event.preventDefault();
    }
  }
};
</script>

<style lang="less" scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  // background-color: rgba(0, 0, 0, 0.1);
  z-index: 99;
  span {
    height: 30px;
    width: 30px;
    background: url('../assets/images/loading.gif') no-repeat;
    background-position: 50%;
    background-size: 50%;
  }
  i {
    font-style: normal;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    color: #666;
  }
}
</style>
