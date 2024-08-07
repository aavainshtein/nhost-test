<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { LocalStorage, Dialog, is } from 'quasar'
import { useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'

import { nhost } from 'src/boot/nhost'
import { gql } from 'graphql-tag'

const props = defineProps({
  id: { type: String, required: true },
})

const { result, onResult, refetch } = useQuery(
  gql`
    query JournalPage_GetJournal($id: uuid!) {
      journal_by_pk(id: $id) {
        id
        title
        content
        created_at
        updated_at
        author_id
        journal_invitations {
          created_at
          email
          is_fulfilled
        }
        journal_invitations {
          created_at
          email
          is_fulfilled
        }
        journal_users {
          is_editor
          created_at
          user {
            email
          }
        }
        # comments_aggregate {
        #   aggregate {
        #     count
        #   }
        # }
      }
    }
  `,
  { id: props.id },
  { enabled: !!props.id, fetchPolicy: 'network-only' },
)

const journal = computed(() => result.value?.journal_by_pk ?? {})
</script>

<template>
  <q-page class="column col-grow full-width full-height">
    jouranl page
    <pre>
      {{ journal }}
    </pre>
  </q-page>
</template>

<style>
.container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  background-color: rgb(245, 245, 245);
}

.container-left {
  border-radius: 10px !important;
  width: 100%;
  margin-right: 0;
  background-color: rgb(245, 245, 245);
}

.video {
  background-color: white;
  border-radius: 10px !important;
}

.container-right {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-top: 10px;
  border-radius: 10px !important;
}

.buttons {
  display: flex;
  width: 100%;
  border-radius: 10px !important;
  background-color: white;
  margin-top: 10px;
}

.journal {
  display: flex;
  width: 100%;
  flex-grow: 1;
  border-radius: 10px !important;

  background-color: white;
}

.no-records {
  display: flex;
  width: 100% !important;
  height: 100% !important;
  align-self: center;
  align-items: center;
  justify-content: center;
  color: #dbdbdb;
}

@media screen and (min-width: 960px) {
  .container {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
  }

  .container-left {
    width: 65%;
    margin-right: 10px;
  }

  .video {
    border-radius: 10px !important;
  }

  .container-right {
    width: 33%;
    min-width: 400px;
    margin-top: 0;
    border-radius: 10px !important;
  }

  .buttons {
    margin-top: 10px;
    width: 100%;
    border-radius: 10px !important;
  }

  .journal {
    width: 100%;
    border-radius: 10px !important;
  }

  .border-radius-10 {
    border-radius: 10px !important;
  }
}
</style>
