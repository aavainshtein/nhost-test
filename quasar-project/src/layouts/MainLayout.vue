<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useNhostClient } from "@nhost/vue";
import { nhost } from "src/boot/nhost";

const router = useRouter();
console.log("mainl");

const leftDrawerOpen = ref(false);

// const user = authClient.getUser();

// const nhostClient = useNhostClient();
const authClient = nhost.auth;
const user = authClient.getUser();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const signOut = () => {
  // authClient.signOut();
  router.push({ name: "sign-up" });
};
</script>

<template>
  <q-layout view="hhh lpR fFf">
    <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Nhostest </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered
      ><div class="column flex full-height q-pa-md">
        <q-list>
          <q-item clicable v-ripple :to="{ name: 'journals-page' }"
            >Journals</q-item
          >
          <q-separator spaced inset />
          <q-item clicable v-ripple :to="{ name: 'profile-page' }">
            <q-item-section> Profile </q-item-section>
          </q-item>
          <q-separator spaced inset />
          <q-item
            clicable
            v-ripple
            :to="{
              name: 'user-public-page',
              params: { nickname: user?.metadata.nickname },
            }"
            >Public page</q-item
          >
        </q-list>
        <q-space />
        <q-btn
          v-if="authClient.isAuthenticated()"
          unelevated
          color="negative"
          style="height: 48px"
          @click="signOut"
          label="Sign Out"
        />
      </div>

      <!-- drawer content -->
    </q-drawer>

    <q-page-container class="flex flex-center" style="background: white">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
