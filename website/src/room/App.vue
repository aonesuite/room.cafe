<template>
  <router-view id="app" :class="`${$route.name && $route.name.split('.').join('-')}-page`" :data-router="$route.name"/>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
