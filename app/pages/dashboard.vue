<script lang="ts" setup>
const isSidebarOpen = ref(true);

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex-1 flex">
    <div class="bg-base-100 transition-all duration-300" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div class="flex hover:cursor-pointer hover:bg-base-200 p-2" :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }" @click="toggleSidebar">
        <Icon
          v-if="isSidebarOpen"
          name="tabler:chevron-left"
          size="32"
        />
        <Icon
          v-else
          name="tabler:chevron-right"
          size="32"
        />
      </div>
      <div class="flex flex-col">
        <SidebarBtn
          label="Location"
          icon="tabler:map"
          href="/dashboard"
          :show-label="isSidebarOpen"
        />
        <SidebarBtn
          label="Add Location"
          icon="tabler:circle-plus-filled"
          href="/dashboard/add"
          :show-label="isSidebarOpen"
        />
        <div class="divider" />
        <SidebarBtn
          label="Sign Out"
          icon="tabler:logout-2"
          href="/sign-out"
          :show-label="isSidebarOpen"
        />
      </div>
    </div>
    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>
