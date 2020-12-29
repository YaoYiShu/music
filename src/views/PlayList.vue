<template>
  <div class="playlist">
    <Loading />
    <div class="header">
      <div
        class="mask"
        :style="'background-image:url(' + playlistMsg.coverImgUrl + ')'"
      ></div>
      <div class="title">
        <div class="img">
          <span class="lsthd_icon">歌单</span>
          <img :src="playlistMsg.coverImgUrl" alt="" />
          <span class="play-count">
            {{ playlistMsg.playCount | formatPlayCount }}</span
          >
        </div>
        <div class="con">
          <h3>{{ playlistMsg.name }}</h3>
          <p>
            <template v-if="playlistMsg.creator">
              <img
                :src="
                  playlistMsg.creator.avatarUrl +
                    '?imageView=1&type=webp&thumbnail=252x0'
                "
                alt=""
                class="photo"
              />
              <span class="nickname">{{ playlistMsg.creator.nickname }}</span>
            </template>
          </p>
        </div>
      </div>
    </div>
    <section v-if="!$root.isloading">
      <h5>歌曲列表</h5>
      <SongItem
        v-for="(song, index) in newSongs"
        :key="song.id"
        :item="song"
        :index="index"
        @update:music="$emit('update:music', $event)"
        @update:playlist="$emit('update:playlist', newSongs)"
        :isHot="isHot"
        :isShowHot="isShowHot"
        :isplaylist="isplaylist"
      ></SongItem>
      <h5>精彩评论</h5>
      <Comments :commentsList="commentsList"></Comments>
    </section>
  </div>
</template>

<script>
import SongItem from '@/components/SongItem';
import Loading from '@/components/Loading';
import Comments from '@/components/Comments';
export default {
  name: 'PlayList',
  components: {
    SongItem,
    Loading,
    Comments
  },
  data() {
    return {
      playlistMsg: [],
      newSongs: [],
      isHot: false,
      isShowHot: true,
      isplaylist: true,
      count: 0,
      id: null,
      commentsList: []
    };
  },
  filters: {
    formatPlayCount: function(value) {
      let k = 10000;
      let sizes = ['', '万', '亿', '万亿'];
      if (value < k) {
        return value;
      } else {
        let i = Math.floor(Math.log(value) / Math.log(k));
        value = (value / Math.pow(k, i)).toFixed(1);
        return value + sizes[i];
      }
    }
  },
  computed: {
    setDescription: function() {
      // console.log(typeof this.playlistMsg);
      return this.playlistMsg.description
        ? this.playlistMsg.description.toString().split('\n')
        : '';
    }
  },
  created() {
    this.id = this.$route.query.id;
  },
  watch: {
    id(n) {
      // console.log(n);
      this.$root.isloading = true;
      this.axios
        .get('/playlist/detail', {
          params: {
            id: n
          }
        })
        .then(response => {
          // console.log(response.data);
          this.playlistMsg = response.data.playlist;
          let songlist = response.data.playlist.trackIds
            .map(item => {
              return item.id;
            })
            .slice(0, 20)
            .join(',');
          this.axios
            .get('/song/detail', {
              params: {
                ids: songlist
              }
            })
            .then(response1 => {
              this.newSongs = response1.data.songs;
            })
            .finally(() => {
              this.count = this.count + 1;
            });
        })
        .finally(() => {
          this.count = this.count + 1;
        });
      this.axios
        .get('http://music.kele8.cn/comment/playlist', {
          params: {
            id: n
          }
        })
        .then(response => {
          console.log(response.data.comments);
          this.commentsList = response.data.comments;
        });
    },
    count(n) {
      if (n >= 2) {
        this.count = 0;
        this.$root.isloading = false;
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.id = to.query.id;
    next();
  },
  activated() {
    this.id = this.$route.query.id;
  }
};
</script>

<style lang="less" scoped>
.playlist {
  width: 100%;
  height: auto;
  .header {
    position: relative;
    color: #fff;
    width: 100%;
    height: 180px;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    overflow: hidden;
    .mask {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50%;
      transform: scale(1.5);
      filter: blur(25px) brightness(0.6);
      z-index: -1;
    }
    .title {
      display: flex;
      .img {
        position: relative;
        .lsthd_icon {
          position: absolute;
          z-index: 3;
          top: 10px;
          left: 0;
          padding: 0 8px;
          height: 17px;
          color: #fff;
          font-size: 9px;
          text-align: center;
          line-height: 17px;
          background-color: rgba(217, 48, 48, 0.8);
          border-top-right-radius: 17px;
          border-bottom-right-radius: 17px;
        }
        .play-count {
          font-size: 12px;
          padding: 3px 3px 0 0;
          position: absolute;
          top: 0;
          right: 0;
          color: white;
          text-shadow: 0 0 1px black;
          &::before {
            content: '';
            background: no-repeat
              url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMiAyMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMDQwMDAwIiBkPSJNMjIgMTYuNzc3YzAgMS4yMzMtMS4xMjEgMi4yMzMtMi41MDYgMi4yMzMtMS4zODQgMC0yLjUwNi0xLTIuNTA2LTIuMjMzdi0yLjU1M2MwLTEuMjM0IDEuMTIyLTIuMjMzIDIuNTA2LTIuMjMzLjE3NCAwIC4zNDMuMDE3LjUwNi4wNDZ2LTEuMzdoLS4wMzNjLjAxNy0uMjIuMDMzLS40NDEuMDMzLS42NjZhOCA4IDAgMCAwLTE2IDBjMCAuMjI1LjAxNi40NDYuMDM0LjY2Nkg0djEuMzdjLjE2My0uMDI5LjMzMy0uMDQ2LjUwNS0uMDQ2IDEuMzg0IDAgMi41MDYuOTk5IDIuNTA2IDIuMjMzdjIuNTUzYzAgMS4yMzMtMS4xMjIgMi4yMzMtMi41MDYgMi4yMzNTMiAxOC4wMTEgMiAxNi43Nzd2LTIuNTUzYzAtLjI1OC4wNTktLjUwMS4xNDgtLjczQS45ODIuOTgyIDAgMCAxIDIgMTMuMDAxdi0yLjY2N2MwLS4wMjMuMDEyLS4wNDMuMDEzLS4wNjctLjAwNC0uMDg4LS4wMTMtLjE3Ni0uMDEzLS4yNjYgMC01LjUyMyA0LjQ3Ny0xMCAxMC0xMHMxMCA0LjQ3NyAxMCAxMGMwIC4wOS0uMDA5LjE3OC0uMDE0LjI2Ni4wMDIuMDI0LjAxNC4wNDQuMDE0LjA2N3YyYS45ODguOTg4IDAgMCAxLS4zNi43NTNjLjIyNC4zMzQuMzYuNzIuMzYgMS4xMzh2Mi41NTIiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI2ZmZiIgZD0iTTIwIDE2Ljc3N2MwIDEuMjMzLTEuMTIxIDIuMjMzLTIuNTA2IDIuMjMzLTEuMzg0IDAtMi41MDYtMS0yLjUwNi0yLjIzM3YtMi41NTNjMC0xLjIzNCAxLjEyMi0yLjIzMyAyLjUwNi0yLjIzMy4xNzQgMCAuMzQzLjAxNy41MDYuMDQ2di0xLjM3aC0uMDMzYy4wMTctLjIyLjAzMy0uNDQxLjAzMy0uNjY2YTggOCAwIDAgMC0xNiAwYzAgLjIyNS4wMTYuNDQ2LjAzNC42NjZIMnYxLjM3Yy4xNjMtLjAyOS4zMzMtLjA0Ni41MDUtLjA0NiAxLjM4NCAwIDIuNTA2Ljk5OSAyLjUwNiAyLjIzM3YyLjU1M2MwIDEuMjMzLTEuMTIyIDIuMjMzLTIuNTA2IDIuMjMzUzAgMTguMDExIDAgMTYuNzc3di0yLjU1M2MwLS4yNTguMDU5LS41MDEuMTQ4LS43M0EuOTgyLjk4MiAwIDAgMSAwIDEzLjAwMXYtMi42NjdjMC0uMDIzLjAxMi0uMDQzLjAxMy0uMDY3LS4wMDQtLjA4OC0uMDEzLS4xNzYtLjAxMy0uMjY2IDAtNS41MjMgNC40NzctMTAgMTAtMTBzMTAgNC40NzcgMTAgMTBjMCAuMDktLjAwOS4xNzgtLjAxNC4yNjYuMDAyLjAyNC4wMTQuMDQ0LjAxNC4wNjd2MmEuOTg4Ljk4OCAwIDAgMS0uMzYuNzUzYy4yMjQuMzM0LjM2LjcyLjM2IDEuMTM4djIuNTUyIi8+PC9zdmc+');
            background-position: left center;
            background-size: auto 90%;
            width: 0.8em;
            height: 0.9em;
            display: inline-block;
            // vertical-align: middle;
          }
        }
        img {
          display: inline-block;
          width: 126px;
          height: 126px;
        }
      }
      .con {
        margin-left: 16px;
        p {
          margin-top: 20px;
          height: 30px;
          display: flex;
          font-size: 14px;
          align-items: center;
          img {
            position: relative;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            &::before {
              content: '';
              position: absolute;
              right: -5px;
              bottom: 0;
              width: 12px;
              height: 12px;
              background-image: url(//s3.music.126.net/mobile-new/img/usericn_2x.png?6423c0681bfb3358d5c684c9b998e412=);
              background-repeat: no-repeat;
              background-size: 75px auto;
            }
          }
          .nickname {
            padding-left: 5px;
          }
        }
      }
    }
    h3 {
      font-size: 17px;
    }
  }
  section {
    width: 100%;
    h5 {
      font-size: 12px;
      padding: 5px 0 5px 10px;
      background: #eeeff0;
    }
  }
}
</style>
