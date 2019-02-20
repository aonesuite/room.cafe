<template>
  <div>
    <Navbar />

    <div class="welcome">
      <div class="photograph"></div>
      <div class="hero">
        <div class="section">
          <h1 v-if="!signedIn">Interact with your family, friends and colleagues</h1>
          <h3 v-if="!signedIn">In the Room Cafe, you can make video meeting calls, share your ideas and send messages to people you love.</h3>

          <h1 v-if="signedIn">Hi, {{ user.name }}</h1>
          <h3 v-if="signedIn">Get started by video meeting, idea sharing and messaging peoples below.</h3>

          <div class="feature-actions">
            <ul class="list-inline">
              <li class="list-inline-item">
                <button class="btn btn-outline-primary rounded-circle" @click="quickStart('f2f')">
                  <Icon type="video" width="24" height="24" />
                </button>
                <span>Video Call</span>
              </li>

              <li class="list-inline-item">
                <button class="btn btn-outline-primary rounded-circle" @click="quickStart('board')">
                  <Icon type="chalkboard" width="24" height="24" />
                </button>
                <span>Board</span>
              </li>

              <li class="list-inline-item">
                <button class="btn btn-outline-primary rounded-circle" @click="quickStart('im')">
                  <Icon type="comment-alt-lines" width="24" height="24" />
                </button>
                <span>Message</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import Navbar from '../components/partial/Navbar.vue';
import * as RoomAPI from '../api/room';
import { openWindow } from '../utils/window';

export default Vue.extend({

  components: {
    Navbar
  },

  data() {
    return {
      login: ''
    }
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
      "createRoom"
    ]),

    async quickStart(type: string) {
      await this.fetchState();

      if (this.signedIn) {
        await this.createRoom();
        this.$router.push({ name: "room", params: { id: this.roomInfo.uuid } });
      } else {
        this.$root.$emit('bv::show::modal', 'QuickStartModal');
      }
    }
  },

  created () {

  }
})
</script>
