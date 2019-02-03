<template>
  <b-modal id="QuickStartModal" ref="QuickStartModal" centered :lazy="true" hide-footer title="Quick start">
    <form @submit.prevent="starting">
      <b-input-group>
        <b-form-input v-model.trim="login" id="login" placeholder="Enter a name or email"></b-form-input>
        <b-input-group-append>
          <b-btn type="submit" variant="outline-success" :disabled="login === ''">Starting</b-btn>
        </b-input-group-append>
      </b-input-group>
    </form>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import BootstrapVue, { Modal } from 'bootstrap-vue';
import { UserArgs } from '../../types/user';
import * as UserAPI from '../../api/user';

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

    roomWindow() {
      const routeData = this.$router.resolve({name: 'room' })
      const width =  screen.width * 0.8
      const height = screen.height * 0.8
      const top = (screen.height - height) / 2
      const left = (screen.width - width) / 2
      window.open(routeData.href, 'Room', `resizable=yes,scrollbars=yes,titlebar=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no,width=${width},height=${height},top=${top},left=${left}`)
    },

    starting() {
      this.autoCreateUser({ name: this.login }).then(() => {
        this.roomWindow();
        this.$root.$emit('bv::hide::modal', 'QuickStartModal');
      })
    }
  },

  created () {

  }
})
</script>
