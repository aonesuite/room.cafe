<template>
  <div id="whiteboard">
    <div id="whiteboard-main"></div>

    <div class="toolbar">
      <ul class="nav">
        <li class="nav-item">
          <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Selector" @click="setAppliance('selector')" :class="{active: Whiteboard.memberState.currentApplianceName === 'selector'}">
            <Icon type="mouse-pointer" width="22" height="22" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Pencil" @click="setAppliance('pencil')" :class="{active: Whiteboard.memberState.currentApplianceName === 'pencil'}">
            <Icon type="pencil-alt" width="20" height="20" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Text" @click="setAppliance('text')" :class="{active: Whiteboard.memberState.currentApplianceName === 'text'}">
            <Icon type="text" width="20" height="20" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Rectangle" @click="setAppliance('rectangle')" :class="{active: Whiteboard.memberState.currentApplianceName === 'rectangle'}">
            <Icon type="square" width="22" height="22" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Circle" @click="setAppliance('ellipse')" :class="{active: Whiteboard.memberState.currentApplianceName === 'ellipse'}">
            <Icon type="circle" width="22" height="22" />
          </b-btn>
        </li>

        <li class="nav-item" id="whiteboard-stroke-settings">
          <b-btn size="sm" variant="link" id="whiteboard-stroke" title="Stroke settings" @click="$refs.colorTooltip.$emit('close')">
            <span :style="`border-color:${strokeColor.hex}`">
              <span :style="`background-color:${strokeColor.hex}; width:${strokeWidth}px; height:${strokeWidth}px;`"></span>
            </span>
          </b-btn>

          <b-tooltip ref="colorTooltip" target="whiteboard-stroke" placement="right">Stroke settings</b-tooltip>

          <b-popover target="whiteboard-stroke" container="whiteboard-stroke-settings" triggers="click blur">
            <h6>Color</h6>
            <div class="option-colors">
              <button
                v-for="(color, name) in predefineColors" :key="name"
                class="btn btn-sm"
                :class="[name, (strokeColor.hex === color.hex) && 'active']"
                :style="`background-color:${color.hex}`"
                @click="setStrokeColor(color)"></button>
            </div>

            <h6>Thickness</h6>
            <div class="option-width">
              <svg width="100%" height="32" viewBox="0 0 269 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :fill="strokeColor.hex" stroke="#CCC" fill-rule="evenodd" clip-rule="evenodd" d="M252 31.9693V32L0 16V15L252 0V0.030742C252.331 0.0103478 252.664 0 253 0C261.837 0 269 7.16344 269 16C269 24.8366 261.837 32 253 32C252.664 32 252.331 31.9897 252 31.9693Z"></path>
              </svg>
              <input type="range" class="stroke-width-range" min="2" max="32" v-model.number="strokeWidth" />
            </div>
          </b-popover>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Eraser" @click="setAppliance('eraser')" :class="{active: Whiteboard.memberState.currentApplianceName === 'eraser'}">
            <Icon type="eraser" width="22" height="22" />
          </b-btn>
        </li>

        <li class="nav-item">
          <el-upload
            class="image-uploader"
            action="https://up.qiniup.com"
            accept="image/png,image/jpeg,image/gif"
            multiple
            :data="uploadData"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-progress="handleProgress"
            :on-success="handleSuccess">

            <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Insert Images">
              <Icon type="images" width="22" height="22" />
            </b-btn>
          </el-upload>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import uuid from 'uuid/v4';
import Vue from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import { colors } from '../../utils/color';

import * as UploaderAPI from '../../api/uploader';

export default Vue.extend({

  data (): any {
    return {
      color: '#dc3545',
      predefineColors: colors,
      intervalTimer: 0,
    }
  },

  computed: {
    ...mapState("user", [
      "signedIn",
      "user"
    ]),

    ...mapState("uploader", [
      "token",
      "domain",
    ]),

    ...mapState("room", [
      "roomInfo",
      "RTC",
      "RTCUsers",
      "Whiteboard"
    ]),

    strokeColor: {
      get: function () {
        for (const color of colors) {
          if (this.Whiteboard.memberState && this.$lodash.isEqual(color.rgb, this.Whiteboard.memberState.strokeColor))
            return color
        }

        return colors[0]
      },
      set: function (color: { name: string, hex: string, rgb: number[]}) {
        this.Whiteboard.setMemberState({ strokeColor: color.rgb })
      }
    },

    strokeWidth: {
      get: function (): number { return this.Whiteboard.memberState.strokeWidth },
      set: function (width: number) { this.Whiteboard.setMemberState({ strokeWidth: width }) }
    },

    uploadData(): any {
      return {
        token: this.token
      }
    }
  },

  methods: {
    ...mapActions('uploader', [
      'getToken'
    ]),

    ...mapActions("room", [
      "joinWhiteboardRoom"
    ]),

    setAppliance(appliance: string) {
      this.Whiteboard.setMemberState({ currentApplianceName: appliance });
    },

    setStrokeColor(color: { name: string, hex: string, rgb: number[]}) {
      this.strokeColor = color;
    },

    beforeUpload(file: any) {
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error("Please upload pictures less than 2M.");
        return false
      }
    },

    handleProgress() {

    },

    handleSuccess(resp: any, file: any) {
      var _uuid = uuid()

      this.Whiteboard.insertImage({
        uuid: _uuid,
        centerX: 0,
        centerY: 0,
        width: file.response.imageInfo.width,
        height: file.response.imageInfo.height,
      });

      UploaderAPI.getURL(file.response.key).then((resp) => {
        this.Whiteboard.completeImageUpload(_uuid, resp.data.url);
      });
    }
  },

  created () {
    this.getToken();
    this.intervalTimer = setInterval(() => {
      this.getToken()
    }, 1000 * 60 * 15);

    window.addEventListener('resize', () => {
      this.Whiteboard.refreshViewSize();
    });
  },

  mounted () {
    this.joinWhiteboardRoom({ uuid: this.roomInfo.whiteboard_id, roomToken: this.roomInfo.whiteboard_token })
      .then(() => {
        this.Whiteboard.setViewMode("broadcaster");
        this.Whiteboard.bindHtmlElement(document.getElementById('whiteboard-main'));
      })
  },

  destroyed() {
    clearInterval(this.intervalTimer);
    // this.Whiteboard.disconnect();
  }
})
</script>