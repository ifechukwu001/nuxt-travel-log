<script lang="ts" setup>
import type { InsertLocationLog } from "#build/types/nitro-imports";

const route = useRoute();
const { $csrfFetch } = useNuxtApp();
const locationStore = useLocationStore();
const {
  currentLocationLog: locationLog,
} = storeToRefs(locationStore);

async function onSubmit(values: InsertLocationLog) {
  await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}`, {
    method: "PUT",
    body: values,
  });
}

function submitComplete() {
  navigateTo({ name: "dashboard-location-slug-id", params: { slug: route.params.slug, id: route.params.id } });
}
</script>

<template>
  <LocationLogForm
    v-if="locationLog"
    submit-label="Update Location Log"
    submit-icon="tabler:map-pin-up"
    :on-submit="onSubmit"
    :on-submit-complete="submitComplete"
    :initial-values="locationLog"
  />
</template>
