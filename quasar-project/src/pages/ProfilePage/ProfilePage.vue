<script setup lang="ts">
import { ref, computed } from 'vue'
import { nhost } from 'src/boot/nhost'
// import { authClient } from 'src/auth/authClient'

const authClient = nhost.auth

// console.log("user", authClient.getUser());
const user = authClient.getUser()
const isPwd = ref(true)
const password = ref('')
const newPasswordInputRef = ref(null)
const nickname = ref<string | null>(null)
</script>

<template>
  <q-page class="column">
    <!-- <q-card
      class="column col-grow"
      style="width: min-content; min-width: 640px"
    > -->
    <q-card-section
      >Profile
      <q-avatar>
        <img :src="user?.avatarUrl" />
      </q-avatar>
    </q-card-section>
    <pre>{{ user }}</pre>
    <q-card-section>email: {{ user?.email }}</q-card-section>
    <!-- <q-card-section
        >public user nickname: {{ user?.metadata.nickname }}</q-card-section
      > -->
    <q-card-section v-if="user?.passwordHash">
      <q-input
        ref="newPasswordInputRef"
        v-model="password"
        filled
        :type="isPwd ? 'password' : 'text'"
        hint="Password"
        :rules="[
          (val) => val.length >= 6 || 'Please use minimum 6 characters',
          (val) => val.length >= 5 || 'Please use minimum 5 characters',
        ]"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <q-btn label="change password" />
    </q-card-section>
    <q-space />
    <q-card-section>
      <q-btn
        label="delete account"
        color="negative"
      ></q-btn
    ></q-card-section>
    <!-- </q-card> -->
  </q-page>
</template>
