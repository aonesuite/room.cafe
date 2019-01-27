<template>
  <component :class="`icon-${type}`" v-bind:is="currentIcon"></component>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Video from "./IconVideo.vue" // 摄像头
import IconChalkboard from "./IconChalkboard.vue" // 黑板
import IconCommentAltLines from "./IconCommentAltLines.vue" // 黑板

const icons: any = {
  "video": Video,
  "chalkboard": IconChalkboard,
  "comment-alt-lines": IconCommentAltLines,
}

@Component
export default class Icon extends Vue {
  @Prop() private type!: string;

  currentIcon = icons[this.type];
}
</script>
