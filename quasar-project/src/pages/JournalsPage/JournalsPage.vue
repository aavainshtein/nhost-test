<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { LocalStorage, Dialog, is } from 'quasar'
import { useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'

import { nhost } from 'src/boot/nhost'
import { gql } from 'graphql-tag'

// const journals = computed(
//   () => nhost.graphql.request(GET_JOURNALS_QUERY).data?.journal ?? [],
// )

const isAddDialogShown = ref(false)

type JournalModel = {
  title: string | null
  content: string | null
}

const newJournalModel = ref<JournalModel>({} as JournalModel)

const {
  result: journalsResult,
  refetch: journalsRefetch,
  loading,
  error,
} = useQuery(
  gql`
    query JournalsPage_GetJournals {
      journal {
        id
        title
        content
        created_at
        updated_at
        author_id
        # comments_aggregate {
        #   aggregate {
        #     count
        #   }
        # }
      }
    }
  `,
  {},
  { fetchPolicy: 'network-only' },
)

const journals = computed(
  () =>
    journalsResult.value?.journal.map((j) => ({
      id: j.id,
      created_at: j.created_at,
      updated_at: j.updated_at,
      title: j.title,
      content: j.content,
    })) ?? [],
)

type Journal = (typeof journals.value)[0]

const INSERT_JOURNAL_MUTATION = gql`
  mutation JournalsPage_InsertJournal($title: String!, $content: String!) {
    insert_journal_one(object: { title: $title, content: $content }) {
      id
    }
  }
`

const insertJournal = async () => {
  const title = newJournalModel.value.title
  const content = newJournalModel.value.content
  const { data } = await nhost.graphql.request(INSERT_JOURNAL_MUTATION, {
    title,
    content,
  })
  closeAddJournalDialog()
  journalsRefetch()
}

const router = useRouter()

// const currentUserId = authClient.getUser()?.id as string

// const journalIdForShareDialog = ref<Journal['id'] | null>(null)

// const { result, onResult, refetch } = useQuery(
//   JournalsPage_GetJournalsDocument,
//   {},
//   { fetchPolicy: 'no-cache' },
// )

// const myJournals = computed(
//   () =>
//     result.value?.journal.filter((x) => x.author_id === currentUserId) ?? [],
// )
// const sharedJournals = computed(
//   () =>
//     result.value?.journal.filter((x) => x.author_id !== currentUserId) ?? [],
// )

// const { mutate: deleteRecordsForJournalId } = useMutation(
//   JournalsPage_DeleteRecordsForJournalIdDocument,
// )
// const { mutate: deleteJournalById } = useMutation(
//   JournalsPage_DeleteJournalByIdDocument,
// )

// const { mutate: removeUser } = useMutation(
//   JournalsPage_RemoveUserFromJournalByPkDocument,
// )

const openJournal = (journal?: Journal) => {
  console.log(journal)
  if (!!journal) {
    router.push({
      name: 'journal-page-id',
      params: { id: journal.id },
    })
  }
  // if (!journal)
  //   router.push({
  //     name: 'journal-page-id',
  //     params: { id: 'new' },
  //   })
}

// const getImageUrl = (journal: Journal) =>
//   'https://i.ytimg.com/vi/' + journal.videoid + '/mqdefault.jpg'

// const deleteJournal = (journal: Journal) => {
//   if (currentUserId === journal.author_id) {
//     Dialog.create({
//       title: 'Delete Journal?',
//       message:
//         'Are you sure? You will lost ' +
//         journal.records_aggregate.aggregate?.count +
//         ' records.',
//       ok: 'Yes',
//       cancel: 'Cancel',
//     }).onOk(() => {
//       deleteRecordsForJournalId({ journal_id: journal.id }).then(() =>
//         deleteJournalById({ id: journal.id }).then(() => refetch()),
//       )
//     })
//   }
//   if (authClient.getUser()?.id !== journal.author_id) {
//     Dialog.create({
//       title: 'Delete Journal?',
//       message:
//         'Are you sure? You will lost access to this journal, but owner will still have journal',
//       ok: 'Yes',
//       cancel: 'Cancel',
//     }).onOk(() => {
//       removeUser({ user_id: currentUserId, journal_id: journal.id }).then(() =>
//         refetch(),
//       )
//     })
//   }
// }

// const closeShareDialog = () => (journalIdForShareDialog.value = null)

// const openShareDialog = (journal: Journal) => {
//   journalIdForShareDialog.value = journal.id
// }

function closeAddJournalDialog() {
  newJournalModel.value = {
    title: '',
    content: '',
  }
  isAddDialogShown.value = false
}
</script>
<template>
  <q-page class="flex column q-pa-md">
    <q-table
      :rows="journals"
      @row-click="(evt, row) => openJournal(row)"
    >
      <template #top>
        <div
          class="row justify-between items-center q-mb-md no-wrap full-width"
        >
          <div class="text-h5">Journals</div>
          <q-btn
            label="add"
            @click="isAddDialogShown = true"
          />
          <!-- <q-btn
          label="add"
          @click="isAddDialogShown = true"
        /> -->
        </div>
      </template>
    </q-table>
  </q-page>
  <q-dialog
    v-model="isAddDialogShown"
    @hide="closeAddJournalDialog"
  >
    <q-card
      style="width: 25rem"
      class="column"
    >
      <q-card-section class="column col-grow">
        <div class="row justify-between items-center q-mb-md no-wrap">
          <div class="text-h5">Create new journal</div>
          <q-btn
            icon="close"
            v-close-popup
          />
        </div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="newJournalModel.title"
          label="Title"
        />
        <q-input
          v-model="newJournalModel.content"
          type="textarea"
          lines="3"
          label="Content"
        />
      </q-card-section>
      <q-card-actions
        align="right"
        class="text-primary"
      >
        <q-btn
          label="Cancel"
          @click="closeAddJournalDialog"
        />
        <q-btn
          label="Add"
          @click="insertJournal"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="sass" scoped>
.my-card
  display: flex
  flex-direction: column
  width: 100%
  width: 300px
  height: 454px

.new-button
  cursor: pointer

.section-header
  color: #000000
  font-size: x-large
  padding: 20px 0 20px 24px
</style>
