<template>
  <component role="img" :class="`icon-${type}`" v-bind:is="currentIcon"></component>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

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
import SignOutAlt from "./SignOutAlt.vue";           // 退出

import MousePointer from "./MousePointer.vue"; // 默认鼠标， 选择工具
import PencilAlt from "./PencilAlt.vue";       // 铅笔
import Text from "./Text.vue";                 // 文字
import Rectangle from "./Rectangle.vue";       // 矩形
import Square from "./Square.vue";             // 正方形
import Circle from "./Circle.vue";             // 圆形
import Eraser from "./Eraser.vue";             // 橡皮擦

const icons: any = {
  "video":             Video,
  "video-slash":       VideoSlash,
  "microphone":        Microphone,
  "microphone-slash":  MicrophoneSlash,
  "phone":             Phone,
  "chalkboard":        Chalkboard,
  "comment-alt-lines": CommentAltLines,
  "cog":               Cog,
  "screen-full":       ScreenFull,
  "screen-normal":     ScreenNormal,
  "screen-enter":      ScreenEnter,
  "screen-exit":       ScreenExit,
  "screen-share":      ScreenShare,
  "sign-out-alt":      SignOutAlt,
  "mouse-pointer":     MousePointer,
  "pencil-alt":        PencilAlt,
  "text":              Text,
  "rectangle":         Rectangle,
  "square":            Square,
  "circle":            Circle,
  "eraser":            Eraser,
}

@Component
export default class Icon extends Vue {
  @Prop() private type!: string;

  currentIcon = icons[this.type];

  @Watch('type', { immediate: true })
  onIconTypeChanged(val: string, oldVal: string) {
    this.currentIcon = icons[val];
  }
}
</script>

<style lang="scss">
.phone-hang-up{
  transform: rotate(0.6251turn);
}
</style>
