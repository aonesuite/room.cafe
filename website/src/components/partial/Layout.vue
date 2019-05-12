<template>
  <div>
    <Navbar />
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Navbar from '../partial/Navbar.vue';

export default Vue.extend({

  components: {
    Navbar
  },

  data() {
    return {

    }
  },

  computed: {

  },

  methods: {

  },

  created () {

  }
})
</script>
