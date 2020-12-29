<template>
  <div class="play-full-header" @click="$emit('update:isShowFull', false)">
    <span class="icon"></span>
    <h5>
      <i class="songName">{{ currentMusic.name }}</i>
      <p>
        <i
          class="artist"
          v-for="(artist, index) in currentMusic.ar != undefined
            ? currentMusic.ar
            : currentMusic.song.artists"
          :key="index"
        >
          <template v-if="index">/</template>
          {{ artist.name }}
        </i>
      </p>
    </h5>
    <i class="share"></i>
  </div>
</template>

<script>
export default {
  props: ['isShowFull', 'currentMusic']
};
</script>

<style lang="less">
.play-full-header {
  padding: 0 10px;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  text-align: center;
  span {
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
    transform: rotate(-135deg);
    background: url('../assets/images/jiao.png') no-repeat;
    background-size: 70%;
    background-position: center center;
  }
  h5 {
    flex: 1;
    i.songName {
      font-style: normal;
      font-size: 18px;
      color: #fff;
      // 问题一：文字过长时处理
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      i.artist {
        font-style: normal;
        color: #9b8f98;
        font-size: 14px;
        &:last-of-type:after {
          content: '';
          display: inline-block;
          width: 11px;
          height: 11px;
          background: url('../assets/images/jiao.png') no-repeat;
          transform: rotate(135deg);
          opacity: 0.4;
          background-size: cover;
        }
      }
    }
  }
  i.share {
    margin-left: 20px;
    width: 24px;
    height: 24px;
    background: url('../assets/images/share.png') no-repeat;
    background-size: 100%;
  }
}
</style>
