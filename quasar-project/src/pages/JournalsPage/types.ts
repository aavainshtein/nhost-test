import { JournalsPage_GetJournalsQuery } from 'src/gql/types'

export type Journal = JournalsPage_GetJournalsQuery['journal'][0]
