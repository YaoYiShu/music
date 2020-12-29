<template>
  <section>
    <BorderedTitle><slot></slot></BorderedTitle>
    <ul>
      <SongItem
        v-for="(song, index) in newSongs"
        :key="song.id"
        :item="song"
        :index="index"
        @update:music="$emit('update:music', $event)"
        @update:playlist="$emit('update:playlist', newSongs)"
        :isHot="song.song.exclusive"
      ></SongItem>
    </ul>
  </section>
</template>

<script>
import BorderedTitle from '@/components/BorderedTitle';
import SongItem from '@/components/SongItem';
export default {
  props: {
    newSongs: {
      type: Array
    }
  },
  components: {
    BorderedTitle,
    SongItem
  }
};
</script>

<style lang="less">
ul {
  margin-bottom: 50px;
}
</style>
