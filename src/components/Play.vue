<template>
  <div class="play" :class="{ paused: paused }">
    <audio
      :src="
        'https://music.163.com/song/media/outer/url?id=' +
          (currentMusic.id == null ? '' : currentMusic.id) +
          '.mp3'
      "
      ref="audio"
      autoplay
      style="width:100%; height: 40px"
    ></audio>
    <!-- autoplay -->
    <transition
      name="animate-play-bar"
      enter-active-class="animate__animated animate__slideInUp"
      leave-active-class="animate__animated animate__slideOutDown"
    >
      <div
        class="play-bar"
        v-show="!isShowFull"
        @click.stop="isShowFull = !isShowFull"
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
        <h5>
          {{ currentMusic.name }} -
          <i
            v-for="(artist, index) in currentMusic.ar != undefined
              ? currentMusic.ar
              : currentMusic.song.artists"
            :key="index"
          >
            {{ artist.name }}
          </i>
        </h5>
        <canvas
          :class="{ pause: !paused }"
          @click.stop="togglePauseState"
          ref="circle"
          width="50"
          height="50"
        ></canvas>
        <span></span>
      </div>
    </transition>
    <transition
      name="animate-play-full"
      enter-active-class="animate__animated animate__slideInUp"
      leave-active-class="animate__animated animate__slideOutDown"
    >
      <div class="play-full" v-show="isShowFull">
        <div
          class="mask"
          :style="
            'background-image: url(' +
              (currentMusic.picUrl
                ? currentMusic.picUrl
                : currentMusic.al.picUrl) +
              ')'
          "
        ></div>
        <PlayFullHeader
          :currentMusic="currentMusic"
          v-bind:isShowFull="isShowFull"
          v-on:update:isShowFull="isShowFull = $event"
        ></PlayFullHeader>
        <keep-alive>
          <PlayFullChart
            v-if="!isShowLyric"
            :isShowLyric="isShowLyric"
            :paused="paused"
            @toggle-show-lyric="isShowLyric = !isShowLyric"
            :currentMusic="currentMusic"
          ></PlayFullChart>
          <PlayFullLryic
            v-else
            :lyric="lyric"
            :isShowLyric="isShowLyric"
            :currentMusic="currentMusic"
            :currentTime="currentTime"
            :audio="audio"
            @toggle-show-lyric="isShowLyric = !isShowLyric"
          ></PlayFullLryic>
        </keep-alive>
        <PlayFullFooter
          :isShowLyric="isShowLyric"
          :currentTime="currentTime"
          :duration="duration"
          :paused="paused"
          :currentIndex="currentIndex"
          :playList="playList"
          @toggle-playing-state="togglePauseState"
          @update-currentTime="handleCurrentTime"
          @play-prev-song="playPrev"
          @play-next-song="playNext"
        ></PlayFullFooter>
      </div>
    </transition>
  </div>
</template>

<script>
import PlayFullHeader from '@/components/PlayFullHeader';
import PlayFullChart from '@/components/PlayFullChart';
import PlayFullLryic from '@/components/PlayFullLryic';
import PlayFullFooter from '@/components/PlayFullFooter';
export default {
  props: ['currentMusic', 'currentIndex', 'playList'],
  components: {
    PlayFullHeader,
    PlayFullChart,
    PlayFullLryic,
    PlayFullFooter
  },
  created() {
    this.getLyric();
  },
  data() {
    return {
      paused: false,
      currentTime: 0,
      duration: 0,
      isShowFull: false,
      isShowLyric: false,
      audio: null,
      lyric: []
    };
  },
  mounted() {
    this.audio = this.$refs.audio;

    this.$refs.audio.addEventListener('pause', () => {
      this.paused = true;
    });
    this.$refs.audio.addEventListener('play', () => {
      this.paused = false;
    });
    this.$refs.audio.addEventListener('durationchange', () => {
      this.duration = this.$refs.audio.duration;
    });
    this.$refs.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.$refs.audio.currentTime || 0;
      this.drawCicle(this.currentTime, this.duration);
    });
    this.$refs.audio.addEventListener('ended', () => {
      this.playNext();
    });
  },
  methods: {
    drawCicle(currentTime, duration) {
      let circle = this.$refs.circle;
      let context = circle.getContext('2d');

      context.clearRect(0, 0, 50, 50);
      context.beginPath();
      context.strokeStyle = 'rgba(0,0,0,0.2)';
      context.lineWidth = 2;

      context.arc(25, 25, 14, 0, Math.PI * 2, false);
      context.stroke();
      context.closePath();

      context.beginPath();
      context.strokeStyle = 'black';
      context.arc(
        25,
        25,
        14,
        Math.PI * -0.5,
        Math.PI * (currentTime / duration) * 2 - 1.5,
        false
      );
      context.stroke();
      context.closePath();
    },
    calculateNext() {
      let nextIndex;
      if (this.currentIndex < this.playList.length - 1) {
        nextIndex = this.currentIndex + 1;
      } else {
        nextIndex = 0;
      }
      return nextIndex;
    },
    calculatePrev() {
      let nextIndex;
      if (this.currentIndex > 0) {
        nextIndex = this.currentIndex - 1;
      } else {
        nextIndex = this.playList.length - 1;
      }
      return nextIndex;
    },
    playNext() {
      let index = this.calculateNext();
      // console.log(index);
      // console.log(this.currentTime);
      this.$emit('update:music', {
        item: this.playList[index],
        index
      });
    },
    playPrev() {
      let index = this.calculatePrev();
      this.$emit('update:music', {
        item: this.playList[index],
        index
      });
    },
    togglePauseState() {
      this.paused = !this.paused;
      if (this.paused) {
        this.$refs.audio.pause();
      } else {
        this.$refs.audio.play();
      }
    },
    toggleShowLyric(e) {
      console.log(e);
    },
    handleCurrentTime(res) {
      this.$refs.audio.currentTime = res;
    },
    parsesLryic(res) {
      let patt = /\[\d{2}:\d{2}\.\d{2,3}\]/gi;
      let arr = res
        .split('\n')
        .filter(e => e)
        .map(str => {
          if (str.match(patt)) {
            let time = str.match(patt)[0].replace(/(\[|\])/gi, '') || '';
            let timeArr = time.split(':');
            time = Number(timeArr[0] * 60 + Number(timeArr[1]));
            let text = str.replace(patt, '');
            return { time, text };
          }
        });
      return arr;
    },
    getLyric() {
      this.axios
        .get('/lyric', {
          params: {
            id: this.currentMusic.id
          }
        })
        .then(response => {
          // console.log(response.data);
          if (response.data.lrc != undefined) {
            this.lyric = this.parsesLryic(response.data.lrc.lyric);
          } else {
            this.lyric = [];
            console.log('歌词为空');
          }
        });
    }
  },
  watch: {
    currentMusic() {
      this.getLyric();
    }
  }
};
</script>

<style lang="less">
.play {
  &.paused {
    .play-bar {
      img {
        animation-play-state: paused;
        -webkit-animation-play-state: paused;
      }
    }
  }
  .play-bar {
    padding: 0 10px;
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    z-index: 11;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.4);
    // background-color: greenyellow;
    background-color: #fff;
    align-items: center;
    img {
      width: 45px;
      height: 45px;
      border: 6px solid black;
      border-radius: 50%;
      box-shadow: 0 0 10px black;
      display: inline-block;
      animation: playing 20s infinite linear;
    }
    canvas {
      background: url('../assets/images/bofang.png') no-repeat;
      background-size: 25%;
      background-position: center center;
      &.pause {
        background: url('../assets/images/zantingtingzhi.png') no-repeat;
        background-size: 25%;
        background-position: center center;
      }
    }
    h5 {
      flex: 1;
      display: flex;
      font-size: 16px;
      flex-wrap: nowrap;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      padding-left: 10px;
      i {
        font-style: normal;
        font-size: 12px;
      }
    }
    span {
      width: 30px;
      height: 30px;
      margin-left: 15px;
      background-color: hotpink;
      background: url('../assets/images/liebiao_1.png') no-repeat;
      background-position: center right;
    }
  }
  .play-full {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 12;
    background: linear-gradient(
      to right,
      rgb(56, 56, 56),
      rgb(95, 95, 95),
      rgb(56, 56, 56)
    );
    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50%;
      transform: scale(1.5);
      filter: blur(50px) brightness(0.6);
      z-index: -1;
      &::after {
        content: '';
        background-color: rgba(0, 0, 0, 0.25);
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
