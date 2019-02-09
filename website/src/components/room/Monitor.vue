<template>
  <div class="monitor">

    <div class="cover">
      <img class="avatar" :src="`${stream.user.avatar}?imageView2/1/w/352/h/198/q/100`" width="176">
    </div>

    <div ref="player" class="player" :class="{ 'video-mute': stream.videoTrack && stream.videoTrack.info.muted, 'audio-mute': stream.audioTrack && stream.audioTrack.info.muted }">

      <div class="audio-status" :class="{mute: stream.audioTrack.info.muted}" v-if="stream.audioTrack">
        <canvas class="audio-wave" ref="audioWave" width="76" height="20"></canvas>
      </div>
    </div>

    <div class="info">
      <span>{{ stream.user.name }}</span>
      <small class="ml-2" v-if="stream.tag === 'screen'">Screen</small>
    </div>

  </div>
</template>

<script>
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame

import Vue from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default Vue.extend({
  props: {
    stream: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      frame: {
        id: null
      }
    }
  },
  computed: {
    ...mapState("room", [
      "RTC"
    ])
  },
  methods: {

    // 绘制音量柱
    drawAudioVolume(track) {
      if (!track) return

      const canvas = this.$refs.audioWave
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      const columns = 8
      const width = ctx.canvas.width
      const height = ctx.canvas.height
      const normalColor = 'rgba(255, 255, 255, 0.45)'
      const activeColor = '#81D8D0'

      const animationFrameFunc = (track, ctx) => {
        const data = track.getCurrentFrequencyData()
        const avg = data.reduce((accumulator, currentValue) => accumulator + currentValue) / data.length
        const dB = 20 * Math.log10(avg / 255)
        const volume = Math.round((100 + dB) * 80 / 120 / 10)

        ctx.clearRect(0, 0, width, height)

        for (let i = 0; i < columns; i += 1) {
          var w = 5
          var h = height / columns * (i + 1)
          var x = i * 10
          var y = height - h
          ctx.fillStyle = volume < i ? normalColor : (track.info.muted ? normalColor : activeColor)
          ctx.fillRect(x, y, w, h)
        }

        this.frame.id = requestAnimationFrame(() => animationFrameFunc(track, ctx))
      }

      this.frame.id = requestAnimationFrame(() => animationFrameFunc(track, ctx))

      track.once('release', () => {
        cancelAnimationFrame(this.frame.id)
      })
    },

    // 播放
    play(track) {
      this.$el.setAttribute(`data-track-${track.info.kind}-id`, track.info.trackId)
      this.$el.setAttribute(`data-track-${track.info.kind}-tag`, track.info.tag)

      var muted = track.info.kind === 'audio' && track.userId === this.RTC.userId
      track.play(this.$refs.player, muted)
    }
  },
  created () {

  },
  mounted () {
    if (this.stream.audioTrack) {
      this.drawAudioVolume(this.stream.audioTrack)
      this.play(this.stream.audioTrack)

      // this.$watch('stream.audioTrack', function (track) {
      //   if (track !== undefined && track.mediaElement === undefined) {
      //     if (this.frame.id) cancelAnimationFrame(this.frame.id)
      //     this.drawAudioVolume(this.stream.audioTrack)
      //     track.play(this.$refs.player)
      //   }
      // })
    }

    if (this.stream.videoTrack) {
      this.play(this.stream.videoTrack)
      // this.$watch('stream.videoTrack', function (track) {
      //   if (track !== undefined && track.mediaElement === undefined) {
      //     track.play(this.$refs.player)
      //   }
      // })
    }
  },
  destroyed() {
    if (this.frame.id) cancelAnimationFrame(this.frame.id)
  }
})
</script>
