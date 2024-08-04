<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
import { PlayerSize } from '../types'
import YouTube from 'vue3-youtube'

const props = defineProps<{
  sourceLink: string | null
  modelValue: object | null
  playerSize: PlayerSize
  videoSize: { width: number; height: number }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: object | null): void
}>()

const globalPlayer = ref<typeof YouTube | null>(null)

const playerDemissions = ref({ width: 640, height: 320 })

watch(
  () => props.videoSize,
  () => {
    playerDemissions.value.height = props.videoSize.height
    playerDemissions.value.width = props.videoSize.width

    // console.log('pd', playerDemissions)
    if (document.querySelector('iframe')) {
      document.querySelector('iframe').style.width = '100%'
      document.querySelector('iframe').style.height = '100%'
      emit('update:modelValue', globalPlayer.value)
    }

    // globalPlayer.value?.setSize(playerDemissions.value)
  },
)

// watch(
//   () => props.playerSize,
//   () => {
//     if (props.playerSize === 'sm') {
//       playerDemissions.value.height = 320
//       playerDemissions.value.width = 640
//     }
//     if (props.playerSize === 'md') {
//       playerDemissions.value.height = 600
//       playerDemissions.value.width = 1000
//     }
//     console.log('pd', playerDemissions)
//     document.querySelector('iframe').style.width = '100%'
//     document.querySelector('iframe').style.height = '100%'

//     // globalPlayer.value?.setSize(playerDemissions.value)
//   }
// )

watch(
  () => globalPlayer.value,
  () => {
    emit('update:modelValue', globalPlayer.value)
  },
)

// onMounted(() => (document.querySelector('iframe').style.width = '100%'))
</script>

<template>
  <YouTube
    v-if="sourceLink"
    :src="props.sourceLink"
    :height="playerDemissions.height"
    :width="playerDemissions.width"
    ref="globalPlayer"
  />
</template>
