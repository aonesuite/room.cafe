<template>
  <div class="welcome">
    <h1>ROOM</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

export default Vue.extend({

  computed: {
    ...mapState("room", [
      "roomInfo"
    ])
  },

  methods: {
    ...mapActions("room", [
      "createRoom",
      "getRoom"
    ])
  },

  async created () {
    if (this.$route.name === 'room-quick-start') {
      await this.createRoom()
      this.$router.replace({ name: "room", params: { id: this.roomInfo.uuid } });
    } else {
      this.getRoom(this.$route.params.id)
    }
  }

})
</script>
