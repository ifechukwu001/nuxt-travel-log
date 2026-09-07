<script lang="ts" setup>
import type { InsertLocationLog } from "~~/server/utils/db/schema/location-log";
import { CENTRE_NIGERIA } from "~~/shared/constants";

const route = useRoute();
const { $csrfFetch } = useNuxtApp();
const { currentLocation } = useLocationStore();

async function onSubmit(values: InsertLocationLog) {
  await $csrfFetch(`/api/locations/${route.params.slug}/add`, {
    method: "POST",
    body: values,
  });
};
function submitComplete() {
  navigateTo({ name: "dashboard-location-slug", params: { slug: route.params.slug } });
}
</script>

<template>
  <LocationLogForm
    submit-label="Add Location Log"
    submit-icon="tabler:map-pin-plus"
    :on-submit="onSubmit"
    :on-submit-complete="submitComplete"
    :initial-values="{
      name: '',
      description: '',
      startedAt: Date.now() - (24 * 60 * 60 * 1000),
      endedAt: Date.now(),
      long: currentLocation?.long || (CENTRE_NIGERIA as [number, number])[0],
      lat: currentLocation?.lat || (CENTRE_NIGERIA as [number, number])[1],

    }"
  />
</template>
