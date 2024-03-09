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
          <li>
            <a class="text-white px-2" href="#">Login / Register</a>
          </li>

          <template>
            <li>
              <RouterLink class="text-white px-2" :to="{ name: 'manage' }">Manage</RouterLink>
            </li>
            <li>
              <a href="#" class="text-white px-2">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup></script>

<style scoped></style>
