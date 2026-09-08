<script lang="ts" setup>
import type { FetchError } from "ofetch";

const route = useRoute();
const locationStore = useLocationStore();
const {
  currentLocationLog: locationLog,
  currentLocationLogStatus: status,
  currentLocationLogError: error,
} = storeToRefs(locationStore);

const isOpen = ref(false);
const isDeleting = ref(false);
const deleteError = ref("");

const loading = computed(() => isDeleting.value || status.value === "pending");
const errorMessage = computed(() => error.value?.statusText || deleteError.value);

function openDialog() {
  isOpen.value = true;

  (document.activeElement as HTMLAnchorElement).blur();
}

async function confirmDelete() {
  try {
    isOpen.value = false;
    deleteError.value = "";
    isDeleting.value = true;
    await $fetch(`/api/locations/${route.params.slug}/${route.params.id}`, {
      method: "DELETE",
    });

    navigateTo({ name: "dashboard-location-slug", params: { slug: route.params.slug } });
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = getFetchErrorMessage(error);
  }
  finally {
    isDeleting.value = false;
  }
}

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug-id")
    locationStore.refreshCurrentLocationLog();
});
</script>

<template>
  <div class="page-content-top">
    <div v-if="loading">
      <span class="loading" />
    </div>
    <div v-if="errorMessage && !loading" class="alert alert-error">
      <h2 class="text-lg">
        {{ errorMessage }}
      </h2>
    </div>
    <div v-if="route.name === 'dashboard-location-slug-id' && locationLog && !loading">
      <p class="text-sm italic text-gray-500">
        <span v-if="locationLog.startedAt !== locationLog.endedAt">
          {{ formatDate(locationLog.startedAt) }} / {{ formatDate(locationLog.endedAt) }}
        </span>
        <span v-else>
          {{ formatDate(locationLog.startedAt) }}
        </span>
      </p>
      <h2 class="text-xl">
        {{ locationLog.name }}
        <div class="dropdown dropdown-bottom">
          <div tabindex="0" role="button" class="btn btn-sm m-1 p-0">
            <Icon name="tabler:dots-vertical" size="20" />
          </div>
          <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <NuxtLink @click="openDialog">
                <Icon name="tabler:trash-x-filled" size="20" />
                Delete
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="{ name: 'dashboard-location-slug-id-edit', params: { slug: route.params.slug, id: route.params.id } }">
                <Icon name="tabler:map-pin-cog" size="20" />
                Edit
              </NuxtLink>
            </li>
          </ul>
        </div>
      </h2>
      <p class="text-sm">
        {{ locationLog.description }}
      </p>
      <div v-if="!locationLog.images.length" class="flex flex-col gap-2 mt-4">
        <NuxtLink
          :to="{
            name: 'dashboard-location-slug-id-images',
            params: { slug: route.params.slug, id: route.params.id },
          }"
          class="btn btn-primary w-40"
        >
          Add Image
          <Icon name="tabler:photo-cog" size="24" />
        </NuxtLink>
      </div>
      <ImageList :images="locationLog.images" />
    </div>
    <div v-else>
      <NuxtPage />
    </div>
    <AppDialog
      title="Are you sure?"
      description="Deleting this location log cannot be undone. Do you really want to do this?"
      confirm-label="Yes, delete this location log"
      confirm-class="btn-error"
      :is-open="isOpen"
      @on-closed="isOpen = false"
      @on-confirmed="confirmDelete"
    />
  </div>
</template>
