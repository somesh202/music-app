<template>
  <app-header />

<router-view v-slot="{ Component }" >
  <transition name="fade" mode="out-in ">
  <component :is="Component"></component>
  </transition>
  </router-view>

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
<style>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.3s linear;
}
.fade-leave-to {
  transition: all 0.3s linear;
  opacity: 0;
}
</style>
