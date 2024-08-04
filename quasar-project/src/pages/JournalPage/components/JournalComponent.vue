<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { cloneDeep } from 'lodash'
import { JournalRecord } from 'src/pages/JournalPage/composables/useRecords/types'

const props = defineProps<{
  records: JournalRecord[] | null
  isUserCanEdit: boolean
  // modelValue: JournalRecord[] | null
}>()

const emit = defineEmits<{
  // (e: 'update:modelValue', value: JournalRecord[] | null): void
  (e: 'goTo', value: JournalRecord): void
  (e: 'delete', value: JournalRecord): void
  (e: 'edit', value: JournalRecord): void
  (
    e: 'fastTimeEdit',
    { record, time }: { record: JournalRecord; time: number },
  ): void
}>()

const sortJournalRecordsByTime = (a: JournalRecord, b: JournalRecord) => {
  const aT = a.data.timecode
  const bT = b.data.timecode
  if (aT > bT) return -1

  if (aT < bT) return 1
  return 0
}

const recordsClone = ref<JournalRecord[] | null>([])

watch(
  () => props.records,
  () => {
    recordsClone.value = cloneDeep(props.records)
    recordsClone.value?.sort(sortJournalRecordsByTime)
  },
  { deep: true, immediate: true },
)

const journalSize = ref<{ height: number; width: number }>({
  height: 0,
  width: 0,
})

const onResize = (size: { height: number; width: number }) => {
  journalSize.value.height = size.height
}

const secsToDate = (seconds: number) =>
  new Date(seconds * 1000).toISOString().slice(11, 21)

const editRecord = (index: number) => {
  emit('edit', recordsClone.value[index])
}
</script>

<!-- <q-card-section
      v-if="journalSize.height > 0"
      class="scroll"
      :style="{ height: journalSize.height + 'px' }"
    > -->

<template>
  <q-card
    v-if="props.records?.length > 0"
    class="column col-grow no-wrap"
  >
    <q-resize-observer @resize="onResize" />
    <!-- <div class="flex row-reverse justify-between q-ma-sm">
      <q-btn >хз/q-btn>
      
    </div>
    <q-separator></q-separator> -->

    <q-card-section>
      <q-list separator>
        <q-item
          v-for="(record, index) in recordsClone"
          :key="record.id"
          class="parent"
        >
          <q-item-section
            avatar
            @click="emit('goTo', record)"
          >
            <div
              class="row items-center justify-center full-width"
              style="text-align: center"
            >
              <div>
                {{ secsToDate(record.data.timecode) }}
              </div>
            </div>
          </q-item-section>
          <q-item-section @click="emit('goTo', record)">
            <!-- <q-chat-message
              :text="[record.comment]"
              size="10"
              text-color="white"
              bg-color="primary"
            /> -->
            <!-- {{ record.comment }} -->
            <div
              class="row no-wrap items-center q-gutter-md"
              @click="emit('goTo', record)"
            >
              <q-icon
                :name="record?.data?.buttonIcon"
                :style="{ color: record?.data?.buttonColor }"
                size="2em"
              ></q-icon>
              <div class="col">
                {{ record.data?.comment }}
                <!-- <q-input
                  v-model="record.data.comment"
                  readonly
                  filled
                  autogrow
                  @click="editRecord(index)"
                /> -->
              </div>
            </div>
          </q-item-section>

          <div
            v-if="isUserCanEdit"
            class="overlay row justify-between q-px-md"
          >
            <q-item-section avatar>
              <div
                class="row items-center justify-center full-width"
                style="text-align: center"
              >
                <div @click="emit('goTo', record)">
                  {{ secsToDate(record.data.timecode) }}
                </div>
              </div>
              <div
                class="row items-center justify-center"
                style="text-align: center"
              >
                <q-icon
                  name="keyboard_double_arrow_left"
                  size="sm"
                  left
                  @click="emit('fastTimeEdit', { record: record, time: -5 })"
                /><q-icon
                  name="keyboard_arrow_left"
                  size="sm"
                  left
                  @click="emit('fastTimeEdit', { record: record, time: -1 })"
                />
                <!-- <q-input
                v-model="record.timecode"
                readonly
                autogrow
                borderless
                dense
                input-style=""
              /> -->

                <q-icon
                  name="keyboard_arrow_right"
                  size="sm"
                  right
                  @click="emit('fastTimeEdit', { record: record, time: 1 })"
                />
                <q-icon
                  name="keyboard_double_arrow_right"
                  size="sm"
                  right
                  @click="emit('fastTimeEdit', { record: record, time: 5 })"
                />
              </div>
            </q-item-section>
            <q-item-section side>
              <div class="row justify-center q-gutter-md">
                <q-btn
                  flat
                  icon="edit"
                  dense
                  size="sm"
                  @click="editRecord(index)"
                />
                <q-btn
                  flat
                  icon="delete"
                  dense
                  size="sm"
                  @click="emit('delete', record)"
                />
              </div>
            </q-item-section>
          </div>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<style lang="sass" scoped>
.input-white
  text-color: "gary-1"

.overlay
  border-radius: 10px !important
  flex-wrap: no-wrap
  position: absolute
  top: 1px
  right: 0px
  background-color: rgba(245, 245, 245, 0.9)
  display: none


.parent:hover .overlay
  display: flex



.border-radius-10
  border-radius: 10px !important
</style>
