<template>
  <!-- v-if="!$root.isloading" -->
  <li
    class="song-item"
    @click="
      $emit('update:music', { item, index });
      $emit('update:playlist');
    "
    :style="!isShowHot ? 'padding-left:10px' : ''"
  >
    <!-- 歌曲索引 -->
    <span class="song-index" v-show="isShowHot"
      ><template v-if="isplaylist">
        {{ index + 1 }}
      </template>
      <template v-else>
        {{ (index + 1) | formatId }}
      </template>
    </span>
    <!-- 歌曲列表项 -->
    <div class="content">
      <!-- 在search页显示 -->
      <template v-if="isSearch">
        <li></li>
      </template>
      <h5>
        {{ item.name != undefined ? item.name : item.al.name }}
      </h5>
      <p class="song-content" :class="{ hot: isHot }">
        <span
          v-for="(artist, index) in item.song != undefined
            ? item.song.artists
            : item.ar"
          :key="index"
        >
          <template v-if="index"> / </template>
          <!-- {{ artist.name != undefined ? artist.name : artist.artists[0].name }} -->
          {{ artist.artists ? artist.artists[0].name : artist.name }}
        </span>
        <span v-if="item.artists">
          {{ item.artists[0].name }}
        </span>
        - {{ item.name != undefined ? item.name : item.al.name }}
      </p>
    </div>
    <div class="icon"></div>
  </li>
</template>

<script>
export default {
  props: ['item', 'index', 'isShowHot', 'isHot', 'isplaylist', 'isSearch'],
  filters: {
    formatId(value) {
      if (value < 10) {
        return '0' + value;
      } else {
        return value;
      }
    }
  }
};
</script>

<style lang="less">
.song-item {
  position: relative;
  display: flex;
  // padding: 0 10px 5px 10px;
  align-items: center;
  &:nth-child(-n + 4) span.song-index {
    color: #df3436;
  }
  .song-index {
    width: 40px;
    height: 55px;
    display: inline-block;
    line-height: 55px;
    text-align: center;
  }
  div.content {
    height: 55px;
    flex: 1;
    padding: 5px 0;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
    h5 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    p {
      padding-top: 5px;
      font-size: 12px;
      color: #888888;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      &.hot::before {
        content: '';
        width: 1em;
        height: 1em;
        display: inline-block;
        background: url('../assets/images/index_icon_2x.png') no-repeat;
        background-size: 166px 97px;
        background-position: 0px 3px;
      }
    }
  }
  .icon {
    width: 42px;
    height: 55px;
    background: url('../assets/images/index_icon_2x.png') no-repeat;
    background-size: 166px 98px;
    background-position: -16px 15px;
    border-bottom: 1px solid #eee;
  }
}
</style>
