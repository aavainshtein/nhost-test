<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { LocalStorage, Dialog } from 'quasar'
import { useRouter } from 'vue-router'

import { authClient } from 'src/auth/authClient'
import JournalCard from 'src/components/JournalCard/JournalCard.vue'
import ShareJournalDialog from 'src/components/ShareJournalDialog/ShareJournalDialog.vue'

import { PublicJournalsPage_GetJournalsDocument } from 'src/gql/types'

import { useQuery, useMutation } from '@vue/apollo-composable'
import { Journal } from './types'
import { stringLiteral } from '@babel/types'

const props = defineProps({
  nickname: { type: String, required: true },
})

console.log('publick page, string for query:', props.nickname)

const router = useRouter()

const currentUserId = authClient.getUser()?.id as string

// const journalIdForShareDialog = ref<Journal['id'] | null>(null)

const { result, onResult, refetch } = useQuery(
  PublicJournalsPage_GetJournalsDocument,
  () => ({ nickname_value: { nickname: props.nickname } }),
  { fetchPolicy: 'no-cache' },
)

const journals = computed(() => result.value?.journal ?? [])
// const sharedJournals = computed(
//   () => result.value?.journal.filter((x) => x.author_id !== currentUserId) ?? []
// )

// const { mutate: deleteRecordsForJournalId } = useMutation(
//   JournalsPage_DeleteRecordsForJournalIdDocument
// )
// const { mutate: deleteJournalById } = useMutation(
//   JournalsPage_DeleteJournalByIdDocument
// )

// const { mutate: removeUser } = useMutation(
//   JournalsPage_RemoveUserFromJournalByPkDocument
// )

const openJournal = (journal?: Journal) => {
  if (!!journal) {
    router.push({
      name: 'journal-page-id',
      params: { id: journal.id },
    })
  }
  if (!journal)
    router.push({
      name: 'journal-page-id',
      params: { id: 'new' },
    })
}

const getImageUrl = (journal: Journal) =>
  'https://i.ytimg.com/vi/' + journal.videoid + '/mqdefault.jpg'

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
//         deleteJournalById({ id: journal.id }).then(() => refetch())
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
//         refetch()
//       )
//     })
//   }
// }

// const closeShareDialog = () => (journalIdForShareDialog.value = null)

// const openShareDialog = (journal: Journal) => {
//   journalIdForShareDialog.value = journal.id
// }
</script>
<template>
  <q-page class="flex column">
    <div class="section-header">{{ nickname }} Journals</div>
    <div class="flex q-gutter-lg q-pa-lg row justify-center">
      <div v-if="!journals.length > 0">No public journals</div>
      <journal-card
        v-for="journal in journals"
        :journal="journal"
        :on-public-page="true"
        :key="journal.id"
        @open-journal="openJournal"
      />
    </div>
  </q-page>
  <!-- <share-journal-dialog
    :journalId="journalIdForShareDialog"
    @close-dialog="closeShareDialog"
    @hide="closeShareDialog"
  /> -->
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
  color: #ffffff
  font-size: x-large
  padding: 20px 0 20px 24px
</style>
