<script setup lang="ts">
import { ref } from "vue";
import EssentialLink, {
  EssentialLinkProps,
} from "components/EssentialLink.vue";
import { useRouter } from "vue-router";

console.log("signl");
</script>

<template>
  <q-layout view="hhh lpR fFf">
    <q-page-container
      class="flex flex-center"
      style="background: radial-gradient(circle, #35a2ff 0%, #ff1a00 100%)"
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>
