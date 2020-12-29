<template>
  <div class="search">
    <Loading />
    <div class="form">
      <div class="search-input">
        <!-- 搜索图标 -->
        <i class="icon"></i>
        <!-- 输入框 -->
        <input
          type="text"
          placeholder="搜索歌曲、歌手、专辑"
          v-model.trim="message"
          @keyup.enter="
            handleMsg(message);
            getSearchResult();
            inputing = false;
          "
          @input="inputing = true"
        />
        <!-- 清空输入 -->
        <span class="close" v-if="message" @click="message = ''"></span>
      </div>
    </div>
    <!-- 搜索时显示列表页 -->
    <div
      v-if="inputing && allMatch.length && !$root.isloading"
      class="show-msg"
    >
      <p class="search-res">搜索“{{ message }}”</p>
      <ol class="search-res-content">
        <li
          v-for="(item, index) in allMatch"
          :key="index"
          @click="
            inputing = false;
            message = item.keyword;
            getSearchResult();
          "
        >
          <span class="icon"></span>
          <div class="record-content">
            <p>{{ item.keyword }}</p>
          </div>
        </li>
      </ol>
    </div>
    <!-- 热门搜索 -->
    <template v-if="!allMatch.length && !inputing && !message">
      <div class="search-content">
        <p class="search-title">热门搜索</p>
        <ul class="search-result">
          <li
            v-for="(hotDetail, index) in showSearchWord"
            :key="index"
            @click="
              message = hotDetail.searchWord;
              handleMsg(message);
              getSearchResult();
            "
          >
            {{ hotDetail.searchWord }}
          </li>
        </ul>
      </div>
      <!-- 记录 -->
      <ol class="search-record">
        <li
          v-for="item in reverseRecordMsg"
          :key="item.id"
          @click="
            message = item.message;
            getSearchResult();
          "
        >
          <span class="icon"></span>
          <div class="record-content">
            <p>{{ item.message }}</p>
            <i class="del" @click.stop="removeRecord(item.id)"></i>
          </div>
          <div class="more"></div>
        </li>
      </ol>
    </template>
    <!-- 最佳匹配 -->
    <template v-if="!inputing && message && !$root.isloading">
      <div class="search-pipei">
        <p class="search-title">最佳匹配</p>
        <ul>
          <!-- 歌手 -->
          <li class="artist" v-if="match.artist">
            <div class="box">
              <div
                class="img"
                :style="
                  'background-image: url(' +
                    match.artist[0].picUrl +
                    '?imageView=1&type=webp&thumbnail=100x0)'
                "
              ></div>
            </div>
            <div class="artist-content" v-if="match.artist">
              <h4>
                {{ match.artist[0].occupation }}:
                <i>{{ match.artist[0].name }}</i>
                <i v-if="match.artist[0].trans">
                  ({{ match.artist[0].trans }})</i
                >
                <i v-if="match.artist[0].alias[0]">
                  ({{ match.artist[0].alias[0] }})</i
                >
              </h4>
            </div>
            <div class="more"></div>
          </li>
          <!-- 专辑 -->
          <li class="album" v-if="match.album">
            <div class="box">
              <img
                :src="
                  '' +
                    match.album[0].picUrl +
                    '?imageView=1&type=webp&thumbnail=100x0'
                "
                alt=""
              />
            </div>
            <div class="album-content">
              <h4>专辑: {{ match.album[0].name }}</h4>
              <p>{{ match.album[0].artist.name }}</p>
            </div>
            <div class="more"></div>
          </li>
          <SongItem
            v-for="(song, index) in newSongs"
            :key="song.id"
            :item="song"
            :index="index"
            :isHot="true"
            @update:music="$emit('update:music', $event)"
            @update:playlist="$emit('update:playlist', newSongs)"
          ></SongItem>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import _ from 'lodash';
import SongItem from '@/components/SongItem.vue';
import Loading from '@/components/Loading.vue';
export default {
  components: {
    SongItem,
    Loading
  },
  data() {
    return {
      message: '',
      allMatch: [],
      hotDetails: [],
      recordMsg: [],
      inputing: false,
      isSearch: true,
      newSongs: [],
      match: [],
      count: 0
    };
  },
  computed: {
    showSearchWord() {
      return this.hotDetails.slice(0, 10);
    },
    reverseRecordMsg() {
      let arr = this.recordMsg.slice().reverse();
      return arr;
    }
  },
  created() {
    this.recordMsg = localStorage.record ? JSON.parse(localStorage.record) : [];
    this.match = localStorage.match ? JSON.parse(localStorage.match) : [];
    this.dedebouncedGetData = _.debounce(this.getMessage, 300);
    this.axios.get('/search/hot/detail').then(response => {
      this.hotDetails = response.data.data;
    });
  },
  methods: {
    getMessage() {
      if (this.message) {
        this.$root.isloading = true;
        this.count = 0;
        this.axios
          .get('/search/suggest', {
            params: {
              keywords: this.message,
              type: 'mobile'
            }
          })
          .then(response => {
            this.allMatch = response.data.result.allMatch;
          })
          .finally(() => {
            this.count = this.count + 1;
          });
      } else {
        return;
      }
    },
    handleMsg(msg) {
      this.recordMsg = this.recordMsg.filter(item => {
        return item.message != msg;
      });

      this.recordMsg.push({
        message: msg,
        id: this.recordMsg.length
          ? this.recordMsg[this.recordMsg.length - 1].id + 1
          : 1
      });
      this.saveRecord();
    },
    saveRecord() {
      localStorage.record = JSON.stringify(this.recordMsg);
    },
    saveMatch() {
      localStorage.match = JSON.stringify(this.match);
    },

    removeRecord(id) {
      // console.log(id);
      this.recordMsg = this.recordMsg.filter(element => {
        return element.id != id;
      });
      this.saveRecord();
    },
    // 获取最佳匹配数据
    getSearchResult() {
      this.$root.isloading = true;
      this.count = 0;
      this.axios
        .get('/search/multimatch?keywords=' + this.message)
        .then(response => {
          // console.log(response.data.result);
          this.match = response.data.result;
          this.saveMatch();

          console.log(JSON.parse(localStorage.match));
          let arr = JSON.parse(localStorage.match);

          if (arr.orders.find(item => item === 'artist')) {
            this.axios
              .get('/artist/top/song?id=' + arr.artist[0].id)
              .then(response => {
                // 歌曲
                this.newSongs = response.data.songs;
              });
          }
          if (
            arr.orders.length == 0 ||
            arr.orders.find(item => item != 'artist') ||
            arr.orders.find(item => item != 'album')
          ) {
            console.log(arr.orders);
            this.axios
              .get('/search', {
                params: {
                  keywords: this.message
                }
              })
              .then(response => {
                // console.log(response);
                this.arrIds = response.data.result.songs
                  .map(item => {
                    return item.id;
                  })
                  .join(',');
                this.axios
                  .get('/song/detail', {
                    params: {
                      ids: this.arrIds
                    }
                  })
                  .then(response => {
                    console.log(response.data.songs);
                    this.newSongs = response.data.songs;
                  })
                  .finally(() => {
                    this.count = this.count + 1;
                  });
              })
              .finally(() => {
                this.count = this.count + 1;
              });
          }
        });
    }
  },
  watch: {
    message(n) {
      if (n) {
        if (this.inputing) {
          this.dedebouncedGetData();
        }
      } else {
        this.inputing = false;
        this.allMatch = [];
      }
    },
    count(n) {
      if (n >= 2) {
        this.$root.isloading = false;
      }
    }
  }
};
</script>

<style scoped lang="less">
.search {
  margin-top: 41px;
  display: flex;
  flex-flow: column;
  position: relative;
  .form {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #eee;
    .search-input {
      width: 95%;
      height: 30px;
      display: flex;
      background: #ebecec;
      border-radius: 15px;
      margin: 15px 0;
      i {
        width: 30px;
        height: 30px;
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNiAyNiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljOWNhIiBkPSJNMjUuMTgxIDIzLjUzNWwtMS40MTQgMS40MTQtNy4zMTUtNy4zMTRBOS45NjYgOS45NjYgMCAwIDEgMTAgMjBDNC40NzcgMjAgMCAxNS41MjMgMCAxMFM0LjQ3NyAwIDEwIDBzMTAgNC40NzcgMTAgMTBjMCAyLjM0Mi0uODExIDQuNDktMi4xNiA2LjE5NWw3LjM0MSA3LjM0ek0xMCAyYTggOCAwIDEgMCAwIDE2IDggOCAwIDAgMCAwLTE2eiIvPjwvc3ZnPg==)
          no-repeat;
        background-size: 50%;
        background-position: 50%;
      }
      input {
        flex: 1;
        height: 30px;
        outline: none;
        border: none;
        background: #ebecec;
        color: #666;
        border-radius: 15px;
      }
      .close {
        width: 30px;
        height: 30px;
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOCAyOCI+PGcgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjYmNiZGJkIiBkPSJNMTQgMGM3LjczMiAwIDE0IDYuMjY4IDE0IDE0cy02LjI2OCAxNC0xNCAxNFMwIDIxLjczMiAwIDE0IDYuMjY4IDAgMTQgMHoiLz48cGF0aCBkPSJNMTkgOUw5IDE5TTkgOWwxMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZWJlY2ViIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIi8+PC9nPjwvc3ZnPg==)
          no-repeat;
        background-size: 50%;
        background-position: 50%;
      }
    }
  }
  .show-msg {
    width: 100%;
    height: 100%;
    background-color: #fff;
    font-size: 15px;
    p.search-res {
      height: 50px;
      line-height: 50px;
      margin-left: 10px;
      color: #507daf;
      border-bottom: 1px solid #eee;
    }
    ol.search-res-content {
      li {
        display: flex;
        flex: 1;
        .icon {
          width: 35px;
          height: 45px;
          display: inline-block;
          background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMDQwMDAwIiBkPSJNMjguMTgxIDI3LjUzNWwtMS40MTQgMS40MTQtNy43NTUtNy43NTRBMTEuNDQ1IDExLjQ0NSAwIDAgMSAxMS41IDI0QzUuMTQ5IDI0IDAgMTguODUyIDAgMTIuNSAwIDYuMTQ5IDUuMTQ5IDEgMTEuNSAxIDE3Ljg1MiAxIDIzIDYuMTQ5IDIzIDEyLjVjMCAyLjc1Ni0uOTczIDUuMjg1LTIuNTg5IDcuMjY2bDcuNzcgNy43Njl6TTExLjUgM2E5LjUgOS41IDAgMSAwIDAgMTkgOS41IDkuNSAwIDAgMCAwLTE5eiIgb3BhY2l0eT0iLjMiLz48L3N2Zz4=)
            no-repeat;
          background-size: 50%;
          background-position: 50%;
        }
        .record-content {
          width: 100%;
          display: flex;
          position: relative;
          p {
            flex: 1;
            height: 45px;
            line-height: 45px;
            border-bottom: 1px solid #eee;
          }
        }
      }
    }
  }
  .search-content {
    display: flex;
    padding: 15px 10px 0 10px;
    font-size: 12px;
    flex-flow: column;

    p.search-title {
      width: 100%;
      margin-bottom: 10px;
    }
    .search-result {
      min-height: 135px;
      margin-bottom: 0;
      li {
        display: inline-block;
        padding: 8px 14px;
        border: 1px solid #d3d4da;
        border-radius: 16px;
        margin: 0 10px 10px 0px;
      }
    }
  }
  .search-record {
    font-size: 14px;
    width: 100%;
    display: flex;
    flex-flow: column;
    margin-bottom: 50px;
    li {
      display: flex;
      flex: 1;
      &.album {
        img {
          width: 50px;
          height: 50px;
        }
      }
      .icon {
        width: 35px;
        height: 45px;
        display: inline-block;
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljYWNhIiBkPSJNMTUgMzBDNi43MTYgMzAgMCAyMy4yODQgMCAxNVM2LjcxNiAwIDE1IDBzMTUgNi43MTYgMTUgMTUtNi43MTYgMTUtMTUgMTVtMC0yOEM3LjgyIDIgMiA3LjgyIDIgMTVzNS44MiAxMyAxMyAxMyAxMy01LjgyIDEzLTEzUzIyLjE4IDIgMTUgMm03IDE2aC04YTEgMSAwIDAgMS0xLTFWN2ExIDEgMCAxIDEgMiAwdjloN2ExIDEgMCAxIDEgMCAyIi8+PC9zdmc+)
          no-repeat;
        background-size: 50%;
        background-position: 50%;
      }
      .record-content {
        width: 100%;
        display: flex;
        position: relative;
        p {
          flex: 1;
          height: 45px;
          line-height: 45px;
          border-bottom: 1px solid #eee;
        }
        i.del {
          position: absolute;
          right: 0;
          top: 0;
          width: 45px;
          height: 45px;
          display: inline-block;
          background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjOTk5ODk5IiBkPSJNMTMuMzc5IDEybDEwLjMzOCAxMC4zMzdhLjk3NS45NzUgMCAxIDEtMS4zNzggMS4zNzlMMTIuMDAxIDEzLjM3OCAxLjY2MyAyMy43MTZhLjk3NC45NzQgMCAxIDEtMS4zNzgtMS4zNzlMMTAuNjIzIDEyIC4yODUgMS42NjJBLjk3NC45NzQgMCAxIDEgMS42NjMuMjg0bDEwLjMzOCAxMC4zMzhMMjIuMzM5LjI4NGEuOTc0Ljk3NCAwIDEgMSAxLjM3OCAxLjM3OEwxMy4zNzkgMTIiLz48L3N2Zz4=)
            no-repeat;
          background-size: 28%;
          background-position: 50%;
        }
      }
    }
  }
  .search-pipei {
    width: 100%;
    .search-title {
      font-size: 12px;
      padding: 8px 10px 0px 10px;
      color: #666;
    }
    .artist {
      width: 100%;
      height: auto;
      display: flex;
      padding: 8px 10px;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #eee;
      .box {
        position: relative;
        width: 50px;
        height: 50px;
        .img {
          width: 50px;
          height: 50px;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: 50%;
        }
      }
      .artist-content {
        flex: 1;
        margin-left: 15px;
        h4 {
          font-size: 17px;
          i {
            font-style: normal;
            font-style: 17px;
            color: #507daf;
          }
        }
      }
    }
    .album {
      width: 100%;
      height: auto;
      display: flex;
      padding: 8px 10px;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #eee;
      .box {
        position: relative;
        width: 50px;
        height: 50px;
        &::after {
          content: '';
          position: absolute;
          top: 2px;
          right: -10px;
          width: 10px;
          height: 46px;
          background-repeat: no-repeat;
          background-size: 166px 97px;
          background-image: url(//s3.music.126.net/mobile-new/img/index_icon_2x.png?5207a28c3767992ca4bb6d4887c74880=);
          background-position: 0 -30px;
        }
      }
      .album-content {
        flex: 1;
        margin-left: 15px;
        h4 {
          flex: 1;
          font-size: 17px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        p {
          color: #507daf;
          font-size: 12px;
        }
      }
    }
    .more {
      width: 8px;
      height: 13px;
      margin: 0 8px 0 10px;
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAyNiI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI5YjliIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTIuOTM5IDIzLjkzOUwxMy44NzkgMTMgMi45MzkgMi4wNjEiLz48L3N2Zz4=);
    }
  }
}
</style>
