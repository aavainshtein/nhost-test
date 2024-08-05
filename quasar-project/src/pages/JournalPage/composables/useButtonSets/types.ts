import { UseButtonSets_GetUserButtonSetsQuery } from 'src/gql/types'

export type ButtonSet =
  UseButtonSets_GetUserButtonSetsQuery['buttonset'][number]

export type ButtonSetButton = ButtonSet['buttons'][number]
