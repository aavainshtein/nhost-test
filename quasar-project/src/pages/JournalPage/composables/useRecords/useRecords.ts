import { computed, Ref } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'

import {
  UseRecords_GetRecordsForJournalDocument,
  UseRecords_UpsertRecordDocument,
  UseRecords_DeleteRecordByIdDocument,
} from 'src/gql/types'
import { JournalRecord, RecordData } from './types'
import { type } from 'os'

export const useRecords = (journalId: Ref<string | null>) => {
  // watch(
  //   () => journalId,
  //   () => console.log('useRecords watcher', journalId),
  //   { immediate: true }
  // )
  // query
  const {
    result: recordsResult,
    onResult: onRecordsResult,
    refetch: recordsRefetch,
  } = useQuery(
    UseRecords_GetRecordsForJournalDocument,
    () => ({
      journal_id: journalId.value as string,
    }),
    () => ({ fetchPolicy: 'no-cache', enabled: !!journalId.value }),
  )

  const journalRecords = computed(() => recordsResult.value?.record ?? [])

  // upsert
  const { mutate: upsertRecord } = useMutation(UseRecords_UpsertRecordDocument)

  // delete

  const { mutate: deleteRecordById } = useMutation(
    UseRecords_DeleteRecordByIdDocument,
  )

  //   const saveJournalRecord = ()

  return {
    journalRecords,
    onRecordsResult,
    recordsRefetch,
    upsertRecord,
    deleteRecordById,
  }
}
