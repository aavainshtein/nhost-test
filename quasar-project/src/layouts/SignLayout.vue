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
    <q-page-container class="flex flex-center full-height">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
