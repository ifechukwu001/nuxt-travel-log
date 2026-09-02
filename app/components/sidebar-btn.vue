<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
  label: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
  showLabel?: boolean;
  iconColor?: "text-accent" | "text-primary" | "text-secondary";
}>();

const route = useRoute();
</script>

<template>
  <div class="tooltip tooltip-right" :data-tip="props.showLabel ? undefined : props.label">
    <NuxtLink
      :to="props.href || props.to"
      :class="{ 'bg-base-200': route.path === props.href, 'justify-start': props.showLabel, 'justify-center': !props.showLabel }"
      class="flex gap-2 p-2 hover:bg-base-300 hover:cursor-pointer flex-nowrap"
    >
      <Icon :name="props.icon" size="24" :class="props.iconColor" />
      <Transition name="grow">
        <span v-if="props.showLabel">{{ props.label }}</span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
.grow-enter-active {
  animation: grow 0.1s;
}
.grow-leave-active {
  animation: grow 0.05s reverse;
}

@keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
