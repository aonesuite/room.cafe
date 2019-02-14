<template>
  <b-navbar toggleable="md" fixed="top" type="dark" class="navbar-room">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand>
      <span>ROOM CAFE</span>
      <img src="@/assets/images/logo.svg" alt="ROOM CAFE" width="24">

      <small class="ml-2" v-if="signedIn">{{ user.name }}</small>
    </b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="ml-auto">
        <li class="nav-item">
          <b-btn size="sm" variant="link" @click="component('board')" v-b-tooltip.hover title="WhiteBoard">
            <Icon type="chalkboard" height="22" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" @click="component('im')" v-b-tooltip.hover title="Chat">
            <Icon type="comment-alt-lines" height="22" />
          </b-btn>
        </li>

        <!-- 屏幕共享 -->
        <ShareScreen tag="li" class="nav-item" v-if="$browser.name === 'chrome' || $browser.name === 'firefox'" />

        <!-- 音频开关 -->
        <li class="nav-item">
          <b-btn size="sm" variant="link" class="btn-microphone" v-b-tooltip.hover :title="microphoneMuted ? 'Open microphone' : 'Mute microphone'" @click="switchMicrophone">
            <Icon :type="microphoneMuted ? 'microphone-slash' : 'microphone'" height="22" />
          </b-btn>
        </li>

        <!-- 视频开关 -->
        <li class="nav-item">
          <b-btn size="sm" variant="link" class="btn-video" v-b-tooltip.hover :title="videoMuted ? 'Open video' : 'Mute video'" @click="switchVideo">
            <Icon :type="videoMuted ? 'video-slash' : 'video'" height="22" />
          </b-btn>
        </li>

        <!-- 全屏 -->
        <li class="nav-item" v-if="fullscreenEnabled">
          <b-btn size="sm" variant="link" v-b-tooltip.hover :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'" @click="switchFullscreen">
            <Icon :type="isFullscreen ? 'screen-normal' : 'screen-full'" height="22" />
          </b-btn>
        </li>

        <!-- 设置 -->
        <li class="nav-item">
          <b-btn size="sm" variant="link" @click="settings" v-b-tooltip.hover title="Settings">
            <Icon type="cog" height="22" />
          </b-btn>
        </li>

        <!-- 退出 -->
        <li class="nav-item">
          <b-btn size="sm" variant="link" class="btn-phone" @click="exit" v-b-tooltip.hover title="Exit">
            <Icon type="sign-out-alt" height="22" />
          </b-btn>
        </li>
      </b-navbar-nav>
    </b-collapse>

    <QuickStartModal />
    <Settings />
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import fscreen from 'fscreen';
import QuickStartModal from '@/components/account/QuickStartModal.vue';
import { openWindow } from '../../utils/window';
import ShareScreen from './ShareScreen.vue';
import Settings from './Settings.vue';

export default Vue.extend({
  components: {
    QuickStartModal,
    ShareScreen,
    Settings
  },

  data () {
    return {
      fullscreenEnabled: false,
      isFullscreen: false,
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
    ...mapActions("user", [
      'fetchState'
    ]),

    component(component: string) {

    },

    // 全屏切换
    switchFullscreen() {
      this.isFullscreen ? fscreen.exitFullscreen(): fscreen.requestFullscreen(document.documentElement);
    },

    settings() {
      this.$root.$emit('bv::show::modal', 'RoomSettingsModal');
    },

    async quickStart() {
      await this.fetchState();

      if (this.signedIn) {
        this.roomWindow();
      } else {
        this.$root.$emit('bv::show::modal', 'QuickStartModal');
      }
    },

    switchMicrophone() {
      this.RTC.muteStream("master", "audio", !this.microphoneMuted);
      this.microphoneMuted = !this.microphoneMuted;
    },

    switchVideo() {
      this.RTC.muteStream("master", "video", !this.videoMuted);
      this.videoMuted = !this.videoMuted;
    },

    exit() {
      this.RTC.leaveRoom()
    }
  },

  created () {

    if (fscreen.fullscreenEnabled) {
      this.fullscreenEnabled = fscreen.fullscreenEnabled;
      fscreen.addEventListener('fullscreenchange', () => { this.isFullscreen = fscreen.fullscreenElement !== null; }, false);
    }

  }
})
</script>
