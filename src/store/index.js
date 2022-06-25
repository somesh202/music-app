import { createStore } from 'vuex';
import { auth, usersCollection } from '@/includes/firebase';
import { Howl } from 'howler';
import util from '@/includes/util';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    audio: {},
    seek: '00:00',
    duration: '00:00',
    barProgress: '0%',
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
    newSong(state, payload) {
      state.currentSong = payload;
      state.audio = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    updatePosition(state) {
      state.seek = util.formatTime(state.audio.seek());
      state.duration = util.formatTime(state.audio.duration());
      state.barProgress = `${(state.audio.seek() / state.audio.duration()) * 100}%`;
    },
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
    playing: (state) => {
      if (state.audio.playing) {
        return state.audio.playing();
      }

      return false;
    },
  },
  actions: {
    async register({ commit }, payload) {
      const userCred = await auth.createUserWithEmailAndPassword(
        payload.email, payload.password,
      );

      await usersCollection.doc(userCred.user.uid).set({
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
      });

      await userCred.user.updateProfile({
        displayName: payload.name,
      });

      commit('toggleAuth');
    },
    async login({ commit }, payload) {
      await auth.signInWithEmailAndPassword(payload.email, payload.password);

      commit('toggleAuth');
    },
    init_login({ commit }) {
      const user = auth.currentUser;

      if (user) {
        commit('toggleAuth');
      }
    },
    async signout({ commit }) {
      await auth.signOut();

      commit('toggleAuth');

      // if (payload.route.meta.requiresAuth) {
      //   payload.router.push({ name: 'home' });
      // }
    },
    async newSong({ commit, state, dispatch }, payload) {
      if (state.currentSong === payload) {
        dispatch('toggleAudio');
        return;
      }
      console.log(payload);
      if (state.audio instanceof Howl) {
        state.audio.unload();
      }

      commit('newSong', payload);

      state.audio.play();

      state.audio.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });
    },
    async toggleAudio({ state }) {
      if (!state.audio.playing) {
        return;
      }

      if (state.audio.playing()) {
        state.audio.pause();
      } else {
        state.audio.play();
      }
    },
    progress({ commit, state, dispatch }) {
      commit('updatePosition');

      if (state.audio.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    updateSeek({ state, dispatch }, payload) {
      if (!state.audio.playing) {
        return;
      }

      const { x, width } = payload.currentTarget.getBoundingClientRect();
      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.audio.duration() * percentage;

      state.audio.seek(seconds);

      state.audio.once('seek', () => {
        dispatch('progress');
      });
    },
  },
});
