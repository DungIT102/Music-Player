<template>
  <Header />
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <transition name="fade" mode="out-in">
        <Suspense timeout="0">
          <template #default>
            <component :is="Component"></component>
          </template>
          <template #fallback>
            <Spinner />
          </template>
        </Suspense>
      </transition>
    </template>
  </RouterView>
  <Auth />
  <Play />
</template>

<script setup>
  import Auth from '@/components/Auth.vue';
  import Header from '@/components/Header.vue';
  import Play from '@/components/Play.vue';
  import Spinner from '@/components/Spinner.vue';
  import { auth } from '@/includes/firebase';
  import useUserStore from '@/stores/user';
  import { storeToRefs } from 'pinia';

  const userStore = useUserStore();
  const { userLoggedIn } = storeToRefs(userStore);
  const checkLogin = () => {
    if (auth.currentUser) userLoggedIn.value = true;
  };

  checkLogin();
</script>

<style scoped>
  .fade-enter-from {
    opacity: 0;
  }

  .fade-enter-active {
    transition: all 0.5s linear;
  }

  .fade-leave-to {
    transition: all 0.5s linear;
    opacity: 0;
  }
</style>
