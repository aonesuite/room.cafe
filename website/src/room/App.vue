<template>
  <div id="app" :class="`${$route.name && $route.name.split('.').join('-')}-page`">
    <Navbar />

    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import Navbar from '../components/partial/Navbar.vue';

export default Vue.extend({
  components: {
    Navbar
  },

  computed: {
    ...mapState("user", [
      "signedIn"
    ])
  },

  methods: {
    ...mapActions("user", [
      'fetchState'
    ])
  },

  created () {
    this.fetchState()
  }
})
</script>
