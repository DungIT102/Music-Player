<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <RouterLink :to="{ name: 'home' }" class="text-white font-bold uppercase text-2xl mr-4">
        Music
      </RouterLink>

      <div class="flex flex-grow items-center">
        <ul class="flex flex-row mt-1">
          <li>
            <RouterLink class="text-white px-2" :to="{ name: 'about' }">About</RouterLink>
          </li>
          <li v-if="!userLoggedIn">
            <a class="text-white px-2" href="#" @click.prevent="toggleAuthModal">
              Login / Register
            </a>
          </li>

          <template v-else>
            <li>
              <RouterLink class="text-white px-2" :to="{ name: 'manage' }">Manage</RouterLink>
            </li>
            <li>
              <a href="#" class="text-white px-2" @click.prevent="signOut">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
  import useModalStore from '@/stores/modal';
  import useUserStore from '@/stores/user';
  import { storeToRefs } from 'pinia';
  import { useRoute, useRouter } from 'vue-router';

  const userStore = useUserStore();
  const modalStore = useModalStore();
  const { signOut: Exit } = userStore;
  const { meta } = useRoute();
  const { push } = useRouter();

  const { userLoggedIn } = storeToRefs(userStore);
  const { isOpen } = storeToRefs(modalStore);

  const toggleAuthModal = () => {
    isOpen.value = !isOpen.value;
  };

  const signOut = async () => {
    await Exit();

    if (meta.requiresAuth) {
      push({ name: 'home' });
    }
  };
</script>

<style scoped></style>
