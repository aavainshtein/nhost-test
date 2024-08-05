<script setup lang="ts">
import { ref } from "vue";
import { useSignInEmailPasswordless } from "@nhost/vue";

const email = ref("");

const loading = ref(false);

const { signInEmailPasswordless, error } = useSignInEmailPasswordless();

const handleSignIn = async () => {
  loading.value = true;
  const { error } = await signInEmailPasswordless(email.value);
  if (error) {
    console.error({ error });
    loading.value = false;
    return;
  }
  loading.value = false;
  alert("Magic Link Sent!");
};
</script>

<template>
  <div class="column items-center">
    <h1>Test Project</h1>
    <p>powered by Nhost and Vue</p>
    <form
      class="q-gutter-y-sm column items center"
      @submit.prevent="handleSignIn"
    >
      <div>
        <input type="email" placeholder="Your email" v-model="email" required />
      </div>

      <button :disabled="loading">
        <span v-if="loading">Loading</span>
        <span v-else>Send me a Magic Link!</span>
      </button>

      <p v-if="error">{{ error.message }}</p>
    </form>
  </div>
</template>
