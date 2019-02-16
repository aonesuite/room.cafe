<template>
  <div class="room">
    <!--
    <div class="placeholder">
      <div v-if="RTC.roomState === 2 && RTCUsers.length === 1">You are the only one here.</div>
    </div>
    -->

    <Navbar />

    <div class="hint">
      <div class="hint-exited" v-if="RTC.exited">
        <p>You left the interact room.</p>
        <b-btn variant="success" @click="joinRoom">Reenter the room</b-btn>
      </div>
    </div>

    <WhiteBoard v-if="RTC.roomState === 2 && roomInfo.whiteboard_id && roomInfo.whiteboard_token" />

    <Streams v-if="RTC.roomState === 2" />

    <QuickStartModal @joinRoom="joinRoom" />

    <b-modal
      id="AllowDevices"
      ref="AllowDevices"
      centered
      :lazy="true"
      :no-close-on-backdrop="true"
      size="lg"
      hide-footer
      hide-header
      class="modal-allow-devices">
      <div class="hint-allow">
        <h5>Allow Room Cafe to use your camera and microphone</h5>
        <p>Room Cafe needs access to your camera and microphone so that other participants can see and hear you. Room Cafe will ask you to confirm this decision on each browser and computer you use.</p>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import * as QNRTC from 'pili-rtc-web'
import * as Clarity from '../../constants/clarity'

import Navbar from './Navbar.vue';
import Streams from './Streams.vue';
import WhiteBoard from './WhiteBoard.vue';
import QuickStartModal from '@/components/account/QuickStartModal.vue';

export default Vue.extend({

  components: {
    QuickStartModal,
    Navbar,
    Streams,
    WhiteBoard
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
    ]),

    async joinRoom() {
      await this.getRoom(this.$route.params.id);
      await this.joinRTCRoom({token: this.roomInfo.rtc_token, user: this.user});
    }

  },

  async created () {
    await this.fetchState();

    if (this.signedIn) {
      if (this.$route.name === 'room-quick-start') {
        await this.createRoom();
        this.$router.replace({ name: "room", params: { id: this.roomInfo.uuid } });
      } else {
        await this.joinRoom();
      }
    } else {
      this.$root.$emit('bv::show::modal', 'QuickStartModal');
    }

    document.addEventListener('beforeunload', () => this.RTC.leaveRoom());
    window.addEventListener('beforeunload', () => this.RTC.leaveRoom());
  },
  async destroyed() {
    // 释放本地采集
    for (const track of this.RTC.publishedTracks) {
      await track.release();
    }
    await this.RTC.leaveRoom();
  }

})
</script>
