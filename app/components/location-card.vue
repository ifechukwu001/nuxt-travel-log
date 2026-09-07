<script lang="ts" setup>
defineProps<{
  mapPoint: MapPoint;
}>();

const mapStore = useMapStore();
</script>

<template>
  <NuxtLink
    :to="mapPoint.to"
    class="card bg-base-300 h-40 w-72 border-2 shrink-0 mb-2 hover:cursor-pointer"
    :class="{
      'border-accent': isPointSelected(mapPoint, mapStore.selectedPoint),
      'border-transparent': !isPointSelected(mapPoint, mapStore.selectedPoint),
    }"
    @mouseenter="mapStore.selectedPoint = mapPoint"
    @mouseleave="mapStore.selectedPoint = null"
  >
    <div class="card-body">
      <slot name="top" />
      <h3 class="card-title">
        {{ mapPoint.name }}
      </h3>
      <p>{{ mapPoint.description }}</p>
    </div>
  </NuxtLink>
</template>
