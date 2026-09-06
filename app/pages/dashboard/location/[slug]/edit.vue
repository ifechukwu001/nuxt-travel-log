<script lang="ts" setup>
import type { InsertLocation } from "~~/server/utils/db/schema/location";

const route = useRoute();
const { $csrfFetch } = useNuxtApp();
const locationStore = useLocationStore();

async function onSubmit(values: InsertLocation) {
  await $csrfFetch(`/api/locations/${route.params.slug}`, {
    method: "PUT",
    body: values,
  });
};

function onSubmitComplete() {
  navigateTo({
    name: "dashboard-location-slug",
    params: { slug: route.params.slug },
  });
}
</script>

<template>
  <LocationForm
    v-if="locationStore.currentLocationStatus !== 'pending'"
    submit-label="Update"
    submit-icon="tabler:map-pin-up"
    :on-submit
    :on-submit-complete
    :initial-values="locationStore.currentLocation"
  />
</template>
