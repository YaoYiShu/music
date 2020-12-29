<template>
  <div class="play-full-chart" @click.stop="$emit('toggle-show-lyric')">
    <!-- <div class="play-full-chart"> -->
    <span class="chart-bar" :class="{ active: paused }"></span>
    <div class="chart-bg">
      <div
        class="chart"
        :style="
          paused
            ? 'animation-play-state: paused; -webkit-animation-play-state: paused;'
            : ''
        "
      >
        <img
          :src="
            currentMusic.picUrl
              ? currentMusic.picUrl
              : currentMusic.al.picUrl +
                '?imageView=1&type=webp&thumbnail=100x0'
          "
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['isShowLyric', 'currentMusic', 'paused']
};
</script>

<style lang="less">
.play-full-chart {
  position: relative;
  display: flex;
  width: 100%;
  height: 440px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  .chart-bar {
    display: inline-block;
    width: 120px;
    height: 120px;
    position: absolute;
    margin-top: 20px;
    transform-origin: left top;
    transform: translate(40%) rotate(-30deg);
    top: 0;
    background: url(//s3.music.126.net/mobile-new/img/needle-ab.png?4b81da043356110081e5ccaed2e6f2ad=)
      no-repeat;
    background-size: contain;
    z-index: 2;
    &.active {
      transform: translate(40%) rotate(0deg);
    }
  }
  .chart-bg {
    width: 270px;
    height: 270px;
    border-radius: 50%;
    background-color: rgba(87, 84, 84, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    .chart {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      display: flex;
      text-align: center;
      justify-content: center;
      align-items: center;
      animation: playing 20s linear infinite;
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        display: inline-block;
        background: url(//s3.music.126.net/mobile-new/img/disc.png?d3bdd1080a72129346aa0b4b4964b75f=)
          no-repeat;
        background-size: cover;
      }
      img {
        width: 60%;
        height: 60%;
        border-radius: 50%;
      }
    }
  }
}
@keyframes playing {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
