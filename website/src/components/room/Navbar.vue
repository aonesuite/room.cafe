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
          <b-btn :disabled="RTC.roomState !== 2" size="sm" variant="link" @click="$refs.InvitePeopleModal.show()" v-b-tooltip.hover title="Invite People">
            <Icon type="user-plus" height="22" class="flip-horizontal" />
          </b-btn>

          <b-modal
            id="InvitePeopleModal"
            ref="InvitePeopleModal"
            centered
            hide-footer
            title="Invite People"
            modal-class="modal-invite-people">

            <b-form-input id="InvitePeopleLink" readonly="readonly" v-model="shareLink"></b-form-input>
            <b-btn variant="outline-primary" class="float-right mt-2" id="CopyShareLinkBtn" ref="CopyShareLinkBtn" @click="copyLink" data-clipboard-target="#InvitePeopleLink">
              <Icon type="link" height="22" rotate="45" class="mr-2" />
              Copy link to share
            </b-btn>
          </b-modal>
        </li>

        <li class="nav-item">
          <b-btn :disabled="RTC.roomState !== 2" size="sm" variant="link" @click="switchWhiteBoard" v-b-tooltip.hover title="WhiteBoard">
            <Icon type="chalkboard" height="22" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn :disabled="RTC.roomState !== 2" size="sm" variant="link" id="chatBtn" @click="switchChat(); $refs.chatTooltip.$emit('close')">
            <Icon type="comment-alt-lines" height="22" />
            <span class="badge" v-if="UnreadCount > 0">{{ UnreadCount }}</span>
          </b-btn>
          <b-tooltip id="chatTooltip" ref="chatTooltip" target="chatBtn" placement="bottom">{{ ChatPopUp ? 'Close chat' : 'Open chat' }}</b-tooltip>
        </li>

        <!-- 屏幕共享 -->
        <ShareScreen tag="li" class="nav-item" v-if="$browser.name === 'chrome' || $browser.name === 'firefox'" />

        <!-- 音频开关 -->
        <li class="nav-item">
          <b-btn :disabled="RTC.roomState !== 2" size="sm" variant="link" class="btn-microphone" v-b-tooltip.hover :title="microphoneMuted ? 'Open microphone' : 'Mute microphone'" @click="switchMicrophone">
            <Icon :type="microphoneMuted ? 'microphone-slash' : 'microphone'" height="22" />
          </b-btn>
        </li>

        <!-- 视频开关 -->
        <li class="nav-item">
          <b-btn :disabled="RTC.roomState !== 2" size="sm" variant="link" class="btn-video" v-b-tooltip.hover :title="videoMuted ? 'Open video' : 'Mute video'" @click="switchVideo">
            <Icon :type="videoMuted ? 'video-slash' : 'video'" height="22" />
          </b-btn>
        </li>

        <!-- 全屏 -->
        <li class="nav-item" v-if="fullscreenEnabled">
          <b-btn :disabled="RTC.roomState !== 2" size="sm" variant="link" v-b-tooltip.hover :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'" @click="switchFullscreen">
            <Icon :type="isFullscreen ? 'screen-normal' : 'screen-full'" height="22" />
          </b-btn>
        </li>

        <!-- 设置 -->
        <li class="nav-item">
          <b-btn :disabled="RTC.roomState !== 2" size="sm" variant="link" @click="settings" v-b-tooltip.hover title="Settings">
            <Icon type="cog" height="22" />
          </b-btn>
          <Settings />
        </li>

        <!-- 退出 -->
        <li class="nav-item">
          <b-btn :disabled="RTC.roomState !== 2" size="sm" variant="link" id="exitBtn" @click="exit(); $refs.exitTooltip.$emit('close')">
            <Icon type="sign-out-alt" height="22" />
          </b-btn>
          <b-tooltip id="exitTooltip" ref="exitTooltip" target="exitBtn" placement="bottom">Exit</b-tooltip>
        </li>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import fscreen from 'fscreen';
import Clipboard from 'clipboard';
import { openWindow } from '../../utils/window';
import ShareScreen from './ShareScreen.vue';
import Settings from './Settings.vue';

export default Vue.extend({
  components: {
    ShareScreen,
    Settings
  },

  data () {
    return {
      copyBtn: {} as ClipboardJS, //存储初始化复制按钮事件
      shareLink: "",
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
      "RTC",
      "ChatPopUp",
      "UnreadCount",
      "Whiteboard"
    ])
  },

  methods: {
    ...mapMutations("room", [
      "setStageStreamId",
      "setChatPopUp"
    ]),

    ...mapActions("user", [
      "fetchState"
    ]),

    // 切换白板
    switchWhiteBoard() {
      this.setStageStreamId("");
    },

    // 切换白板
    switchChat() {
      this.setChatPopUp(!this.ChatPopUp);
    },

    copyLink() {
      let clipboard = this.copyBtn as ClipboardJS;

      if (!clipboard) return;

      clipboard.on("success", () => {
        this.$message.success("Link copied to clipboard.");
      });

      clipboard.on("error", () => {
        this.$message.error("Copy failed. Please copy the url in the input box.");
      });
    },

    // 全屏切换
    switchFullscreen() {
      this.isFullscreen ? fscreen.exitFullscreen(): fscreen.requestFullscreen(document.documentElement);
    },

    settings() {
      this.$root.$emit('bv::show::modal', 'RoomSettingsModal');
    },

    switchMicrophone() {
      this.RTC.muteStream("master", "audio", !this.microphoneMuted);
      this.microphoneMuted = !this.microphoneMuted;
    },

    switchVideo() {
      this.RTC.muteStream("master", "video", !this.videoMuted);
      this.videoMuted = !this.videoMuted;
    },

    async exit() {
      // 释放本地采集
      for (const track of this.RTC.publishedTracks) {
        await track.release();
      }
      this.RTC.leaveRoom();
      // this.Whiteboard.disconnect();
    }
  },

  created () {
    const routeData = this.$router.resolve({name: 'room', params: {id: this.$route.params.id} });
    this.shareLink = `https://room.cafe${routeData.href}`

    if (fscreen.fullscreenEnabled) {
      this.fullscreenEnabled = fscreen.fullscreenEnabled;
      fscreen.addEventListener('fullscreenchange', () => { this.isFullscreen = fscreen.fullscreenElement !== null; }, false);
    }
  },

  mounted () {
    this.copyBtn = new Clipboard(this.$refs.CopyShareLinkBtn as Element);
  }
})
</script>
