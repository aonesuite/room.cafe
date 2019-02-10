<template>
  <div class="room">

    <Navbar />

    <Streams v-if="RTC.roomState === 2" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import * as QNRTC from 'pili-rtc-web'
import * as Clarity from '../../constants/clarity'

import Navbar from './Navbar.vue';
import Streams from './Streams.vue';

export default Vue.extend({

  components: {
    Navbar,
    Streams
  },

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
    ])

  },

  async created () {
    await this.fetchState();

    if (this.signedIn) {
      if (this.$route.name === 'room-quick-start') {
        await this.createRoom();
        this.$router.replace({ name: "room", params: { id: this.roomInfo.uuid } });
      } else {
        await this.getRoom(this.$route.params.id);
        await this.joinRTCRoom({token: this.roomInfo.rtc_token, user: this.user});
      }
    } else {
      // eslint-disable-next-line
      console.log('not signedIn')
      /* eslint-disable */
    }
  },
  async destroyed() {
    // 释放本地采集
    for (const track of this.RTC.publishedTracks) {
      await track.release()
    }
    await this.RTC.leaveRoom();
  }

})
</script>
