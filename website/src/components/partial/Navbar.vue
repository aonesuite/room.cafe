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
      </b-navbar-nav>
    </b-collapse>

    <QuickStartModal />
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import QuickStartModal from '@/components/account/QuickStartModal.vue';

export default Vue.extend({
  components: {
    QuickStartModal
  },

  computed: {
    ...mapState("user", [
      "signedIn"
    ])
  },

  methods: {
    ...mapActions("user", [
      'fetchState'
    ]),

    async quickStart() {
      await this.fetchState()

      this.$root.$emit('bv::show::modal', 'QuickStartModal');
    }
  },

  created () {

  }
})
</script>
