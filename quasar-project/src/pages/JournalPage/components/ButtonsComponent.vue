<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { cloneDeep } from 'lodash'

import { Dialog } from 'quasar'
import ButtonDialog from './ButtonDialog.vue'
import {
  ButtonSet,
  Buttonset_Insert_Input,
  ButtonSetButton,
} from '../composables/useButtonSets/types'

const props = defineProps<{
  buttonSets: ButtonSet[] | null
  buttonSetId: ButtonSet['id'] | null
}>()

const emit = defineEmits<{
  (e: 'newRecord', value: ButtonSetButton): void
  (e: 'edited', value: ButtonSet | null): void
  (e: 'selected', value: ButtonSet['id'] | null): void
  (e: 'delete', value: ButtonSet['id'] | null): void
}>()

const isEditMode = ref<boolean>(false)

const buttonSetsOptions = computed(() => {
  const userButtonsOptions = props.buttonSets?.map((buttonSet, index) => ({
    label: buttonSet.title,
    value: buttonSet.id,
  }))
  const defaultOptions = [{ label: 'default', value: null }]
  return userButtonsOptions
    ? [...defaultOptions, ...userButtonsOptions]
    : defaultOptions
})

const selectedButtonSet = ref<{ label: string; value: ButtonSet['id'] } | null>(
  null,
)
const buttonSetClone = ref<ButtonSet | null>(null)

const emptyButtonSet = {
  title: 'Новый набор',
  id: '',
  buttons: [],
  created_at: '',
  creator_id: '',
  updated_at: '',
} as ButtonSet

watch(
  () => props.buttonSetId,
  () => {
    console.log('buttons component buttonSetId watcher', props.buttonSetId)

    if (!!buttonSetsOptions.value)
      selectedButtonSet.value =
        buttonSetsOptions.value.find(
          (set) => set.value === props.buttonSetId,
        ) ?? null

    buttonSetClone.value = cloneDeep(
      props.buttonSets?.find((set) => set.id === props.buttonSetId) ??
        emptyButtonSet,
    )

    console.log('selected', selectedButtonSet.value)
  },
  { immediate: true },
)

watch(
  () => props.buttonSets,
  () => {
    console.log('buttons component buttonSets watcher', props.buttonSets)

    buttonSetClone.value = cloneDeep(
      props.buttonSets?.find((set) => set.id === props.buttonSetId) ??
        emptyButtonSet,
    )

    if (!!buttonSetsOptions.value)
      selectedButtonSet.value =
        buttonSetsOptions.value.find(
          (set) => set.value === props.buttonSetId,
        ) ?? null
  },
)

watch(
  () => buttonSetClone.value?.title,
  () => {
    console.log('buttonSetClone.title Watcher')
    const originalButtonSet =
      props.buttonSets?.find((set) => set.id === props.buttonSetId) ??
      emptyButtonSet
    if (buttonSetClone.value?.title !== originalButtonSet.title)
      emit('edited', buttonSetClone.value)
  },
)

// selected?
watch(selectedButtonSet, () => {
  emit('selected', selectedButtonSet.value?.value ?? null)
})

const defButton = {
  comment: 'add comment',
  color: '#00f600',
  offset: 0,
  iconName: 'circle',
  openDialog: true,
}

const buttons = computed(() => {
  if (buttonSetClone.value?.buttons)
    return [defButton, ...buttonSetClone.value.buttons]
  return [defButton]
})

const buttonForDialog = ref<ButtonSetButton | null>(null)

const sendJournalRecord = (button: ButtonSetButton) => {
  emit('newRecord', button)
}

const shortenString = (string: string, howShort: number) => {
  if (!string || string.length === 0) return null
  if (string.length <= howShort) return string

  return string.substring(0, howShort) + '...'
}

const addButton = () => {
  buttonForDialog.value = {
    comment: '',
    color: '#999999',
    offset: -0.3,
    iconName: 'circle',
    openDialog: false,
  }
}

const closeButtonDialog = () => (buttonForDialog.value = null)
const saveButton = (button: ButtonSetButton | null) => {
  if (!button) return
  if (!buttonSetClone.value) {
    buttonSetClone.value = emptyButtonSet
  }
  buttonSetClone.value?.buttons.push(JSON.parse(JSON.stringify(button)))
  emit('edited', buttonSetClone.value)

  closeButtonDialog()
}

const addNewButtonSet = () => {
  console.log('add new button set')
  selectedButtonSet.value = null
  Dialog.create({
    message: 'Enter buttonset name',
    prompt: { model: '', type: 'text' },
    cancel: 'Cancel',
  }).onOk((newButtonSetName: string) => {
    buttonSetClone.value = cloneDeep(emptyButtonSet)
    buttonSetClone.value.title = newButtonSetName
  })
}

const deleteButtonSet = () => emit('delete', props.buttonSetId)

const deleteButtonByIndex = (index: number) => {
  index >= 0
    ? (buttonSetClone.value?.buttons as ButtonSetButton[]).splice(index, 1)
    : 0
  emit('edited', buttonSetClone.value)
}

const deleteButton = (button: ButtonSetButton) => {
  const index = (buttonSetClone.value?.buttons as ButtonSetButton[]).findIndex(
    (x) => x === button,
  )
  index >= 0
    ? (buttonSetClone.value?.buttons as ButtonSetButton[]).splice(index, 1)
    : 0
  index >= 0 ? emit('edited', buttonSetClone.value) : 0
  closeButtonDialog()
}
</script>
<template>
  <div class="flex column full-width">
    <div class="flex justify-between row items-center q-py-xs">
      <div class="q-px-md">
        <q-select
          v-if="!isEditMode"
          standout
          dense
          style="min-width: 200px"
          v-model="selectedButtonSet"
          :options="buttonSetsOptions"
        />
        <q-input
          v-if="buttonSetClone && isEditMode"
          style="min-width: 200px"
          dense
          standout
          debounce="500"
          v-model="buttonSetClone.title"
        />
      </div>
      <div class="row no-wrap items-center">
        <div
          v-if="isEditMode"
          class="q-gutter-x-md"
        >
          <q-btn
            @click="addNewButtonSet"
            outline
            dense
            color="primary"
            icon="add"
            ><q-tooltip>Add new set</q-tooltip></q-btn
          >
          <q-btn
            v-if="buttonSetId"
            outline
            dense
            color="primary"
            @click="deleteButtonSet"
            icon="delete"
            ><q-tooltip>Delete set</q-tooltip></q-btn
          >
        </div>
        <q-toggle
          v-model="isEditMode"
          icon="edit"
        />
      </div>
    </div>
    <q-separator></q-separator>
    <div class="row q-gutter-md q-pa-sm">
      <q-btn
        v-for="(button, index) in buttons"
        :key="button.toString"
        no-caps
        @click="sendJournalRecord(button)"
        style="max-width: 220px"
        dense
      >
        <div
          v-if="!button.comment"
          class="row items-center no-wrap"
        >
          <q-icon
            size="2em"
            :name="button.iconName"
            :style="{ color: button.color }"
          />
        </div>
        <div
          v-if="button.comment"
          class="row items-center no-wrap"
        >
          <q-icon
            size="2em"
            :name="button.iconName"
            :style="{ color: button.color }"
          />

          <div class="text-center custom-button-text q-pa-sm ellipsis">
            <!-- {{ shortenString(button.comment, 20) }} -->
            {{ button.comment }}
            <q-tooltip>{{ button.comment }}</q-tooltip>
          </div>
        </div>
        <div
          class="col"
          v-if="isEditMode && index !== 0"
        >
          <q-icon
            name="delete"
            @click.stop="deleteButtonByIndex(index - 1)"
          />
        </div>
      </q-btn>
      <q-btn
        v-if="isEditMode"
        no-caps
        outline
        color="primary"
        @click="addButton"
      >
        <div class="row items-center no-wrap">
          <q-icon
            size="2em"
            left
            name="add"
          />
          <div class="text-center custom-button-text">Add button</div>
        </div>
      </q-btn>
    </div>
    <div class="row justify-end q-gutter-sm q-pa-sm"></div>
  </div>

  <button-dialog
    :button="buttonForDialog"
    @close-dialog="closeButtonDialog"
    @update-button="saveButton"
    @delete="deleteButton"
  ></button-dialog>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 200px
  max-height: 200px

.custom-button-text
  max-width: 150px
</style>
