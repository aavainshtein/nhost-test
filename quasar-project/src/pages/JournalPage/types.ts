import {
  JournalPage_GetJournalByIdQuery,
  Journal_Insert_Input,
  Record_Arr_Rel_Insert_Input,
} from 'src/gql/types'

export type JournalWithData = JournalPage_GetJournalByIdQuery['journal_by_pk']

export type PlayerSize = 'sm' | 'md' | 'lg'

// export interface LogButton {
//   comment: string
//   color?: string
//   iconName?: string
//   offset?: number
//   image?: string
//   openDialog?: boolean
// }
