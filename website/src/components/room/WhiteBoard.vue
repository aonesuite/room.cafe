<template>
  <div id="whiteboard">
    <div id="whiteboard-main"></div>

    <div class="toolbar">
      <ul class="nav">
        <li class="nav-item">
          <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Selector" @click="setAppliance('selector')" :class="{active: applianceName === 'selector'}">
            <Icon type="mouse-pointer" width="22" height="22" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Pencil" @click="setAppliance('pencil')" :class="{active: applianceName === 'pencil'}">
            <Icon type="pencil-alt" width="20" height="20" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Text" @click="setAppliance('text')" :class="{active: applianceName === 'text'}">
            <Icon type="text" width="20" height="20" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Rectangle" @click="setAppliance('rectangle')" :class="{active: applianceName === 'rectangle'}">
            <Icon type="square" width="22" height="22" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Circle" @click="setAppliance('ellipse')" :class="{active: applianceName === 'ellipse'}">
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
          <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Eraser" @click="setAppliance('eraser')" :class="{active: applianceName === 'eraser'}">
            <Icon type="eraser" width="22" height="22" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Insert Images" @click="insertImages">
            <Icon type="images" width="22" height="22" />
          </b-btn>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { colors } from '@/utils/color'

import { WhiteWebSdk } from 'white-web-sdk';

const whiteboardSdk = new WhiteWebSdk();

export default {

  data () {
    return {
      whiteboard: undefined,
      currentApplianceName: 'pencil',
      color: '#dc3545',
      predefineColors: colors
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
      "RTCUsers"
    ]),

    applianceName: {
      get: function () { return this.whiteboard && this.whiteboard.state.memberState.currentApplianceName },
      set: function (name) { this.whiteboard.setMemberState({ currentApplianceName: name }) }
    },
    strokeColor: {
      get: function () {
        if (this.whiteboard === undefined) return colors[0];

        for (const color of colors) {
          if (this.$lodash.isEqual(color.rgb, this.whiteboard.state.memberState.strokeColor)) return color
        }

        return colors[0]
      },
      set: function (color) {
        this.whiteboard.setMemberState({ strokeColor: color.rgb })
      }
    },
    strokeWidth: {
      get: function () { return this.whiteboard && this.whiteboard.state.memberState.strokeWidth },
      set: function (width) { this.whiteboard.setMemberState({ strokeWidth: width }) }
    },
    textSize: {
      get: function () { return this.whiteboard && this.whiteboard.state.memberState.textSize },
      set: function (size) { this.whiteboard.setMemberState({ textSize: size }) }
    }
  },

  methods: {
    setAppliance(appliance) {
      this.whiteboard.setMemberState({ currentApplianceName: appliance })
      this.currentApplianceName = this.whiteboard.state.memberState.currentApplianceName
    },

    setStrokeColor(color) {
      this.strokeColor = color;
    },

    insertImages() {

    }
  },

  watch: {
    'RTC.roomState': function (state) {
      if (state !== 2) {
        this.whiteboard.disconnect();
      }
    }
  },

  created () {
    window.addEventListener('resize', () => {
      if (this.whiteboard) this.whiteboard.refreshViewSize();
    });

    document.addEventListener('beforeunload', () => this.whiteboard.disconnect());
    window.addEventListener('beforeunload', () => this.whiteboard.disconnect());
  },

  mounted () {
    whiteboardSdk.joinRoom({ uuid: this.roomInfo.whiteboard_id, roomToken: this.roomInfo.whiteboard_token })
      .then((room) => {

        this.whiteboard = room
        this.whiteboard.setViewMode("broadcaster")
        this.whiteboard.setMemberState({
          currentApplianceName: 'pencil',
          strokeColor: this.strokeColor.rgb,
          strokeWidth: 4,
          textSize: 14
        })
        this.whiteboard.bindHtmlElement(document.getElementById('whiteboard-main'))
      })

  },

  destroyed() {
    this.whiteboard.disconnect()
  }
}
</script>