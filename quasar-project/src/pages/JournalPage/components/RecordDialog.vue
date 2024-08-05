<script setup lang="ts">
import { watch, ref } from 'vue'
import { cloneDeep } from 'lodash'
import {
  JournalRecord,
  RecordData,
} from 'src/pages/JournalPage/composables/useRecords/types'
const props = defineProps<{
  record: JournalRecord | null
}>()

const emit = defineEmits<{
  (e: 'updateRecord', value: JournalRecord | null): void
  (e: 'close-dialog'): void
  (e: 'delete', value: JournalRecord): void
}>()

const clonedRecord = ref<JournalRecord | null>(null)

watch(
  () => props.record,
  () => {
    clonedRecord.value = cloneDeep(props.record)
    // if (!clonedRecord.value?.comment) clonedRecord.value['comment'] = ''
  },
)

const closeDialog = () => {
  emit('close-dialog')
}

const updateRecord = () => {
  console.log('emit', clonedRecord.value)

  emit('updateRecord', clonedRecord.value)
}

const deleteRecord = () => (props.record ? emit('delete', props.record) : 0)
</script>

<template>
  <q-dialog
    :model-value="!!clonedRecord"
    @hide="closeDialog()"
  >
    <q-card style="width: 600px; max-width: 80vw">
      <q-card-section>
        <div class="row justify-between items-center">
          <div class="text-h6">Edit Record</div>
          <q-icon
            v-if="props.record"
            name="delete"
            size="2em"
            color="red"
            @click="deleteRecord"
          />
        </div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-btn
          icon="colorize"
          :style="{ backgroundColor: clonedRecord?.data?.buttonColor }"
          ><q-popup-proxy
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-color v-model="clonedRecord.data.buttonColor" /> </q-popup-proxy
        ></q-btn>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row no-wrap items-center q-gutter-md">
          <q-icon
            :name="clonedRecord?.data?.buttonIcon"
            :style="{ color: clonedRecord?.data?.buttonColor }"
            size="3em"
          ></q-icon>
          <div class="col col-grow">
            <q-input
              label="Описание"
              autofocus
              v-model.trim="clonedRecord.data.comment"
              @keydown.enter.prevent="updateRecord"
              @keydown.esc.prevent="closeDialog"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions
        align="right"
        class="bg-white text-teal"
      >
        <q-btn
          flat
          label="exit"
          @click="closeDialog"
        />
        <q-btn
          flat
          label="save"
          @click="updateRecord"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
