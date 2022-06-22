<template>
            <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">Upload</span>
            <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <div
              class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
                :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
                @drag.prevent.stop=""
                @dragstart.prevent.stop=""
                @dragend.prevent.stop="!is_dragover"
                @dragover.prevent.stop="is_dragover=true"
                @dragenter.prevent.stop="is_dragover=true"
                @dragleave.prevent.stop="!is_dragover"
                @drop.prevent.stop="file_upload($event)">
              <h5>Drop your files here</h5>
            </div>
            <input type="file" multiple @change="file_upload($event)"/>
            <hr class="my-6" />
            <div class="mb-4" v-for="upload in uploads" :key="upload.name">
              <div class="font-bold text-sm" :class="upload.text_class">
                <i :class="upload.icon"></i> {{ upload.name }}
              </div>
              <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                <div class="transition-all progress-bar"
                :class="upload.variant"
                :style="{ width: upload.current_progress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
</template>

<script>
import { storageDb, auth, songsCollection } from '@/includes/firebase';

export default {
  name: 'upload',
  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  methods: {
    file_upload($event) {
      this.is_dragover = false;
      // console.log($event);
      let files;

      if ($event.dataTransfer) {
        files = [...$event.dataTransfer.files];
      } else {
        files = [...$event.target.files];
      }

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return;
        }

        const storageRef = storageDb.ref();
        const songsRef = storageRef.child(`songs/${file.name}`);
        const uploadTask = songsRef.put(file);
        const uploadIdx = this.uploads.push({
          uploadTask,
          current_progress: 0,
          name: file.name,
          variant: 'bg-purple-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: '',
        }) - 1;

        uploadTask.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploads[uploadIdx].current_progress = progress;
        }, (err) => {
          this.uploads[uploadIdx].variant = 'bg-red-400';
          this.uploads[uploadIdx].icon = 'fas fa-times';
          this.uploads[uploadIdx].text_class = 'text-red-400';
          console.log(err);
        }, async () => {
          const song = {
            id: auth.currentUser.uid,
            display_name: auth.currentUser.displayName,
            orginal_name: uploadTask.snapshot.ref.name,
            modified_name: uploadTask.snapshot.ref.name,
            genre: '',
            comments: 0,
          };

          song.url = await uploadTask.snapshot.ref.getDownloadURL();
          await songsCollection.add(song);

          this.uploads[uploadIdx].variant = 'bg-green-400';
          this.uploads[uploadIdx].icon = 'fas fa-check';
          this.uploads[uploadIdx].text_class = 'text-green-400';
          // console.log(err);
        });
      });
      console.log(files);
    },
  },
};
</script>
