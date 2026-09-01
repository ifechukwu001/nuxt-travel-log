<script lang="ts" setup>
import { CENTRE_NIGERIA } from "~~/shared/constants";

const mapStore = useMapStore();

const colormode = useColorMode();
const style = computed(() =>
  colormode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty",
);
const zoom = 6;

onMounted(async () => {
  await mapStore.init();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTRE_NIGERIA"
    :zoom="zoom"
  >
    <MglNavigationControl />
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <div class="tooltip tooltip-top" :data-tip="point.label">
          <Icon name="tabler:map-pin-filled" size="30" class="text-secondary" />
        </div>
      </template>
    </MglMarker>
  </MglMap>
</template>
