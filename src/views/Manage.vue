<template>
    <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
<music-upload ref="upload" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <composition-item v-for="(song, idx) in songs" :key="song.docID"
            :song="song"
            :updateSong="updateSong"
            :index="idx"/>
        </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import MusicUpload from '@/components/Upload.vue';
import { songsCollection, auth } from '@/includes/firebase';
import CompositionItem from '../components/CompositionItem.vue';

export default {
  name: 'manage',
  components: {
    MusicUpload, CompositionItem,
  },
  data() {
    return {
      songs: [],
    };
  },
  async created() {
    const snapshot = await songsCollection.where('id', '==', auth.currentUser.uid).get();

    snapshot.forEach((document) => {
      const song = {
        ...document.data(),
        docID: document.id,
      };

      this.songs.push(song);
    });
  },
  methods: {
    updateSong(idx, values) {
      this.songs[idx].modified_name = values.modified_name;
      this.songs[idx].genre = values.genre;
    },
  },
};
</script>
