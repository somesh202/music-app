<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!displayForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="displayForm = !displayForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="displayForm">
        <div class="text-white text-center font-bold p-4 mb-4" v-if="show_alert"
        :v-if="show_alert"
        :class="alert_variant">
        {{ alert_mssg }}
        </div>
      <vee-form
        :validation-schema="validationSchema"
        :initial-values="song"
        @submit="editSong"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission"
          @click.prevent="displayForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection, storageDb } from '@/includes/firebase';

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      reuired: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      displayForm: false,
      validationSchema: {
        modified_name: 'required',
        genre: 'alpha_spaces',
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-400',
      alert_mssg: 'Please wait! Updating song info',
    };
  },
  methods: {
    async editSong(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = 'bg-blue-500';
      this.alert_mssg = 'Please wait! Updating song info';
      //   console.log('Song edited');
      try {
        await songsCollection.doc(this.song.docID).update(values);
      } catch (err) {
        this.in_submission = false;
        this.alert_variant = 'bg-red-500';
        this.alert_mssg = 'Something went wrong! Try again later';
      }

      this.updateSong(this.index, values);

      this.in_submission = false;
      this.alert_variant = 'bg-green-500';
      this.alert_mssg = 'Success!';
    },
    async deleteSong() {
      const storageRef = storageDb.ref();
      const songRef = storageRef.child(`songs/${this.song.orginal_name}`);

      await songRef.delete();

      await songsCollection.doc(this.song.docID).delete();

      this.removeSong(this.index);
    },
  },
};
</script>
