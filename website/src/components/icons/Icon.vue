<template>
  <component :class="`icon-${type}`" v-bind:is="currentIcon"></component>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Video from "./Video.vue";                     // 摄像头
import VideoSlash from "./VideoSlash.vue";           // 摄像头(禁用)
import Microphone from "./Microphone.vue";           // 麦克风
import MicrophoneSlash from "./MicrophoneSlash.vue"; // 麦克风(禁用)
import Phone from "./Phone.vue";                     // 电话
import Chalkboard from "./Chalkboard.vue";           // 黑板
import CommentAltLines from "./CommentAltLines.vue"; // 评论，消息
import Cog from "./Cog.vue";                         // 齿轮，设置
import ScreenFull from "./ScreenFull.vue";           // 进入全屏
import ScreenNormal from "./ScreenNormal.vue";       // 退出全屏
import ScreenEnter from "./ScreenEnter.vue";         // 进入全屏
import ScreenExit from "./ScreenExit.vue";           // 退出全屏
import ScreenShare from "./ScreenShare.vue";         // 屏幕分享

const icons: any = {
  "video": Video,
  "video-slash": VideoSlash,
  "microphone": Microphone,
  "microphone-slash": MicrophoneSlash,
  "phone": Phone,
  "chalkboard": Chalkboard,
  "comment-alt-lines": CommentAltLines,
  "cog": Cog,
  "screen-full": ScreenFull,
  "screen-normal": ScreenNormal,
  "screen-enter": ScreenEnter,
  "screen-exit": ScreenExit,
  "screen-share": ScreenShare,
}

@Component
export default class Icon extends Vue {
  @Prop() private type!: string;

  currentIcon = icons[this.type];
}
</script>

<style lang="scss">
.phone-hang-up{
  transform: rotate(0.6251turn);
}
</style>
