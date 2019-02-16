<template>
  <router-view id="app" :class="`${$route.name && $route.name.split('.').join('-')}-page`" />
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

export default Vue.extend({

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
