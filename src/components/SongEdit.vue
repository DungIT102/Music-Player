<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-if="!showForm">
      <h4 class="inline-block text-2xl font-bold">
        {{ props.song.modified_name }}
      </h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = true"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-else>
      <div
        v-if="infoEdit.showAlert"
        class="text-white text-center font-bold p-4 mb-4"
        :class="infoEdit.alertVariant"
      >
        {{ infoEdit.alertMsg }}
      </div>
      <vee-form
        :validation-schema="schema"
        :initial-value="props.song"
        v-slot="{ meta }"
        @submit="edit"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modified_name"
            type="text"
            :value="props.song.modified_name"
            @input="updateUnsavedFlag(true)"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          />
          <ErrorMessage name="modified_name" class="text-red-600" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            :value="props.song.genre"
            @input="updateUnsavedFlag(true)"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          />
          <ErrorMessage name="genre" class="text-red-600" />
        </div>
        <button
          type="submit"
          :disabled="!meta.valid || infoEdit.submission"
          class="py-1.5 px-3 rounded text-white bg-green-600 disabled:opacity-45"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script setup>
  import { songRef, storage } from '@/includes/firebase';
  import { deleteDoc, updateDoc } from 'firebase/firestore';
  import { deleteObject, ref as storeRef } from 'firebase/storage';
  import { reactive, ref } from 'vue';

  const props = defineProps({
    song: { type: Object, required: true },
    index: { type: Number, required: true },
    updateSong: { type: Function, required: true },
    removeSong: { type: Function, required: true },
    updateUnsavedFlag: { type: Function }
  });

  const showForm = ref(false);
  const infoEdit = reactive({
    submission: false,
    showAlert: false,
    alertVariant: 'bg-blue-500',
    alertMsg: ''
  });

  const schema = reactive({
    modified_name: 'required',
    genre: 'alpha_spaces'
  });

  const edit = async (values) => {
    infoEdit.submission = true;
    infoEdit.showAlert = true;
    infoEdit.alertVariant = 'bg-blue-500';
    infoEdit.alertMsg = 'Please wait! Updating song info.';

    try {
      await updateDoc(songRef(props.song.docID), values);
    } catch (err) {
      infoEdit.submission = false;
      infoEdit.alertVariant = 'bg-red-500';
      infoEdit.alertMsg = 'Something went wrong! Try again later';
      return;
    }

    props.updateSong(props.index, values);
    props.updateUnsavedFlag(false);
    infoEdit.submission = false;
    showForm.value = false;
    infoEdit.alertVariant = 'bg-green-500';
    infoEdit.alertMsg = 'Success!';
  };

  const deleteSong = async () => {
    const songObjRef = storeRef(storage, `songs/${props.song?.original_name}`);
    try {
      await deleteDoc(songRef(props.song?.docID));
      await deleteObject(songObjRef);
    } catch (err) {
      console.log(err.message);
      return;
    }

    props.removeSong(props.index);
  };
</script>
