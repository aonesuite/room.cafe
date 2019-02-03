<template>
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
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

export default Vue.extend({

  data() {
    return {
      login: ''
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

    roomWindow(type: string) {
      const routeData = this.$router.resolve({name: 'room', query: {t: type} })
      const width =  screen.width * 0.8
      const height = screen.height * 0.8
      const top = (screen.height - height) / 2
      const left = (screen.width - width) / 2
      window.open(routeData.href, 'Room', `resizable=yes,scrollbars=yes,titlebar=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no,width=${width},height=${height},top=${top},left=${left}`)
    },

    async quickStart(type: string) {
      await this.fetchState();

      if (this.signedIn) {
        this.roomWindow(type);
      } else {
        this.$root.$emit('bv::show::modal', 'QuickStartModal');
      }
    }
  },

  created () {

  }
})
</script>
