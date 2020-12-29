<template>
  <div class="comments">
    <ul class="list">
      <li v-for="(comment, index) in commentsList" :key="index">
        <span class="avator"><img :src="comment.user.avatarUrl" alt=""/></span>
        <div class="comment-box">
          <div>
            <div class="meta">
              <h3 class="name">
                {{ comment.user.nickname }} <i class="vip"></i>
              </h3>
              <i class="time">{{ comment.time | formatTime }}</i>
            </div>
          </div>
          <div class="liked">
            <span>{{ comment.likedCount }}</span>
            <div class="praise"></div>
          </div>
          <p class="content">{{ comment.content }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['commentsList'],
  filters: {
    formatTime(value) {
      var dateTime = new Date(value); // 将传进来的字符串或者毫秒转为标准时间
      var year = dateTime.getFullYear();
      var month = dateTime.getMonth() + 1;
      var day = dateTime.getDate();
      var hour = dateTime.getHours();
      var minute = dateTime.getMinutes();
      // var second = dateTime.getSeconds()
      var millisecond = dateTime.getTime(); // 将当前编辑的时间转换为毫秒
      var now = new Date(); // 获取本机当前的时间
      var nowNew = now.getTime(); // 将本机的时间转换为毫秒
      var milliseconds = 0;
      var timeSpanStr;
      milliseconds = nowNew - millisecond;
      if (milliseconds <= 1000 * 60 * 1) {
        // 小于一分钟展示为刚刚
        timeSpanStr = '刚刚';
      } else if (
        1000 * 60 * 1 < milliseconds &&
        milliseconds <= 1000 * 60 * 60
      ) {
        // 大于一分钟小于一小时展示为分钟
        timeSpanStr = Math.round(milliseconds / (1000 * 60)) + '分钟前';
      } else if (
        1000 * 60 * 60 * 1 < milliseconds &&
        milliseconds <= 1000 * 60 * 60 * 24
      ) {
        // 大于一小时小于一天展示为小时
        // timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
        timeSpanStr = hour + ':' + minute;
      } else if (1000 * 60 * 60 * 24 < milliseconds) {
        // 大于一天小于十五天展示位天
        // timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
        timeSpanStr = year + '年' + month + '月' + day + '日';
      }
      return timeSpanStr;
    }
  },
  methods: {
    formatMsgTime(timespan) {
      var dateTime = new Date(timespan); // 将传进来的字符串或者毫秒转为标准时间
      var year = dateTime.getFullYear();
      var month = dateTime.getMonth() + 1;
      var day = dateTime.getDate();
      var hour = dateTime.getHours();
      var minute = dateTime.getMinutes();
      // var second = dateTime.getSeconds()
      var millisecond = dateTime.getTime(); // 将当前编辑的时间转换为毫秒
      var now = new Date(); // 获取本机当前的时间
      var nowNew = now.getTime(); // 将本机的时间转换为毫秒
      var milliseconds = 0;
      var timeSpanStr;
      milliseconds = nowNew - millisecond;
      if (milliseconds <= 1000 * 60 * 1) {
        // 小于一分钟展示为刚刚
        timeSpanStr = '刚刚';
      } else if (
        1000 * 60 * 1 < milliseconds &&
        milliseconds <= 1000 * 60 * 60
      ) {
        // 大于一分钟小于一小时展示为分钟
        timeSpanStr = Math.round(milliseconds / (1000 * 60)) + '分钟前';
      } else if (
        1000 * 60 * 60 * 1 < milliseconds &&
        milliseconds <= 1000 * 60 * 60 * 24
      ) {
        // 大于一小时小于一天展示为小时
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
      } else if (
        1000 * 60 * 60 * 24 < milliseconds &&
        milliseconds <= 1000 * 60 * 60 * 24 * 15
      ) {
        // 大于一天小于十五天展示位天
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
      } else if (
        milliseconds > 1000 * 60 * 60 * 24 * 15 &&
        year === now.getFullYear()
      ) {
        timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
      } else {
        timeSpanStr =
          year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
      }
      return timeSpanStr;
    }
  }
};
</script>

<style lang="less" scoped>
.comments {
  .list {
    display: flex;
    flex-flow: column;
    li {
      margin: 10px 0 0;
      width: 100%;
      display: flex;
      .avator {
        display: inline-block;
        width: 30px;
        height: 35px;
        margin: 0 10px;
        border-radius: 50%;
        img {
          border-radius: 50%;
          width: 30px;
          height: 30px;
        }
      }
      .comment-box {
        position: relative;
        flex: 1;
        border-bottom: 1px solid #eee;
        padding: 0 10px 11px 0;

        div {
          .meta {
            width: 80%;
            .name {
              font-size: 14px;
              color: #666;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }
            .time {
              font-style: normal;
              font-size: 12px;
              color: #999;
            }
          }
        }
        .content {
          font-size: 15px;
        }
        .liked {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          span {
            font-size: 12px;
            color: #999;
            padding: 0 2px;
          }
          .praise {
            width: 20px;
            height: 20px;
            background: url('../assets/images/praise.png') no-repeat;
            background-size: cover;
            background-position: 0px -1px;
          }
        }
      }
    }
  }
}
</style>
