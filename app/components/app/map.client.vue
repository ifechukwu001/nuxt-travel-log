<script lang="ts" setup>
import { CENTRE_NIGERIA } from "~~/shared/constants";

const colormode = useColorMode();
const style = computed(() =>
  colormode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty",
);
const zoom = 6;
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTRE_NIGERIA"
    :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>
