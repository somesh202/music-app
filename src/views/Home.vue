<template>
    <main>
  <section class="mb-8 py-20 text-white text-center relative">
    <div class="absolute md:bg-cover lg:bg-contain inset-0 w-full h-full introduction-bg"
      style="background-image: url(assets/img/header.png)"></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Phasellus et dolor mollis, congue augue non, venenatis elit.
          Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
          sapien. Duis sed magna pulvinar, fringilla lorem eget,
          ullamcorper urna.
        </p>
      </div>
    </div>

    <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="assets/img/introduction-music.png" />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" v-icon="'headphones-alt'">
        <span class="card-title">Songs</span>
        <i class="fa fa-headphones-alt float-right text-green-400 text-2xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <song-item v-for="song in songs" :key="song.docID"
        :song="song" />
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
  </main>
</template>

<script>
import { songsCollection } from '@/includes/firebase';
import SongItem from '../components/SongItem.vue';

export default {
  name: 'Home',
  data() {
    return {
      songs: [],
      maxPerPage: 20,
      pendingRequests: false,
    };
  },
  components: {
    SongItem,
  },
  async created() {
    this.getSongs();

    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomWindow) {
        this.getSongs();
      }
    },
    async getSongs() {
      if (this.pendingRequests) {
        return;
      }
      this.pendingRequests = true;

      let songArr;
      if (this.songs.length) {
        const lastSong = await songsCollection.doc(this.songs[this.songs.length - 1].docID).get();
        songArr = await songsCollection
          .orderBy('modified_name')
          .startAfter(lastSong)
          .limit(this.maxPerPage)
          .get();
      } else {
        songArr = await songsCollection
          .orderBy('modified_name')
          .limit(this.maxPerPage)
          .get();
      }

      songArr.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),
        });
      });

      this.pendingRequests = false;
    },
  },
};
</script>
