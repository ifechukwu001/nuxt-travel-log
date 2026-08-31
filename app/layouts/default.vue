<script lang="ts" setup>
const authStore = useAuthStore();

await callOnce("authInit", authStore.init);
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppNavBar />
    <main class="flex flex-1 flex-col">
      <slot />
    </main>
  </div>
</template>
