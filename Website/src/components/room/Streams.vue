<template>
  <div class="streams">
    <div class="actions">
      <b-btn size="sm" variant="link" class="btn-microphone" @click="switchMicrophone">
        <Icon :type="microphoneMuted ? 'microphone-slash' : 'microphone'" height="22" />
      </b-btn>

      <b-btn size="sm" variant="link" class="btn-phone" @click="hangUp">
        <Icon type="phone" height="22" class="phone-hang-up" />
      </b-btn>

      <b-btn size="sm" variant="link" class="btn-video" @click="switchVideo">
        <Icon :type="videoMuted ? 'video-slash' : 'video'" height="22" />
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

  data() {
    return {
      microphoneMuted: false,
      videoMuted: false,
    }
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
    },

    switchMicrophone() {
      this.RTC.muteStream("master", "audio", !this.microphoneMuted);
      this.microphoneMuted = !this.microphoneMuted;
    },

    hangUp() {
      this.RTC.leaveRoom();
    },

    switchVideo() {
      this.RTC.muteStream("master", "video", !this.videoMuted);
      this.videoMuted = !this.videoMuted;
    }
  },

  created () {
    this.publish()
  }
})
</script>
