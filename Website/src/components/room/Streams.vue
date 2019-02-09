<template>
  <div class="streams">
    <ul class="list-inline">
      <li class="list-inline-item" v-for="user in RTCUsers" :key="user.id" :id="user.userId">
        <div class="info">{{ user.name }}</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import * as QNRTC from 'pili-rtc-web'
import * as Clarity from '../../constants/clarity'

export default Vue.extend({

  computed: {
    ...mapState("user", [
      "signedIn",
      "user"
    ]),

    ...mapState("room", [
      "roomInfo",
      "RTC",
      "RTCUsers"
    ])
  },

  methods: {
    ...mapActions("user", [
      'fetchState'
    ]),

    ...mapActions("room", [
      "createRoom",
      "getRoom",
      "joinRTCRoom"
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

      const containerElement = document.getElementById(`user_${this.user.id}`);
      if (containerElement === null) return;

      for (const track of tracks) {
        if (track.info.tag === "audio") continue;
        track.play(containerElement, true);
      }
    },

    async subscribe(room: QNRTC.TrackModeSession, trackInfoList: QNRTC.TrackBaseInfo[]) {
      const trackIds = trackInfoList.map(info => info.trackId || '');
      const remoteTracks = await room.subscribe(trackIds);

      for (const remoteTrack of remoteTracks) {
        const containerElement = document.getElementById(`user_${remoteTrack.userId}`);
        if (containerElement === null) continue;
        remoteTrack.play(containerElement);
      }
    },

    // 这里的参数 this.RTC 是指刚刚加入房间时初始化的 Session 对象, 同上
    autoSubscribe() {
      const trackInfoList = this.RTC.trackInfoList;

      // eslint-disable-next-line
      console.log("room current trackInfo list", trackInfoList)
      /* eslint-disable */

      this.subscribe(this.RTC, trackInfoList)
        .then(() =>
          // eslint-disable-next-line
          console.log("subscribe success!"))
          /* eslint-disable */
        .catch(e =>
          // eslint-disable-next-line
          console.error("subscribe error", e))
          /* eslint-disable */

      // 添加事件监听，当房间中出现新的 Track 时就会触发，参数是 trackInfo 列表
      this.RTC.on("track-add", (trackInfoList: QNRTC.TrackBaseInfo[]) => {
        // eslint-disable-next-line
          console.log("get track-add event!", trackInfoList);
        /* eslint-disable */

        this.subscribe(this.RTC, trackInfoList)
          .then(() =>
            // eslint-disable-next-line
            console.log("subscribe success!"))
            /* eslint-disable */
          .catch(e =>
            // eslint-disable-next-line
            console.error("subscribe error", e))
            /* eslint-disable */
      })
    }
  },

  created () {
    this.publish()
  }
})
</script>
