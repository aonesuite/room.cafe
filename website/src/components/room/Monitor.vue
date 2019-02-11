<template>
  <div :id="stream.id" class="monitor" :class="{active: StageStreamId === stream.id}">

    <div class="cover">
      <img class="avatar" :src="`${stream.user.avatar}?imageView2/1/w/352/h/198/q/100`" width="176">
    </div>

    <div
      ref="player"
      class="player"
      :class="{
        'video-mute': stream.videoTrack && stream.videoTrack.info.muted,
        'audio-mute': stream.audioTrack && stream.audioTrack.info.muted
      }">
    </div>

    <div class="info">
      <span>{{ stream.user.name }}</span>
      <small class="ml-2" v-if="stream.tag === 'screen'">Screen</small>

      <div class="audio-status" :class="{mute: stream.audioTrack.info.muted}" v-if="stream.audioTrack">
        <canvas class="audio-wave" ref="audioWave" width="76" height="20"></canvas>
      </div>
    </div>

    <div class="actions">
      <b-btn size="sm" variant="link" @click="screenFull" v-show="StageStreamId !== stream.id">
        <Icon type="screen-full" width="22" height="22" />
      </b-btn>
      <b-btn size="sm" variant="link" @click="screenNormal" v-show="StageStreamId === stream.id">
        <Icon type="screen-normal" width="22" height="22" />
      </b-btn>
    </div>

  </div>
</template>

<script lang="ts">
var cancelAnimationFrame = window.cancelAnimationFrame;

import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
import * as QNRTC from 'pili-rtc-web';
import { Stream } from '../../types/stream';

export default Vue.extend({
  props: {
    stream: {
      type: Stream
    }
  },
  data () {
    return {
      frame: {
        id: 0
      }
    }
  },
  computed: {
    ...mapState("room", [
      "RTC",
      "StageStreamId"
    ])
  },
  methods: {

    ...mapMutations("room", [
      "setStageStreamId"
    ]),

    // 绘制音量柱
    drawAudioVolume(track: QNRTC.Track) {
      if (!track) return;

      const canvas = this.$refs.audioWave as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const columns = 8;
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const normalColor = "rgba(255, 255, 255, 0.45)";
      const activeColor = "#81D8D0";

      const animationFrameFunc = (track: QNRTC.Track, ctx: CanvasRenderingContext2D) => {
        if (!track) return;

        const data = track.getCurrentFrequencyData()
        const avg = data.reduce((accumulator, currentValue) => accumulator + currentValue) / data.length;
        const dB = 20 * Math.log10(avg / 255);
        const volume = Math.round((100 + dB) * 80 / 120 / 10);

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < columns; i += 1) {
          var w = 5;
          var h = height / columns * (i + 1);
          var x = i * 10;
          var y = height - h;
          ctx.fillStyle = volume < i ? normalColor : (track.info.muted ? normalColor : activeColor);
          ctx.fillRect(x, y, w, h);
        }

        this.frame.id = requestAnimationFrame(() => animationFrameFunc(track, ctx));
      }

      this.frame.id = requestAnimationFrame(() => animationFrameFunc(track, ctx));

      track.once("release", () => {
        cancelAnimationFrame(this.frame.id);
      })
    },

    // 播放
    play(track: QNRTC.Track) {
      this.$el.setAttribute(`data-track-${track.info.kind}`, track.info.trackId as string);

      var muted = track.info.kind === 'audio' && track.userId === this.RTC.userId;
      const ele = this.$refs.player as HTMLElement;
      track.play(ele, muted);
    },

    screenFull() {
      this.setStageStreamId(this.stream.id);
    },

    screenNormal() {
      this.setStageStreamId("");
    }
  },
  created () {

  },
  mounted () {
    if (this.stream.audioTrack) {
      this.drawAudioVolume(this.stream.audioTrack as QNRTC.Track);
      this.play(this.stream.audioTrack);
    }

    if (this.stream.videoTrack) {
      this.play(this.stream.videoTrack);
    }
  },
  destroyed() {
    if (this.frame.id) cancelAnimationFrame(this.frame.id);
  }
})
</script>
