<template>
  <div class="streams">
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
      deviceAllowed: false,
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

      const promise = QNRTC.deviceManager.getLocalTracks({
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

      window.setTimeout(() => {
        if (this.deviceAllowed) {
          this.$root.$emit('bv::hide::modal', 'AllowDevices');
        } else {
          this.$root.$emit('bv::show::modal', 'AllowDevices');
        }
      }, 10);

      promise.then((tracks) => {
        this.deviceAllowed = true;
        this.$root.$emit('bv::hide::modal', 'AllowDevices');
        tracks.map(track => track.setMaster(true));
        this.RTC.publish(tracks);
      });
    }
  },

  created () {
    this.publish()
  }
})
</script>
