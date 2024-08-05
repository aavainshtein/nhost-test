<script setup lang="ts">
import { watch, ref } from 'vue'

const props = defineProps<{
  sourceLink: string | null
  modelValue: object | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: object | null): void
  // (e: 'newRecord', value: JournalRecord): void
}>()

watch(
  () => props.sourceLink,
  () => {
    console.log('prop changed')
    console.log('prop', props.sourceLink)

    if (!props.sourceLink) {
      ytRemove()
    }
    if (props.sourceLink?.length) ytInit()
    console.log('player inside player component', globalPlayer.value)

    emit('update:modelValue', globalPlayer.value)
  },
)

const globalPlayer = ref<object | null>(null)

watch(
  () => globalPlayer.value,
  () => emit('update:modelValue', globalPlayer.value),
)

const ytRemove = () => {
  console.log('ytRemove func')
  globalPlayer.value.destroy()
}

const ytInit = () => {
  console.log('init func')

  function loadPlayer() {
    if (typeof YT != 'undefined') {
      onYouTubePlayer()
    }
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      var tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      var firstScriptTag = document.getElementsByTagName('script')[0]
      console.log('tag: ', tag)
      console.log('firstScriptTag: ', firstScriptTag)

      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubePlayerAPIReady = function () {
        onYouTubePlayer()
      }
    }
  }

  function onYouTubePlayer() {
    var player = new YT.Player('ytplayer', {
      height: '360',
      width: '640',
      videoId: props.sourceLink,
      events: {
        onReady: onPlayerReady,
      },
    })
    globalPlayer.value = player
  }

  function onPlayerReady(event) {
    event.target.playVideo()
  }

  loadPlayer()
}
</script>

<template>
  <div class="q-pa-md">
    <div id="ytplayer"></div>
  </div>
</template>
