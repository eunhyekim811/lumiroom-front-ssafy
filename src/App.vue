<template>
  <div class="min-h-screen bg-brand-bg flex flex-col font-sans select-none text-gray-100 overflow-x-hidden">
    <Navbar />
    <main class="flex-grow pt-16 relative">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/common/Navbar.vue'
</script>