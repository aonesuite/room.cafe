<template>
  <div id="whiteboard">
    <div id="whiteboard-main"></div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

const whiteboardSdk = new WhiteWebSdk();

export default {

  data () {
    return {
      whiteboard: undefined
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
    ])
  },

  methods: {

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

  }
}
</script>