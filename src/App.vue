<template>
  <app-header />

<router-view></router-view>
<music-player />
  <auth-modal />

</template>

<script>
import AppHeader from './components/Header.vue';
import AuthModal from './components/Auth.vue';
import MusicPlayer from './components/MusicPlayer.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AuthModal,
    MusicPlayer,
  },
  created() {
    this.$store.dispatch('init_login');
  },
};
</script>
