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

const isAddInvitationDialogShown = ref(false)

const journalComments = [
  { id: 1, content: 'comment 1' },
  { id: 2, content: 'comment 2' },
]

const newJournalCommentModel = ref<{ content: string }>(
  {} as {
    content: string
  },
)

const newInvitationModel = ref<{ email: string }>(
  {} as {
    email: string
  },
)

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

const journalData = computed(() => result.value?.journal_by_pk ?? {})

const journalUsers = computed(
  () => journalData.value.journal_users?.map((x) => x.user.email) ?? [],
)
const journalInvitations = computed(
  () => journalData.value.journal_invitations?.map((x) => x.email) ?? [],
)

function closeAddInvitationDialog() {
  isAddInvitationDialogShown.value = false
  newInvitationModel.value = {} as {
    email: string
  }
}

function insertInvitation() {
  const email = newInvitationModel.value.email
  // const { data } = nhost.graphql.request(
  //   INSERT_JOURNAL_INVITATION_MUTATION,
  //   {
  //     journal_id: props.id,
  //     email,
  //   },
  // )
  closeAddInvitationDialog()
  refetch()
}

function insertJournalComment() {
  const content = newJournalCommentModel.value.content
  // const { data } = nhost.graphql.request(
  //   INSERT_JOURNAL_COMMENT_MUTATION,
  //   {
  //     journal_id: props.id,
  //     content,
  //   },
  // )
  // newJournalCommentModel.value = {} as {
  //   content: string
  // }
  refetch()
}
</script>

<template>
  <q-page class="column col-grow full-width full-height">
    <q-card class="full-width col-grow q-pa-md">
      <q-card-section>
        <div>
          {{ journalData.title }}
        </div>
        <div>
          {{ journalData.content }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-table :rows="journalInvitations">
          <template #top>
            <div
              class="row justify-between items-center q-mb-md no-wrap full-width"
            >
              <div class="text-h5">Invitations</div>
              <q-btn
                label="add"
                @click="isAddInvitationDialogShown = true"
              />
              <!-- <q-btn
          label="add"
          @click="isAddDialogShown = true"
        /> -->
            </div>
          </template>
        </q-table>
      </q-card-section>
      <q-card-section>
        <q-item>
          <q-item-section>
            <q-input
              v-model="newJournalCommentModel.content"
              type="textarea"
              label="comment"
            />
          </q-item-section>
          <q-item-section-side> avatar </q-item-section-side>
        </q-item>
        <q-list>
          <q-item
            v-for="comment in journalComments"
            :key="id"
          >
            <q-item-section>
              <q-item-label>
                {{ comment.content }}
              </q-item-label>
            </q-item-section>
            <q-item-section-side> aaaaa </q-item-section-side>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>

  <q-dialog
    v-model="isAddInvitationDialogShown"
    @hide="closeAddInvitationDialog"
  >
    <q-card
      style="width: 25rem"
      class="column"
    >
      <q-card-section class="column col-grow">
        <div class="row justify-between items-center q-mb-md no-wrap">
          <div class="text-h5">Invite person by email</div>
          <q-btn
            icon="close"
            v-close-popup
          />
        </div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="newInvitationModel.email"
          label="Email"
        />
      </q-card-section>
      <q-card-actions
        align="right"
        class="text-primary"
      >
        <q-btn
          label="Cancel"
          @click="closeAddInvitationDialog"
        />
        <q-btn
          label="Invite"
          @click="insertInvitation"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
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
