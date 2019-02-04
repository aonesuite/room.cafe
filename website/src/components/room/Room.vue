<template>
  <div class="room">
    <Navbar />

    <h1>ROOM</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

import Navbar from './Navbar.vue';

export default Vue.extend({

  components: {
    Navbar
  },

  computed: {
    ...mapState("user", [
      "signedIn",
      "user"
    ]),

    ...mapState("room", [
      "roomInfo"
    ])
  },

  methods: {
    ...mapActions("user", [
      'fetchState'
    ]),

    ...mapActions("room", [
      "createRoom",
      "getRoom"
    ])
  },

  async created () {
    await this.fetchState();

    if (this.signedIn) {
      if (this.$route.name === 'room-quick-start') {
        await this.createRoom();
        this.$router.replace({ name: "room", params: { id: this.roomInfo.uuid } });
      } else {
        this.getRoom(this.$route.params.id)
      }
    } else {
      // eslint-disable-next-line
      console.log('not signedIn')
      /* eslint-disable */
    }
  }

})
</script>
