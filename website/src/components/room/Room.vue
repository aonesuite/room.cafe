<template>
  <div class="room" :class="{'chat-open': ChatPopUp}">
    <!--
    <div class="placeholder">
      <div v-if="RTC.roomState === 2 && RTCUsers.length === 1">You are the only one here.</div>
    </div>
    -->

    <Navbar />

    <div class="hint">
      <div class="hint-init" v-if="RTC.roomState === 1">
        <b-spinner variant="light" label="Loading..." style="width: 5rem; height: 5rem;" />
      </div>

      <div class="hint-exited" v-if="RTC.exited && RTC.roomState === 0">
        <p>You left the interact room.</p>
        <b-btn variant="success" class="mx-1" @click="joinRoom">Reenter the room</b-btn>
        <b-btn variant="success" class="mx-1" @click="goHome">Go home</b-btn>
      </div>
    </div>

    <WhiteBoard v-if="RTC.roomState === 2 && roomInfo.whiteboard_id && roomInfo.whiteboard_token" />

    <Streams v-if="RTC.roomState === 2" />

    <Chat v-if="RTC.roomState === 2" />

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

import Navbar from './Navbar.vue';
import Streams from './Streams.vue';
import WhiteBoard from './WhiteBoard.vue';
import Chat from './Chat.vue';
import QuickStartModal from '@/components/account/QuickStartModal.vue';

export default Vue.extend({

  components: {
    QuickStartModal,
    Navbar,
    Streams,
    WhiteBoard,
    Chat
  },

  computed: {
    ...mapState("user", [
      "signedIn",
      "user"
    ]),

    ...mapState("room", [
      "roomInfo",
      "RTC",
      "RTCUsers",
      "ChatPopUp"
    ])
  },

  methods: {
    ...mapActions("user", [
      'fetchState'
    ]),

    ...mapActions("room", [
      "getRoom",
      "joinRTCRoom"
    ]),

    async joinRoom() {
      await this.getRoom(this.$route.params.id);
      await this.joinRTCRoom({token: this.roomInfo.rtc_token, user: this.user});
    },

    goHome() {
      window.location.href = "/";
    },

    leaveRoom() {
      this.RTC.leaveRoom();
    }
  },

  async created () {
    await this.fetchState();

    if (this.signedIn) {
      await this.joinRoom();
    } else {
      this.$root.$emit('bv::show::modal', 'QuickStartModal');
    }
  },

  mounted () {
    document.addEventListener('beforeunload', () => this.leaveRoom());
    window.addEventListener('beforeunload', () => this.leaveRoom());
  },

  async destroyed() {
    // 释放本地采集
    for (const track of this.RTC.publishedTracks) {
      await track.release();
    }
    if (this.RTC.roomState === 2) {
      await this.RTC.leaveRoom();
    }
  }

})
</script>
