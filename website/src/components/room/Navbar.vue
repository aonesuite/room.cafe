<template>
  <b-navbar toggleable="md" fixed="top" type="dark" class="navbar-room">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand href="/">
      <span>ROOM CAFE</span>
      <img src="@/assets/images/logo.svg" alt="ROOM CAFE" width="24">
    </b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="ml-auto">
        <li class="nav-item">
          <b-btn size="sm" variant="link" @click="component('video')" v-b-tooltip.hover title="Video Call">
            <Icon type="video" width="22" height="22" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" @click="component('board')" v-b-tooltip.hover title="Whiteboard">
            <Icon type="chalkboard" width="22" height="22" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" @click="component('im')" v-b-tooltip.hover title="Chat">
            <Icon type="comment-alt-lines" width="22" height="22" />
          </b-btn>
        </li>

        <!-- 屏幕共享 -->
        <ShareScreen tag="li" class="nav-item" v-if="$browser.name === 'chrome' || $browser.name === 'firefox'" />

        <!-- 全屏 -->
        <li class="nav-item" v-if="fullscreenEnabled">
          <b-btn size="sm" variant="link" v-b-tooltip.hover :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'" @click="switchFullscreen">
            <Icon type="screen-full" width="22" height="22" v-show="!isFullscreen" />
            <Icon type="screen-normal" width="22" height="22" v-show="isFullscreen" />
          </b-btn>
        </li>

        <!-- 设置 -->
        <li class="nav-item">
          <b-btn size="sm" variant="link" @click="settings" v-b-tooltip.hover title="Setting">
            <Icon type="cog" width="22" height="22" />
          </b-btn>
        </li>

        <li class="nav-item" v-if="signedIn">
          <a class="nav-link" href="">{{ user.name }}</a>
        </li>

        <!--
        <b-btn size="sm" variant="link" class="btn-phone" @click="RTC.leaveRoom()" v-if="RTC.userId === stream.userId">
          <Icon type="phone" height="22" class="phone-hang-up" />
        </b-btn>

        <b-btn size="sm" variant="link" class="btn-microphone" @click="RTC.muteStream(stream.tag, 'audio', !stream.audioTrack.info.muted)" v-if="RTC.userId === stream.userId && stream.audioTrack">
          <Icon :type="stream.audioTrack.info.muted ? 'microphone-slash' : 'microphone'" height="22" />
        </b-btn>

        <b-btn size="sm" variant="link" class="btn-video" @click="RTC.muteStream(stream.tag, 'video', !stream.videoTrack.info.muted)" v-if="RTC.userId === stream.userId && stream.videoTrack">
          <Icon :type="stream.videoTrack.info.muted ? 'video-slash' : 'video'" height="22" />
        </b-btn>
        -->
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
      isFullscreen: false
    }
  },

  computed: {
    ...mapState("user", [
      "signedIn",
      "user"
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
