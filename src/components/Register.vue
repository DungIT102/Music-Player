<template>
  <div
    v-if="infoRegister.showAlert"
    class="text-white text-center font-bold p-4 rounded mb-4"
    :class="infoRegister.alertVariant"
  >
    {{ infoRegister.alertMsg }}
  </div>

  <vee-form
    :validation-schema="schema"
    @submit="register"
    :initial-values="userData"
    v-slot="{ meta }"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        name="name"
        type="text"
        placeholder="Enter Name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>

    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        type="email"
        placeholder="Enter Email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage name="email" class="text-red-600" />
    </div>

    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage name="age" class="text-red-600" />
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

    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        name="confirm_password"
        type="password"
        placeholder="Confirm Password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage name="confirm_password" class="text-red-600" />
    </div>

    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        name="country"
        as="select"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
      </vee-field>
      <ErrorMessage name="country" class="text-red-600" />
    </div>

    <!-- Tos -->
    <div class="mb-3 pl-6">
      <vee-field
        name="tos"
        value="1"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <a href="#" class="inline-block">I accept Music's Terms of Service</a>
      <ErrorMessage name="tos" class="text-red-600 block" />
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="!meta.valid || infoRegister.submission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700 disabled:opacity-45"
    >
      Submit
    </button>
  </vee-form>
</template>

<script setup>
  import { reactive } from 'vue';
  import { storeToRefs } from 'pinia';
  import useUserStore from '@/stores/user';

  const infoRegister = reactive({
    submission: false,
    showAlert: false,
    alertVariant: '',
    alertMsg: ''
  });

  const schema = reactive({
    name: 'required|alpha_spaces|min:3|max:100',
    email: 'required|email|min:10|max:100',
    age: 'required|min_value:18|max_value:130',
    password: 'required|min:8|max:100',
    confirm_password: 'required|passwords_mismatch:@password',
    country: 'required|country_excluded:Cambodia',
    tos: 'tos'
  });

  const userData = reactive({
    country: 'USA'
  });

  const userStore = useUserStore();
  const { register: createUser } = userStore;
  const { userLoggedIn } = storeToRefs(userStore);

  const register = async (values) => {
    infoRegister.showAlert = true;
    infoRegister.submission = true;
    infoRegister.alertVariant = 'bg-blue-500';
    infoRegister.alertMsg = 'Please wait! Your account is being created.';

    try {
      await createUser(values);
    } catch (err) {
      infoRegister.submission = false;
      infoRegister.alertVariant = 'bg-red-500';
      infoRegister.alertMsg = 'An unexpected error occurred. Please try again later.';
      console.log(err.message);
      return;
    }

    userLoggedIn.value = true;
    infoRegister.alertVariant = 'bg-green-500';
    infoRegister.alertMsg = 'Success! Your account has been created.';
    window.location.reload();
  };
</script>

<style scoped></style>
