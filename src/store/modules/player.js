import { Howl } from 'howler';
import util from '@/includes/util';

export default {
  state: {
    currentSong: {},
    audio: {},
    seek: '00:00',
    duration: '00:00',
    barProgress: '0%',
  },
  getters: {
    playing: (state) => {
      if (state.audio.playing) {
        return state.audio.playing();
      }

      return false;
    },
  },
  mutations: {
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
  actions: {
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
};
