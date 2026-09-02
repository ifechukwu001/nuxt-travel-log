<script lang="ts" setup>
import type { FetchError } from "ofetch";
import type { NominatimResult } from "~~/shared/types";
import getFetchErrorMessage from "~~/shared/utils/get-fetch-error-message";
import { SearchSchema } from "#shared/utils/zod-schemas";

const emit = defineEmits<{
  resultSelected: [result: NominatimResult];
}>();

const searchResults = ref<NominatimResult[]>([]);
const form = useTemplateRef("form");
const loading = ref(false);
const hasSearched = ref(false);
const errorMessage = ref("");

async function onSubmit(query: Record<string, string>) {
  loading.value = true;
  hasSearched.value = true;
  searchResults.value = [];
  errorMessage.value = "";
  try {
    const results = await $fetch("/api/search", {
      query,
    });
    searchResults.value = results;
  }
  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }
  loading.value = false;
}

function setLocation(result: NominatimResult) {
  emit("resultSelected", result);
  searchResults.value = [];
  hasSearched.value = false;
  errorMessage.value = "";
  if (form.value)
    form.value.resetForm();
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Form
      ref="form"
      v-slot="{ errors }"
      class="flex flex-col gap-2 items-center"
      :validation-schema="toTypedSchema(SearchSchema)"
      :initial-values="{ q: '' }"
      @submit="onSubmit"
    >
      <div class="join mt-4">
        <div>
          <label class="input join-item">
            <Icon name="tabler:search" />
            <Field
              type="text"
              name="q"
              placeholder="Search for a location..."
              :disabled="loading"
              :class="{
                'input-error': errors.q,
              }"
            />
          </label>
          <div v-if="errors.q" class="validation-hint text-error text-sm">
            {{ errors.q }}
          </div>
        </div>
        <button :disabled="loading" type="submit" class="btn btn-neutral join-item">
          Search
        </button>
      </div>
    </Form>
    <div v-if="!loading && errorMessage" role="alert" class="alert alert-error">
      <span>{{ errorMessage }}</span>
    </div>
    <div v-else-if="!loading && hasSearched && !searchResults.length" role="alert" class="alert alert-warning">
      <span>No results found</span>
    </div>
    <div v-if="loading" class="flex justify-center">
      <div class="loading loading-lg" />
    </div>
    <div class="flex flex-col gap-2 overflow-auto max-h-54 mt-2">
      <div
        v-for="result in searchResults"
        :key="result.place_id"
        class="card card-sm bg-base-100"
      >
        <div class="card-body">
          <h4 class="card-title">
            {{ result.display_name }}
          </h4>
          <div class="justify-end card-actions">
            <button class="btn btn-warning btn-sm" @click="setLocation(result)">
              Set Location
              <Icon name="tabler:map-pin-share" size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
