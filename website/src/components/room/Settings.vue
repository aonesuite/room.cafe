<template>
  <b-modal class="modal-room-settings" id="RoomSettingsModal" ref="RoomSettingsModal" centered :lazy="true" hide-footer hide-header @show="modalShow()">
    <form v-on:submit.prevent="onSubmit">

      <el-tabs class="tabs" :stretch="true" value="general">
        <el-tab-pane label="General" name="general">
          <div class="form-group">
            <label for="video-device">Video</label>
            <el-select class="d-block" id="video-device" placeholder="Select camera" v-model="settings.currentVideoInputDeviceID">
              <el-option v-for="device in deviceInfoList.filter((info) => info && info.kind === 'videoinput')" :key="device.deviceId" :label="device.label" :value="device.deviceId"></el-option>
            </el-select>
          </div>

          <div class="form-group">
            <label for="microphone-device">Microphone</label>
            <el-select class="d-block" id="microphone-device" placeholder="Select microphone" v-model="settings.currentAudioInputDeviceID">
              <el-option v-for="device in deviceInfoList.filter((info) => info && info.kind === 'audioinput')" :key="device.deviceId" :label="device.label" :value="device.deviceId"></el-option>
            </el-select>
          </div>

          <div class="form-group">
            <label for="speaker-device">Speakers</label>
            <el-select disabled class="d-block" id="speaker-device" placeholder="Select speaker" v-model="settings.currentAudioOutputDevice">
              <el-option v-for="device in deviceInfoList.filter((info) => info && info.kind === 'audiooutput')" :key="device.deviceId" :label="device.label" :value="device.deviceId"></el-option>
            </el-select>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Bandwidth" name="bandwidth">
          <div class="form-group">
            <label for="incoming-video">Incoming video</label>
            <el-select class="d-block" id="incoming-video" placeholder="Select resolution" v-model="settings.clarity">
              <el-option v-for="(clarity, key) in clarities" :key="key" :label="clarity.label" :value="key"></el-option>
            </el-select>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="clearfix">
        <b-btn type="submit" size="sm" variant="outline-primary" class="float-right" :disabled="isSubmitting">Done</b-btn>
      </div>
    </form>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import * as QNRTC from 'pili-rtc-web';
import * as Clarity from '../../constants/clarity';

export default Vue.extend({

  data() {
    return {
      deviceInfoList: [] as MediaDeviceInfo[],
      settings: {
        currentAudioOutputDevice: 'default',
        currentAudioInputDeviceID: 'default',
        currentVideoInputDeviceID: '',
        clarity: "SD"
      },
      clarities: {},
      isSubmitting: false
    }
  },

  computed: {
    ...mapState("room", [
      "roomInfo",
      "RTC"
    ]),

  },

  methods: {
    modalShow() {

    },

    // 发布本地音视频
    async publish() {
      if (this.RTC.roomState != QNRTC.RoomState.Connected) return;

      const clarity = Clarity.getClarity("HD");
      var tracks = await QNRTC.deviceManager.getLocalTracks({
        audio: {
          enabled: true,
          tag: "master",
          deviceId: this.settings.currentAudioInputDeviceID
        },
        video: {
          enabled: true,
          tag: "master",
          deviceId: this.settings.currentVideoInputDeviceID,
          width: clarity.width,
          height: clarity.height,
          bitrate: clarity.bitrate,
        }
      });

      tracks.map(track => track.setMaster(true));
      await this.RTC.publish(tracks);
    },

    async onSubmit () {
      this.isSubmitting = true
      // await this.unpublishTracks()
      await this.publish()
      this.isSubmitting = false
    }
  },

  created () {
    this.deviceInfoList = QNRTC.deviceManager.deviceInfo || [] as MediaDeviceInfo[];

    QNRTC.deviceManager.on('device-update', (deviceInfoList: MediaDeviceInfo[]) => {
      this.deviceInfoList = deviceInfoList
    })

    const count = this.deviceInfoList.filter((info) => info && info.kind === 'videoinput').length
    if (count === 1) {
      this.settings.currentVideoInputDeviceID = this.videoInputDevices[0].deviceId
    }

    this.clarities = Clarity.clarities;
  },

  mounted () {

  }
})
</script>
