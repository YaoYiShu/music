<template>
  <div class="play-full-lyric" @click.stop="$emit('toggle-show-lyric')">
    <Loading />
    <div class="bar">
      <span class="icon-voice"></span>
      <input
        type="range"
        ref="voice"
        min="0"
        max="100"
        value="50"
        @input="updateVoice"
      />
    </div>
    <div class="box">
      <div v-if="isOwnLyric">
        <ul class="lyric" ref="lyric">
          <li
            :class="{ active: activeIndex === index }"
            v-for="(item, index) in lyric"
            :key="index"
            ref="li"
            :data-index="index"
          >
            {{ item.text || '-' }}
          </li>
        </ul>
      </div>
      <div class="nolyric" v-if="isOwnLyric && !$root.isloading">
        <p>纯音乐，请欣赏</p>
        <p><a href="javascript:;">开启动效</a> 沉浸效果</p>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from './Loading.vue';
export default {
  components: { Loading },
  props: ['isShowLyric', 'currentMusic', 'audio'],
  data() {
    return {
      lyric: [],
      activeIndex: 0,
      isOwnLyric: null,
      count: 0,
      volume: 0
    };
  },
  created() {
    this.render();
    this.saveData();
  },
  mounted() {
    this.$refs.voice.style.backgroundSize =
      (this.$refs.voice.value / this.$refs.voice.max) * 100 + '%';
  },
  watch: {
    currentMusic() {
      this.render();
      this.saveData();
    },
    volume(n) {
      this.$refs.voice.style.backgroundSize =
        (n / this.$refs.voice.max) * 100 + '%';
    },
    count(n) {
      if (n >= 1) {
        this.$root.isloading = false;
      }
    },
  },
  methods: {
    parsesLryic(res) {
      let patt = /\[\d{2}:\d{2}\.\d{2,3}\]/gi;
      let arr = res
        .split('\n')
        .filter(e => e)
        .map(str => {
          let time = str.match(patt)[0].replace(/(\[|\])/gi, '');
          let timeArr = time.split(':');
          time = Number(timeArr[0] * 60 + Number(timeArr[1]));
          let text = str.replace(patt, '');
          return { time, text };
        });
      // console.log(arr);
      return arr;
    },
    render() {
      this.$root.isloading = true;
      this.axios
        .get('/lyric', {
          params: {
            id: this.currentMusic.id
          }
        })
        .then(response => {
          // console.log(response.data);
          this.isOwnLyric = response.data.lrc;
          if (response.data.lrc != undefined) {
            this.lyric = this.parsesLryic(response.data.lrc.lyric);
            // console.log(this.lyric);
            let parsedLryic = this.parsesLryic(response.data.lrc.lyric);

            var _this = this;
            this.audio.addEventListener('timeupdate', function() {
              for (let i = 0; i < parsedLryic.length; i++) {
                if (this.currentTime > parseInt(parsedLryic[i].time)) {
                  const index = _this.$refs.li[i]
                    ? _this.$refs.li[i].dataset.index
                    : '';
                  if (i === parseInt(index)) {
                    _this.activeIndex = i;
                    _this.$refs.lyric.style.marginTop = 200 - 46 * i + 'px';
                  }
                }
              }
            });
          } else {
            console.log('歌词为空');
          }
        })
        .finally(() => {
          this.count = this.count + 1;
        });
    },
    saveData() {
      // localStorage.setItem
      localStorage.lyric = JSON.stringify(this.lyric);
    },
    updateVoice(e) {
      // console.log(e.target.value);
      this.volume = e.target.value;
      this.audio.volume = e.target.value / 100;
    }
  }
};
</script>

<style lang="less">
.play-full-lyric {
  color: #b3b8b8;
  width: 100%;
  display: flex;
  flex-flow: column;
  text-align: center;
  .bar {
    display: block;
    display: flex;
    width: 100%;
    height: 50px;
    // background-color: rgba(65, 105, 225, 0.411);
    .icon-voice {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin: 0 20px;
      background: url('../assets/images/voice.png') no-repeat;
      background-position: 50%;
      background-size: 75%;
    }
    input[type='range'] {
      appearance: none;
      width: 75%;
      height: 2px;
      margin-top: 10px;
      // background: #c5c6bb;
      background: -webkit-linear-gradient(#ffffff, #ffffff) no-repeat;
      background-size: 0% 100%;
      &::-webkit-slider-thumb {
        appearance: none;
        height: 0.6em;
        width: 0.6em;
        margin-top: 0.01em;
        border-radius: 50%;
        background: #eee !important;
      }
      &::after {
        content: '';
        position: absolute;
        width: 75%;
        height: 2px;
        background-color: #7f8081;
        z-index: -1;
      }
    }
  }
  .box {
    height: 400px;
    overflow: hidden;
    ul.lyric {
      padding: 0 30px;
      // margin-top: 50%;
      li {
        // line-height: 45px;
        height: 36px;
        margin-bottom: 10px;
        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }
    .nolyric {
      height: 400px;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      p {
        margin: 15px 0;
      }
    }
  }
  .active {
    color: #fff;
  }
}
</style>
