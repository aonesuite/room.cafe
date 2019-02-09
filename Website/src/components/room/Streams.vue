<template>
  <div class="streams">
    <ul class="list-inline">
      <li class="list-inline-item" v-for="stream in RTC.streams" :key="`${stream.user.userId}_${stream.tag}`">
        <Monitor :stream="stream" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import * as QNRTC from 'pili-rtc-web'
import * as Clarity from '../../constants/clarity'
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
    ...mapActions("user", [
      'fetchState'
    ]),

    ...mapActions("room", [
      "createRoom"
    ]),

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
      })

      tracks.map(track => track.setMaster(true))

      await this.RTC.publish(tracks)

      // eslint-disable-next-line
      console.log("publish tracks", tracks);
      /* eslint-disable */

      // const containerElement = document.getElementById(`user_${this.user.id}`);
      // if (containerElement === null) return;

      // for (const track of tracks) {
      //   if (track.info.tag === "audio") continue;
      //   track.play(containerElement, true);
      // }
    }
  },

  created () {
    this.publish()
  }
})
</script>
