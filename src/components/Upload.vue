<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />

      <!-- Progress Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i>{{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { auth, songsCollection, storage } from '@/includes/firebase';
  import { addDoc } from 'firebase/firestore';
  import { getDownloadURL, ref as storeRefs, uploadBytesResumable } from 'firebase/storage';
  import { onBeforeUnmount, reactive, ref } from 'vue';

  const is_dragover = ref(false);
  const uploads = reactive([]);
  const props = defineProps({
    addSong: { type: Function, required: true }
  });

  async function upload($event) {
    is_dragover.value = false;
    const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files];

    files.forEach(async (file) => {
      if (file.type !== 'audio/mpeg') return;

      if (!navigator.onLine) {
        uploads.push({
          uploadTask: {},
          current_progress: 100,
          name: file.name,
          variant: 'bg-red-400',
          icon: 'fas fa-times',
          text_class: 'text-red-400'
        });
        return;
      }

      const songsRef = storeRefs(storage, `songs/${file.name}`);
      const metadata = { contentType: 'audio/mpeg' };
      const uploadTask = uploadBytesResumable(songsRef, file, metadata);
      const uploadIndex =
        uploads.push({
          uploadTask,
          current_progress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: ''
        }) - 1;

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          uploads[uploadIndex].current_progress = progress;
        },
        (err) => {
          uploads[uploadIndex].variant = 'bg-red-400';
          uploads[uploadIndex].icon = 'fas fa-times';
          uploads[uploadIndex].text_class = 'text-red-400';
          console.log(err);
        },
        async () => {
          const song = {
            uid: auth.currentUser.uid,
            display_name: auth.currentUser.displayName,
            original_name: uploadTask.snapshot.ref.name,
            modified_name: uploadTask.snapshot.ref.name,
            genre: '',
            comment_count: 0
          };

          song.url = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(songsCollection, song);
          props.addSong(song);
          uploads[uploadIndex].variant = 'bg-green-400';
          uploads[uploadIndex].icon = 'fas fa-check';
          uploads[uploadIndex].text_class = 'text-green-400';
        }
      );
    });
  }

  onBeforeUnmount(() => {
    uploads.forEach((upload) => {
      upload.uploadTask.cancel();
    });
  });
</script>

<style scoped>
  @keyframes progress-bar-stripes {
    0% {
      background-position: 1rem 0;
    }
    100% {
      background-position: 0 0;
    }
  }
  .progress-bar {
    background-size: 1rem 1rem;
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    animation: progress-bar-stripes 1s linear infinite;
  }

  input[type='file'] {
    margin-top: 20px;
  }
</style>
