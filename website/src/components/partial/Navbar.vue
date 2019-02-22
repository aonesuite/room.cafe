<template>
  <b-navbar toggleable="md" fixed="top" type="dark" id="navbar">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand href="/">
      <span>ROOM CAFE</span>
      <img src="@/assets/images/logo.svg" alt="ROOM CAFE" width="24">
    </b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <li class="nav-item">
          <b-button size="sm" variant="success" type="button" @click="quickStart">Quick start</b-button>
        </li>

        <li class="nav-item" v-if="!signedIn">
          <b-button size="sm" variant="success" type="button" @click="quickStart">Sign in</b-button>
        </li>

        <li class="nav-item" v-if="signedIn">
          <b-button id="profilePopover" variant="link" class="">{{ user.name }}</b-button>
          <b-popover target="profilePopover" triggers="click blur" placement="buttomright">
            Embedding content <span class="text-danger">using slots</span> affords you
            <em>greater <strong>control.</strong></em> and basic HTML support.
          </b-popover>
        </li>
      </b-navbar-nav>
    </b-collapse>

    <QuickStartModal />
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import QuickStartModal from '@/components/account/QuickStartModal.vue';

export default Vue.extend({
  components: {
    QuickStartModal
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

    async quickStart() {
      await this.fetchState()

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
