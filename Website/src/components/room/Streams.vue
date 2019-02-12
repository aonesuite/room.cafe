<template>
  <div class="streams">
    <div class="actions">
      <b-btn size="sm" variant="link" class="btn-microphone">
        <Icon type="microphone" height="22" />
        <Icon type="microphone-slash" height="22" />
      </b-btn>

      <b-btn size="sm" variant="link" class="btn-phone">
        <Icon type="phone" height="22" class="phone-hang-up" />
      </b-btn>

      <b-btn size="sm" variant="link" class="btn-video">
        <Icon type="video" height="22" />
        <Icon type="video-slash" height="20" />
      </b-btn>
    </div>

    <Monitor :stream="stream" v-for="stream in RTC.streams" :key="`${stream.user.userId}_${stream.tag}`" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import * as QNRTC from 'pili-rtc-web';
import * as Clarity from '../../constants/clarity';
import Monitor from './Monitor.vue';

export default Vue.extend({
  components: {
    Monitor
  },

  computed: {
    ...mapState("user", [
      "signedIn",
      "user"
    ]),

    ...mapState("room", [
      "roomInfo",
      "RTC"
    ])
  },

  methods: {
    // 发布本地音视频
    async publish() {
      const clarity = Clarity.getClarity("HD");
      var tracks = await QNRTC.deviceManager.getLocalTracks({
        audio: {
          enabled: true,
          tag: "master",
        },
        video: {
          enabled: true,
          tag: "master",
          width: clarity.width,
          height: clarity.height,
          bitrate: clarity.bitrate,
        }
      });

      tracks.map(track => track.setMaster(true));
      await this.RTC.publish(tracks);
    }
  },

  created () {
    this.publish()
  }
})
</script>
