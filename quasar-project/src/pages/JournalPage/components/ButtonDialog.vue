<script setup lang="ts">
import { watch, ref } from 'vue'
import { cloneDeep } from 'lodash'
import { ButtonSetButton } from '../composables/useButtonSets/types'
// import { ButtonSetButton } from 'src/composables/useJournalStorage/types'

const props = defineProps<{
  button: ButtonSetButton | null
}>()
const icon = ref({ name: 'circle', color: '#000000' })

const emit = defineEmits<{
  (e: 'updateButton', value: ButtonSetButton | null): void
  (e: 'close-dialog'): void
  (e: 'deleteButton', value: ButtonSetButton): void
}>()

const clonedButton = ref<ButtonSetButton | null>(null)

watch(
  () => props.button,
  () => (clonedButton.value = cloneDeep(props.button)),
)

const closeDialog = () => {
  emit('close-dialog')
}

const updateButton = () => {
  emit('updateButton', clonedButton.value)
}

const deleteButton = () => emit('deleteButton', props.button)
</script>

<template>
  <q-dialog :model-value="!!clonedButton">
    <q-card
      v-if="clonedButton"
      style="width: 700px; max-width: 80vw"
    >
      <q-card-section>
        <div class="row justify-between">
          <div class="text-h6">Set new button</div>
          <!-- <q-icon
            name="delete"
            size="2em"
            @click="deleteButton"
          /> -->
        </div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-btn
          icon="colorize"
          :style="{ backgroundColor: clonedButton.color }"
          ><q-popup-proxy
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-color v-model="clonedButton.color" /> </q-popup-proxy
        ></q-btn>

        <q-toggle
          v-model="clonedButton.openDialog"
          icon="open_in_new"
          label="Pop up dialog on click"
        />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row no-wrap items-center q-gutter-md">
          <q-icon
            :name="clonedButton.iconName"
            :style="{ color: clonedButton.color }"
            size="3em"
          ></q-icon>
          <div class="col col-grow">
            <q-input
              label="Comment"
              autofocus
              v-model.trim="clonedButton.comment"
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
          @click="updateButton"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style lang="sass" scoped></style>
