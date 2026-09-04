<script lang="ts" setup>
const locationStore = useLocationStore();
const {
  currentLocation: location,
  currentLocationStatus: status,
  currentLocationError: error,
} = storeToRefs(locationStore);
</script>

<template>
  <div class="p-4 min-h-64">
    <div v-if="status === 'pending'">
      <span class="loading" />
    </div>
    <div v-if="location && status !== 'pending'">
      <h2 class="text-xl">
        {{ location?.name }}
      </h2>
      <p class="text-sm">
        {{ location.description }}
      </p>
      <div v-if="!location.locationLogs.length" class="mt-4">
        <p class="text-sm italic">
          Add a location log to get started.
        </p>
        <button class="btn btn-primary mt-2">
          Add location log
          <Icon name="tabler:map-pin-plus" size="24" />
        </button>
      </div>
    </div>
    <div v-if="error" class="alert alert-error">
      <h2 class="text-lg">
        {{ error.statusText }}
      </h2>
    </div>
  </div>
</template>
