<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { LocalStorage, Dialog } from 'quasar'
import { useRouter } from 'vue-router'

// const router = useRouter()

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

// const openJournal = (journal?: Journal) => {
//   if (!!journal) {
//     router.push({
//       name: 'journal-page-id',
//       params: { id: journal.id },
//     })
//   }
//   if (!journal)
//     router.push({
//       name: 'journal-page-id',
//       params: { id: 'new' },
//     })
// }

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
</script>
<template>
  <q-page class="flex column">
    <div class="section-header">My Journals</div>
  </q-page>
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
