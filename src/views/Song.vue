<template>
  <main>
    <!-- Music Header -->
    <section class="relative w-full mb-8 py-14 text-white text-center">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          @click.prevent="newSong(song)"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">1$</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="relative flex flex-col bg-white rounded border border-gray-200">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title"> 2 </span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            v-if="infoComment.showAlert"
            class="text-white text-center font-bold p-4 mb-4"
            :class="infoComment.alertVariant"
          >
            {{ infoComment.alertMsg }}
          </div>
          <vee-form
            :validation-schema="schema"
            v-if="userLoggedIn"
            v-slot="{ meta }"
            @submit="addComment"
          >
            <vee-field
              name="comment"
              as="textarea"
              placeholder="Your comment here..."
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            />
            <ErrorMessage name="comment" class="text-red-600" />
            <button
              type="submit"
              :disabled="!meta.valid || infoComment.submission"
              class="py-1.5 px-3 rounded text-white bg-green-600 block disabled:opacity-45"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.docID"
      >
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.dataPosted }}</time>
        </div>

        <p>{{ comment.content }}</p>
      </li>
    </ul>
  </main>
</template>

<script setup>
  import { auth, commentsCollection, songRef } from '@/includes/firebase';
  import usePlayerStore from '@/stores/player';
  import useUserStore from '@/stores/user';
  import {
    addDoc,
    getDoc,
    getDocs,
    query as storeQuery,
    updateDoc,
    where
  } from 'firebase/firestore';
  import { storeToRefs } from 'pinia';
  import { computed, reactive, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const userStore = useUserStore();
  const { userLoggedIn } = storeToRefs(userStore);
  const { newSong } = usePlayerStore();
  const { query, params } = useRoute();
  const { push } = useRouter();
  const song = reactive({});
  const comments = reactive([]);
  const sort = ref(1);
  const schema = reactive({
    comment: 'required|min:2'
  });

  const infoComment = reactive({
    submission: false,
    showAlert: false,
    alertVariant: 'bg-blue-500',
    alertMsg: ''
  });

  watch(sort, (newVal) => {
    if (newVal === query.sort) return;
    push({ query: { sort: newVal } });
  });

  const sortedComments = computed(() => {
    return comments.slice().sort((a, b) => {
      if (sort.value === '1') {
        return new Date(b.datePosted) - new Date(a.datePosted);
      }

      return new Date(a.datePosted) - new Date(b.datePosted);
    });
  });

  const addComment = async (values, { resetForm }) => {
    infoComment.submission = true;
    infoComment.showAlert = true;
    infoComment.alertVariant = 'bg-blue-500';
    infoComment.alertMsg = 'Please wait! Your comment is being submitted';

    const comment = {
      content: values.comment,
      sid: params.id,
      name: auth.currentUser.displayName,
      uid: auth.currentUser.uid,
      datePosted: new Date().toString()
    };

    try {
      await addDoc(commentsCollection, comment);
    } catch (err) {
      infoComment.submission = false;
      infoComment.alertVariant = 'bg-red-500';
      infoComment.alertMsg = 'Invalid add a comment.';
    }

    song.comment_count += 1;
    await updateDoc(songRef(params.id), { comment_count: song.comment_count });

    await getComments();

    infoComment.submission = false;
    infoComment.alertVariant = 'bg-green-500';
    infoComment.alertMsg = 'comment added';

    resetForm();
  };

  const getComments = async () => {
    const q = storeQuery(commentsCollection, where('sid', '==', params.id));
    const snapShots = await getDocs(q);
    comments.splice(0, comments.length);

    snapShots.forEach((doc) => {
      comments.push({
        docID: doc.id,
        ...doc.data()
      });
    });
  };

  const docSnapshot = await getDoc(songRef(params.id));
  if (!docSnapshot.exists()) {
    push({ name: 'home' });
  } else {
    const songData = docSnapshot.data();

    Object.keys(songData).forEach((key) => {
      song[key] = songData[key];
    });

    await getComments();
  }
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

  .music-bg {
    animation: slide 50s linear infinite;
    will-change: background-position;
  }
</style>
