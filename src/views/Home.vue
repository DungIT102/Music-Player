<template>
  <main>
    <!-- Introduction -->
    <section class="relative text-center text-white mb-8 py-20">
      <div
        style="background-image: url(assets/img/header.png)"
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">Hello Home Page</h1>
          <p class="w-full mx-auto md:w-8/12">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis,
            congue augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet,
            venenatis et sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>
      <img
        src="/assets/img/introduction-music.png"
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="relative flex flex-col bg-white rounded border border-gray-200">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">Songs</span>
          <i class="fa fa-headphones-alt float-right text-green-500"></i>
        </div>
      </div>

      <!-- Playlist-->
      <ol id="playlist">
        <song-item v-for="song in songs" :key="song?.docID" :song="song"></song-item>
      </ol>
    </section>
  </main>
</template>

<script setup>
  import SongItem from '@/components/SongItem.vue';
  import { auth, songRef, songsCollection } from '@/includes/firebase';
  import useUserStore from '@/stores/user';
  import { getDoc, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
  import { storeToRefs } from 'pinia';
  import { reactive, ref, watch } from 'vue';

  const userStore = useUserStore();
  const { userLoggedIn } = storeToRefs(userStore);
  const songs = reactive([]);
  const maxPerPage = ref(6);
  const pendingRequest = ref(false);

  async function getSongs() {
    if (pendingRequest.value) return;

    if (!userLoggedIn.value) {
      songs.splice(0, songs.length);
      return;
    }

    let q;
    if (songs.length) {
      const lastDoc = await getDoc(songRef(songs[songs.length - 1].docID));
      q = query(
        songsCollection,
        where('uid', '==', auth.currentUser?.uid),
        orderBy('modified_name'),
        startAfter(lastDoc),
        limit(maxPerPage.value)
      );
    } else {
      q = query(
        songsCollection,
        where('uid', '==', auth.currentUser?.uid),
        orderBy('modified_name'),
        limit(maxPerPage.value)
      );
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      pendingRequest.value = true;
    } else {
      querySnapshot.forEach((document) => {
        songs.push({
          docID: document.id,
          ...document.data()
        });
      });
    }
  }

  // Fetch Data from server
  watch(
    userLoggedIn,
    async () => {
      await getSongs();
    },
    { immediate: true, deep: true }
  );
</script>

<style scoped>
  @keyframes slide {
    0% {
      background-position: 0 0;
    }

    100% {
      background-position: -4000px 0;
    }
  }

  .introduction-bg {
    animation: slide 50s linear infinite;
    will-change: background-position;
    z-index: -1;
  }
</style>
