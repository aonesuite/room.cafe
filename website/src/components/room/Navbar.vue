<template>
  <b-navbar toggleable="md" fixed="top" type="dark" class="navbar-room">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand href="/">
      <span>ROOM CAFE</span>
      <img src="@/assets/images/logo.svg" alt="ROOM CAFE" width="24">
    </b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="ml-auto">
        <li class="nav-item">
          <b-btn size="sm" variant="link" @click="component('video')" v-b-tooltip.hover title="Video Call">
            <Icon type="video" width="22" height="22" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" @click="component('board')" v-b-tooltip.hover title="Whiteboard">
            <Icon type="chalkboard" width="22" height="22" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" @click="component('im')" v-b-tooltip.hover title="Message">
            <Icon type="comment-alt-lines" width="22" height="22" />
          </b-btn>
        </li>

        <li class="nav-item">
          <b-btn size="sm" variant="link" @click="settings" v-b-tooltip.hover title="Setting">
            <Icon type="cog" width="22" height="22" />
          </b-btn>
        </li>

        <li class="nav-item" v-if="signedIn">
          <a class="nav-link" href="">{{ user.name }}</a>
        </li>
      </b-navbar-nav>
    </b-collapse>

    <QuickStartModal />
    <Settings />
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import QuickStartModal from '@/components/account/QuickStartModal.vue';
import { openWindow } from '../../utils/window';
import Settings from './Settings.vue';

export default Vue.extend({
  components: {
    QuickStartModal,
    Settings
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

    component(component: string) {

    },

    settings() {
      this.$root.$emit('bv::show::modal', 'RoomSettingsModal');
    },

    async quickStart() {
      await this.fetchState()

      if (this.signedIn) {
        this.roomWindow();
      } else {
        this.$root.$emit('bv::show::modal', 'QuickStartModal');
      }
    }
  },

  created () {

  }
})
</script>
