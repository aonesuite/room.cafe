<template>
  <div id="chat" :class="{open: ChatPopUp}">

    <form class="intercom" @submit.prevent="sendMessage">
      <div class="input-group input-group-lg">
        <input type="text" class="form-control" ref="msgContentBox" v-model.trim="msgContent" placeholder="Send a message to everyone in the room">
        <div class="input-group-append">
          <button class="btn btn-outline-primary" type="submit">
            <Icon type="paper-plane" hight="22" />
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import * as QNRTC from 'pili-rtc-web';

export default Vue.extend({
  data() {
    return {
      msgContent: ""
    }
  },

  computed: {
    ...mapState("user", [
      "signedIn",
      "user"
    ]),

    ...mapState("room", [
      "roomInfo",
      "RTC",
      "ChatPopUp"
    ])
  },

  methods: {
    sendMessage() {
      this.msgContent = "";
    }
  },

  created () {

  },

  destroyed() {

  }
})
</script>
