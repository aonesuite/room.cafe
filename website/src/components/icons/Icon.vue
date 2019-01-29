<template>
  <component :class="`icon-${type}`" v-bind:is="currentIcon"></component>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Video from "./Video.vue"                     // 摄像头
import Chalkboard from "./Chalkboard.vue"           // 黑板
import CommentAltLines from "./CommentAltLines.vue" // 评论，消息

const icons: any = {
  "video": Video,
  "chalkboard": Chalkboard,
  "comment-alt-lines": CommentAltLines,
}

@Component
export default class Icon extends Vue {
  @Prop() private type!: string;

  currentIcon = icons[this.type];
}
</script>
