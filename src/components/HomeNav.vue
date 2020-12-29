<template>
  <ul id="home-nav">
    <li><router-link to="/">推荐音乐</router-link></li>
    <li><router-link to="/hot">热歌榜</router-link></li>
    <li><router-link to="/search">搜索</router-link></li>
  </ul>
</template>

<script>
export default {
  name: 'HomeNav'
};
</script>

<style lang="less">
#home-nav {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background: #fff;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  height: 41px;
  z-index: 8;
  margin-bottom: 0;
  li {
    font-size: 15px;
    flex: 1;
    text-align: center;
    a {
      text-decoration: none;
      color: black;
      line-height: 40px;
      display: inline-block;
      padding: 0 10px;
      &.router-link-exact-active {
        color: #dd001b;
        border-bottom: 2px solid #dd001b;
      }
    }
  }
}
</style>
