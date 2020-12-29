<template>
  <div class="recommend">
    <Loading />
    <!-- 推荐页面 -->
    <RecommendPlayList :currentRecommends="currentRecommends"
      >推荐歌单</RecommendPlayList
    >
    <RecommendMusic
      @update:music="$emit('update:music', $event)"
      @update:playlist="$emit('update:playlist', $event)"
      :newSongs="newSongs"
      >最新音乐</RecommendMusic
    >
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue';
import RecommendPlayList from '@/components/RecommendPlayList';
import RecommendMusic from '@/components/RecommendMusic';
export default {
  data() {
    return {
      recommends: [],
      newSongs: [],
      recommendsIndex: 0,
      count: 0
    };
  },
  components: {
    RecommendPlayList,
    RecommendMusic,
    Loading
  },
  computed: {
    currentRecommends() {
      return this.recommends.slice(
        this.recommendsIndex * 6,
        (this.recommendsIndex + 1) * 6
        // 0,
        // 6
      );
    }
  },
  created() {
    this.$root.isloading = true;
    this.axios
      .get('/personalized')
      .then(response => {
        // console.log(response);
        this.recommends = response.data.result;
        this.count = this.count + 1;
      })
      .finally(() => {
        this.count = this.count + 1;
      });
    this.axios
      .get('/personalized/newsong')
      .then(response => {
        console.log(response.data.result);
        this.newSongs = response.data.result;
      })
      .finally(() => {
        this.count = this.count + 1;
      });
  },
  activated() {
    this.recommendsIndex =
      this.recommendsIndex >= 4 ? 0 : this.recommendsIndex + 1;
  },
  watch: {
    count(n) {
      if (n > 2) {
        this.$root.isloading = false;
      }
    }
  }
};
</script>

<style lang="less">
.recommend {
  margin-top: 62px;
}
</style>
