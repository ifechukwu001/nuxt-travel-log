<script lang="ts" setup>
import type { InsertLocation } from "~~/server/utils/db/schema/location";

const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocation) {
  await $csrfFetch("/api/locations", {
    method: "POST",
    body: values,
  });
};

function onSubmitComplete() {
  navigateTo("/dashboard");
}
</script>

<template>
  <div class="container max-w-md mx-auto px-4">
    <div class="my-4">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled to or will travel to. It can be a city, country, or any other geographical location. You can add a location by providing its name, description, and an optional image.
      </p>
    </div>
    <LocationForm
      submit-label="Add"
      submit-icon="tabler:circle-plus-filled"
      :on-submit
      :on-submit-complete
    />
  </div>
</template>
