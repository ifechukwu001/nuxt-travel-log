<script lang="ts" setup>
const props = defineProps<{
  label: string;
  name: string;
  value: number;
  type?: "text" | "textarea" | "number";
  disabled?: boolean;
  error?: string;
}>();

const { handleBlur, value: inputValue, handleChange } = useField<number>(props.name, {
  initialValue: props.value,
});

function dateChanged(event: Event) {
  const target = event.target as HTMLInputElement;
  handleChange(new Date(target.value).getTime());
}

function formatDateISO(value: number) {
  return new Date(value).toISOString().split("T")[0];
}
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <input
      :name="props.name"
      type="date"
      :disabled="props.disabled"
      class="w-full input"
      :class="{
        'input-error': props.error,
      }"
      :value="formatDateISO(inputValue)"
      @change="dateChanged"
      @blur="handleBlur"
    >
    <p v-if="props.error" class="label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
