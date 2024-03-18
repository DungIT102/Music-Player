<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <Upload :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <SongEdit
              v-for="(song, i) in songs"
              :key="song.docID"
              :index="i"
              :song="song"
              :updateSong="updateSong"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import SongEdit from '@/components/SongEdit.vue';
  import Upload from '@/components/Upload.vue';
  import { auth, songsCollection } from '@/includes/firebase';
  import { getDocs, query, where } from 'firebase/firestore';
  import { reactive, ref } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';

  const songs = reactive([]);
  const unsavedFlag = ref(false);

  const updateSong = (i, values) => {
    songs[i].modified_name = values.modified_name;
    songs[i].genre = values.genre;
  };

  const removeSong = (i) => {
    songs.splice(i, 1);
  };

  const addSong = (document) => {
    const song = document.data ? { ...document.data(), docID: document.id } : { ...document };
    songs.push(song);
  };

  const updateUnsavedFlag = (value) => {
    unsavedFlag.value = value;
  };

  onBeforeRouteLeave((to, from, next) => {
    if (!unsavedFlag.value) return next();

    const leaveConfirm = confirm('You have unsaved changes. Are you sure you want to leave?');
    next(leaveConfirm);
  });

  const q = query(songsCollection, where('uid', '==', auth.currentUser.uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(addSong);
</script>
