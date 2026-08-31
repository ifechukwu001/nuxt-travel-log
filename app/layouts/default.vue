<script lang="ts" setup>
const authStore = useAuthStore();

await callOnce("authInit", authStore.init, { mode: "navigation" });
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppNavBar />
    <main class="flex flex-1 flex-col">
      <slot />
    </main>
  </div>
</template>
