import { PublicJournalsPage_GetJournalsQuery } from 'src/gql/types'

export type Journal = PublicJournalsPage_GetJournalsQuery['journal'][number]
