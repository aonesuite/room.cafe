<template>
  <div id="whiteboard">
    <div id="whiteboard-main"></div>

    <div class="toolbar">
      <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Selector" @click="setAppliance('selector')" :class="{active: whiteboardApplianceName === 'selector'}">
        <Icon type="mouse-pointer" width="22" height="22" />
      </b-btn>

      <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Pencil" @click="setAppliance('pencil')" :class="{active: whiteboardApplianceName === 'pencil'}">
        <Icon type="pencil-alt" width="20" height="20" />
      </b-btn>

      <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Text" @click="setAppliance('text')" :class="{active: whiteboardApplianceName === 'text'}">
        <Icon type="text" width="20" height="20" />
      </b-btn>

      <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Rectangle" @click="setAppliance('rectangle')" :class="{active: whiteboardApplianceName === 'rectangle'}">
        <Icon type="square" width="22" height="22" />
      </b-btn>

      <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Circle" @click="setAppliance('ellipse')" :class="{active: whiteboardApplianceName === 'ellipse'}">
        <Icon type="circle" width="22" height="22" />
      </b-btn>

      <el-color-picker
        size="small"
        v-model="color"
        color-format="hex"
        :show-alpha="false"
        :predefine="predefineColors"
        @active-change="activeColorChange"
        class="color-picker"
        popper-class="whiteboard-color-picker-panel"
        v-b-tooltip.hover.right
        title="Color"></el-color-picker>

      <b-btn size="sm" variant="link" v-b-tooltip.hover.right title="Eraser" @click="setAppliance('eraser')">
        <Icon type="eraser" width="22" height="22" />
      </b-btn>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { hexToRgb } from '@/utils/color'

const whiteboardSdk = new WhiteWebSdk();

export default {

  data () {
    return {
      whiteboard: undefined,
      currentApplianceName: 'pencil',
      color: '#EA2929',
      predefineColors: [
        '#EA2929', // red
        '#F99C3D', // orange
        '#FED572', // yellow
        '#5CADEA', // blue
        '#81D8D0', // tiffany
        '#BDBDBD', // gray
      ]
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

    whiteboardApplianceName: {
      get: function () { return this.whiteboard && this.whiteboard.state.memberState.currentApplianceName },
      set: function (name) { this.whiteboard.setMemberState({ currentApplianceName: name }) }
    },
    whiteboardStrokeColor: {
      get: function () { return this.whiteboard && this.whiteboard.state.memberState.strokeColor },
      set: function (color) { this.whiteboard.setMemberState({ strokeColor: color }) }
    },
    whiteboardStrokeWidth: {
      get: function () { return this.whiteboard && this.whiteboard.state.memberState.strokeWidth },
      set: function (width) { this.whiteboard.setMemberState({ strokeWidth: width }) }
    },
    whiteboardTextSize: {
      get: function () { return this.whiteboard && this.whiteboard.state.memberState.textSize },
      set: function (size) { this.whiteboard.setMemberState({ textSize: size }) }
    }
  },

  methods: {
    activeColorChange(color) {
      this.color = color;
      this.whiteboard.setMemberState({ strokeColor: color.replace(/rgb\(|\)/g, "").split(",") })
      document.getElementsByClassName('whiteboard-color-picker-panel')[0].style = "transform-origin: center top 0px; z-index: 2007; display: none;"
    },

    setAppliance(appliance) {
      this.whiteboard.setMemberState({ currentApplianceName: appliance })
      this.currentApplianceName = this.whiteboard.state.memberState.currentApplianceName
    }
  },

  watch: {

  },

  created () {

  },

  mounted () {
    whiteboardSdk.joinRoom({ uuid: this.roomInfo.whiteboard_id, roomToken: this.roomInfo.whiteboard_token })
      .then((room) => {

        this.whiteboard = room
        this.whiteboard.setViewMode("broadcaster")
        this.whiteboard.setMemberState({
          currentApplianceName: 'pencil',
          strokeColor: [92, 173, 234],
          strokeWidth: 2,
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