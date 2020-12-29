<template>
  <section>
    <BorderedTitle><slot></slot></BorderedTitle>
    <ul class="playlist">
      <PlayListItem
        v-for="(item, index) in currentRecommends"
        :key="index"
        :item="item"
      ></PlayListItem>
    </ul>
  </section>
</template>

<script>
import BorderedTitle from '@/components/BorderedTitle';
import PlayListItem from '@/components/PlayListItem';
export default {
  props: {
    currentRecommends: {
      type: Array
    }
  },
  components: {
    BorderedTitle,
    PlayListItem
  }
};
</script>

<style lang="less">
.playlist {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0;
}
</style>
