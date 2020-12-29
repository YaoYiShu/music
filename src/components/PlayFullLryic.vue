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
      <div
        class="menu-container"
        ref="menuContainer"
        v-show="fullLyric.length != 0"
      >
        <!-- 这个是内容 -->
        <ul
          class="lyric"
          ref="lyric"
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend"
        >
          <li
            :class="{ active: activeIndex === index }"
            v-for="(item, index) in fullLyric"
            :key="index"
            ref="li"
            :data-index="index"
          >
            {{ item.text || '-' }}
          </li>
        </ul>
      </div>
      <div class="nolyric" v-show="fullLyric.length === 0">
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
  props: ['isShowLyric', 'currentMusic', 'currentTime', 'audio', 'lyric'],
  data() {
    return {
      activeIndex: 0,
      volume: 0,
      scrollY: 0,
      fullLyric: null
    };
  },
  created() {
    this.fullLyric = this.lyric;
    this.render();
    this.saveData();
  },
  mounted() {
    this.$refs.voice.style.backgroundSize =
      (this.$refs.voice.value / this.$refs.voice.max) * 100 + '%';
  },
  watch: {
    lyric(n) {
      this.fullLyric = n;
    },
    currentMusic() {
      this.saveData();
    },
    volume(n) {
      this.$refs.voice.style.backgroundSize =
        (n / this.$refs.voice.max) * 100 + '%';
    },
    scrollY(n) {
      var currentTime = this.currentTime;
      this.i = this.fullLyric.findIndex(ele => {
        return ele.time > currentTime;
      });

      this.activeIndex = this.i - 1 + n;
      this.$refs.lyric.style.marginTop = 200 - 52 * (this.i - 1 + n) + 'px';
    }
  },
  methods: {
    render() {
      if (this.fullLyric) {
        var that = this;
        this.audio.addEventListener('timeupdate', function() {
          if (!that.touching) {
            for (let i = 0; i < that.lyric.length; i++) {
              this.i = i;
              if (that.lyric[i]) {
                if (this.currentTime > parseInt(that.lyric[i].time)) {
                  const index = that.$refs.li[i]
                    ? that.$refs.li[i].dataset.index
                    : '';
                  if (i === parseInt(index)) {
                    that.activeIndex = i;
                    that.$refs.lyric.style.marginTop = 200 - 52 * i + 'px';
                  }
                }
              }
            }
            // var i = that.fullLyric.findIndex(ele => {
            //   return ele.time > that.currentTime;
            // });
            // that.activeIndex = i - 1;
            // that.$refs.lyric.style.marginTop = 200 - 52 * (i - 1) + 'px';
          }
        });
      }
    },
    saveData() {
      // localStorage.setItem
      localStorage.lyric = JSON.stringify(this.lyric);
    },
    updateVoice(e) {
      // console.log(e.target.value);
      this.volume = e.target.value;
      this.audio.volume = e.target.value / 100;
    },
    touchstart(e) {
      this.touching = true;
      this.y = e.touches[0].clientY;
    },
    touchmove(e) {
      this.scrollY = Math.floor((this.y - e.touches[0].clientY) / 52);
    },
    touchend() {
      this.touching = false;
      // if(this.activeIndex)
      if (this.lyric[this.activeIndex]) {
        let ct = this.lyric[this.activeIndex].time;
        this.audio.currentTime = ct;
      }
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
      justify-content: center;
      align-items: center;
      // margin-top: 50%;
      li {
        height: 42px;
        vertical-align: middle;
        // line-height: 30px;
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
