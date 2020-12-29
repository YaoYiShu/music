<template>
  <div class="play-full-footer">
    <div class="play-full-setting" v-show="!isShowLyric">
      <span
        class="iconfont"
        :class="!islike ? 'icon-like' : 'icon-xihuan1'"
        @click="islike = !islike"
      ></span>
      <span class="iconfont icon-xiazai"></span>
      <span class="iconfont icon-vip"></span>
      <span class="iconfont icon-liuyan"></span>
      <span class="iconfont icon-more-vertical"></span>
    </div>
    <div class="play-full-bar">
      <h6 class="start">{{ formatCurrentTime }}</h6>
      <input
        type="range"
        :min="0"
        :max="duration"
        :value="currentTime"
        @input="inputHandle"
        ref="range"
      />

      <h6 class="end">{{ formatDuration }}</h6>
    </div>
    <div class="play-full-playing">
      <span class="iconfont icon-xunhuan-wangyiicon"></span>
      <span
        class="iconfont icon-shangyishou"
        @click="$emit('play-prev-song')"
      ></span>
      <span
        class="iconfont"
        :class="paused ? 'icon-bofang1' : 'icon-zantingtingzhi2'"
        @click="$emit('toggle-playing-state')"
      ></span>
      <span
        class="iconfont icon-xiayishou"
        @click="$emit('play-next-song')"
      ></span>
      <span class="iconfont icon-list"></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formatDuration: '00:00',
      formatCurrentTime: '00:00',
      islike: false
    };
  },
  props: ['duration', 'currentTime', 'paused', 'currentIndex', 'isShowLyric'],
  methods: {
    inputHandle(e) {
      this.$emit('update-currentTime', e.target.value);
    },
    formatTime(time) {
      let tempMin = parseInt(time / 60);
      let tempSec = parseInt(time % 60);
      let curMin = tempMin < 10 ? '0' + tempMin : tempMin;
      let curSec = tempSec < 10 ? '0' + tempSec : tempSec;
      return curMin + ':' + curSec;
    }
  },
  watch: {
    duration(n) {
      this.formatDuration = this.formatTime(n);
    },
    currentTime(n) {
      this.formatCurrentTime = this.formatTime(n);
      this.$refs.range.style.backgroundSize = (n / this.duration) * 100 + '%';
    }
  }
};
</script>

<style lang="less">
.play-full-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 10px;
  text-align: center;
  span {
    flex: 1;
    width: 32px;
    height: 32px;
    display: inline-block;
    font-size: 24px;
    color: #ccd1d5;
  }
  .play-full-setting {
    display: flex;
    .icon-xihuan1 {
      color: #e25f55;
    }
  }
  .play-full-bar {
    padding-top: 10px;
    display: flex;
    input[type='range'] {
      -webkit-appearance: none;
      width: 100%;
      height: 1px;
      margin-top: 0.5em;
      background: -webkit-linear-gradient(#ffffff, #ffffff) no-repeat;
      background-size: 0% 100%;
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 0.5em;
        width: 0.5em;
        margin-top: 0.01em;
        border-radius: 50%;
        background: #fff !important;
      }
      &::after {
        content: '';
        position: absolute;
        width: 73%;
        height: 1px;
        background-color: #7f8081;
        z-index: -1;
      }
    }
    h6 {
      padding: 0 5px;
      font-size: 12px;
      transform: scale(0.8);
      &.start {
        color: #fff;
      }
      &.end {
        color: #999;
      }
    }
  }
  .play-full-playing {
    display: flex;
    margin: 30px 0 22px 0;
    span.icon-zantingtingzhi2,
    span.icon-bofang1 {
      font-size: 50px;
      line-height: 0.5em;
      color: #eee;
    }
    span {
      &:active {
        color: #fff;
      }
    }
  }
}
</style>
