<template>
  <div id="app">
    <HomeNav v-if="$route.meta.isShowNav"></HomeNav>
    <Play
      v-if="currentMusic"
      :currentMusic="currentMusic"
      :playList="playList"
      :currentIndex="currentIndex"
      @update:music="
        currentMusic = $event.item;
        currentIndex = $event.index;
      "
    ></Play>
    <keep-alive>
      <router-view
        @update:music="
          currentMusic = $event.item;
          currentIndex = $event.index;
        "
        @update:playlist="playList = $event"
      />
    </keep-alive>
  </div>
</template>
<script>
import HomeNav from '@/components/HomeNav.vue';
import Play from '@/components/Play.vue';
export default {
  components: { HomeNav, Play },
  data() {
    return {
      currentMusic: null,
      currentIndex: 0,
      playList: []
    };
  }
  // watch: {
  //   '$parent.isloading': function(n) {
  //     console.log(n);
  //   }
  // }
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
a {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>
