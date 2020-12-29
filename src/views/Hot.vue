<template>
  <div class="hot">
    <div class="hot-title">
      <div class="content">
        <div class="hot-img"></div>
        <p>
          更新日期: <span v-if="!$root.isloading">{{ formatUpdateTime }}</span>
        </p>
      </div>
    </div>
    <ul>
      <Loading />
      <SongItem
        v-for="(song, index) in newSongs"
        :key="song.id"
        :item="song"
        :index="index"
        @update:music="$emit('update:music', $event)"
        @update:playlist="$emit('update:playlist', newSongs)"
        :isShowHot="isShowHot"
        :isHot="isHot"
      ></SongItem>
    </ul>
  </div>
</template>

<script>
import Loading from '@/components/Loading';
import SongItem from '@/components/SongItem';
export default {
  data() {
    return {
      newSongs: [],
      isShowHot: true,
      isHot: true,
      updateTime: '',
      count: 0
    };
  },
  components: {
    SongItem,
    Loading
  },
  computed: {
    formatUpdateTime() {
      return this.formatDate(new Date(this.updateTime));
    }
  },
  created() {
    this.$root.isloading = true;
    this.axios
      .get('/top/list?idx=1')
      .then(response => {
        // console.log(response);
        this.updateTime = response.data.playlist.updateTime;
        let songlist = response.data.playlist.trackIds
          .map(item => {
            return item.id;
          })
          .slice(0, 20)
          .join(',');
        // console.log(songlist);
        this.axios
          .get('/song/detail', {
            params: {
              ids: songlist
            }
          })
          .then(response1 => {
            // console.log(response1.data.songs);
            this.newSongs = response1.data.songs;
          })
          .finally(() => {
            this.count = this.count + 1;
          });
      })
      .finally(() => {
        this.count = this.count + 1;
      });
  },
  watch: {
    count(n) {
      if (n >= 2) {
        this.$root.isloading = false;
      }
      // console.log(this.count);
    }
  },
  methods: {
    formatDate(now) {
      var month = now.getMonth() + 1;
      var date = now.getDate();
      if (typeof month === 'number' && typeof date === 'number') {
        return month + '月' + date + '日';
      }
    }
  }
};
</script>

<style lang="less">
.hot-title {
  margin-top: 42px;
  height: 142px;
  background-color: #fff;
  background: url('../assets/images/hot_music_bg_2x.jpg') no-repeat;
  background-size: cover;
  justify-content: center;
  display: flex;
  align-items: center;
  .content {
    width: 100%;
    margin-left: 20px;
    .hot-img {
      width: 142px;
      height: 67px;
      background: url('../assets/images/index_icon_2x.png') no-repeat;
      background-size: 110%;
      background-position: -22px -28px;
    }
    p {
      color: #fff;
      font-size: 12px;
      padding-top: 10px;
    }
  }
}
</style>
