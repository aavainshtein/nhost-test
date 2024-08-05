<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Todo, Meta } from "components/models";
import ExampleComponent from "components/ExampleComponent.vue";
import { useNhostClient } from "@nhost/vue";

import SignIn from "src/pages/SignIn/SignIn.vue";

defineOptions({
  name: "IndexPage",
});

const nhostClient = useNhostClient();
console.log({ nhostClient });
console.log("after  s client s");

const session = ref<any>(null);
const { nhost } = useNhostClient();

onMounted(() => {
  session.value = nhost.auth.getSession();
  nhost.auth.onAuthStateChanged((_, newSession) => {
    session.value = newSession;
  });
});

const todos = ref<Todo[]>([
  {
    id: 1,
    content: "ct1",
  },
  {
    id: 2,
    content: "ct2",
  },
  {
    id: 3,
    content: "ct3",
  },
  {
    id: 4,
    content: "ct4",
  },
  {
    id: 5,
    content: "ct5",
  },
]);

const meta = ref<Meta>({
  totalCount: 1200,
});
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>
    <SignIn v-if="!session" />
  </q-page>
</template>
