<template>
  <div
    v-if="infoLog.showAlert"
    :class="infoLog.alertVariant"
    class="text-white text-center font-bold p-4 mb-4"
  >
    {{ infoLog.alertMsg }}
  </div>

  <!-- Login Form -->
  <vee-form :validation-schema="schema" @submit="login" v-slot="{ meta }">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        type="email"
        placeholder="Enter Email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage name="email" class="text-red-600" />
    </div>

    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        name="password"
        type="password"
        placeholder="Password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage name="password" class="text-red-600" />
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="!meta.valid || infoLog.submission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700 disabled:opacity-45"
    >
      Submit
    </button>
  </vee-form>
</template>

<script setup>
  import useUserStore from '@/stores/user';
  import { reactive } from 'vue';

  const { authenticate } = useUserStore();

  const schema = reactive({
    email: 'required|email',
    password: 'required|min:8|max:100'
  });

  const infoLog = reactive({
    submission: false,
    showAlert: false,
    alertVariant: '',
    alertMsg: ''
  });

  const login = async (values) => {
    infoLog.submission = true;
    infoLog.showAlert = true;
    infoLog.alertVariant = 'bg-blue-500';
    infoLog.alertMsg = 'Please wait! We are logging you in.';

    try {
      await authenticate(values);
    } catch (err) {
      infoLog.submission = false;
      infoLog.alertVariant = 'bg-red-500';
      infoLog.alertMsg = 'Invalid login details.';
      console.log(err.message);

      return;
    }

    infoLog.alertVariant = 'bg-green-500';
    infoLog.alertMsg = 'Success! You are now logged in.';
    window.location.reload();
  };
</script>
