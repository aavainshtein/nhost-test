<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'submit', value: string): void
}>()

const sourceLink = ref<string>('')
const submit = () => {
  emit('submit', sourceLink.value)
}
</script>

<template>
  <div class="q-pa-md">
    <div
      class="q-gutter-md"
      style="max-width: 400px"
    >
      <q-input
        clearable
        filled
        color="purple-12"
        v-model="sourceLink"
        label="Video source link"
      >
        <template v-slot:after>
          <q-btn
            @click="submit"
            icon="download"
          ></q-btn>
        </template>
      </q-input>
    </div>
  </div>
</template>
