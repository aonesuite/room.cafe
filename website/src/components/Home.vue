<template>
  <div class="welcome">
    <div class="photograph"></div>
    <div class="hero">
      <div class="section">
        <h1>Interact with your family, friends and colleagues</h1>
        <h3>In the Room Cafe, you can make video meeting calls, share your ideas and send messages to people you love.</h3>

        <div class="feature-actions">
          <ul class="list-inline">
            <li class="list-inline-item">
              <button class="btn btn-outline-primary rounded-circle" @click="room('f2f')">
                <Icon type="video" width="24" height="24" />
              </button>
              <span>Video Call</span>
            </li>

            <li class="list-inline-item">
              <button class="btn btn-outline-primary rounded-circle" @click="room('board')">
                <Icon type="chalkboard" width="24" height="24" />
              </button>
              <span>Board</span>
            </li>

            <li class="list-inline-item">
              <button class="btn btn-outline-primary rounded-circle" @click="room('im')">
                <Icon type="comment-alt-lines" width="24" height="24" />
              </button>
              <span>Message</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <b-modal ref="loginModal" centered hide-footer title="Quick start">
      <form @submit.prevent="starting">
        <b-input-group>
          <b-form-input v-model.trim="login" placeholder="Enter a name or email"></b-form-input>
          <b-input-group-append>
            <b-btn type="submit" variant="outline-success" :disabled="login === ''">Starting</b-btn>
          </b-input-group-append>
        </b-input-group>
      </form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import BootstrapVue, { Modal } from 'bootstrap-vue';
import { UserArgs } from '../types/user';
import * as UserAPI from '../api/user';

export default Vue.extend({

  data() {
    return {
      login: ''
    }
  },

  computed: {
    ...mapState("user", [
      "signedIn"
    ])
  },

  methods: {
    ...mapActions("user", [
      'fetchState',
      'autoCreateUser'
    ]),

    room(type: string) {
      if (this.signedIn) {
        this.roomWindow();
      } else {
        var modal: any = this.$refs.loginModal;
        modal.show();
      }
    },

    roomWindow() {
      let routeData = this.$router.resolve({name: 'room' })
      const width =  screen.width * 0.8
      const height = screen.height * 0.8
      const top = (screen.height - height) / 2
      const left = (screen.width - width) / 2
      window.open(routeData.href, 'projection', `resizable=yes,scrollbars=yes,titlebar=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no,width=${width},height=${height},top=${top},left=${left}`)
    },

    starting() {
      this.autoCreateUser({ name: this.login }).then(() => {
        this.roomWindow();
      })
    }
  },

  created () {

  }
})
</script>
