import { UseRecords_GetRecordsForJournalQuery } from 'src/gql/types'

export type JournalRecord =
  UseRecords_GetRecordsForJournalQuery['record'][number]

export type RecordData = JournalRecord['data']

// export interface JournalRecord extends JournalRecordFromQuery {
//   data: RecordData
// }
