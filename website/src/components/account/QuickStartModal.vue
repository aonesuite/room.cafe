<template>
  <b-modal
    id="QuickStartModal"
    ref="QuickStartModal"
    centered
    :lazy="true"
    hide-footer
    :title="modalTitle"
    :no-close-on-backdrop="noCloseOnBackdrop"
    :hide-header-close="hideHeaderClose">

    <form @submit.prevent="submit">
      <b-input-group>
        <b-form-input v-model.trim="login" id="login" placeholder="Enter a name or email"></b-form-input>
        <b-input-group-append>
          <b-btn type="submit" variant="outline-success" :disabled="login === ''">{{ submitBtnText }}</b-btn>
        </b-input-group-append>
      </b-input-group>
    </form>

    <!-- TODO: OAuth logic begin -->
    <!-- TODO: OAuth logic end -->
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import BootstrapVue, { Modal } from 'bootstrap-vue';
import { UserArgs } from '../../types/user';
import * as UserAPI from '../../api/user';
import { openWindow } from '../../utils/window';

export default Vue.extend({

  data() {
    return {
      modalTitle: "Quick start",
      noCloseOnBackdrop: false,
      hideHeaderClose: false,
      submitBtnText: "Starting",
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
      const routeData = this.$router.resolve({name: 'room-quick-start', query: {t: 'f2f'} });
      openWindow(routeData.href, `room/quick-start/${new Date().getTime()}`);
    },

    submit() {
      this.autoCreateUser({ name: this.login }).then(() => {
        // 如果是在房间中创建用户，则直接调用 Room.vue#joinRoom 方法进入房间
        if (this.$route.name === "room") {
          this.$emit('joinRoom');
        } else {
          this.roomWindow();
        }

        this.$root.$emit('bv::hide::modal', 'QuickStartModal');
      })
    }
  },

  created () {
    if (this.$route.name === "room") {
      this.modalTitle = "Join the room";
      this.noCloseOnBackdrop = true;
      this.hideHeaderClose = true;
      this.submitBtnText = "Join";
    }
  }
})
</script>
