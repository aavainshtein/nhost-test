import { ref, watch, watchEffect, computed, Ref } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'

import {
  UseButtonSets_GetButtonSetByIdDocument,
  UseButtonSets_GetUserButtonSetsDocument,
  UseButtonSets_UpsertButtonSetDocument,
  UseButtonSets_DeleteButtonSetByIdDocument,
} from 'src/gql/types'
// import { ButtonSet } from './types'

export const useButtonSets = (buttonSetId: Ref<string | null>) => {
  const { result: buttonSetsResult, refetch: buttonSetsRefetch } = useQuery(
    UseButtonSets_GetUserButtonSetsDocument,
  )

  const { result: buttonSetByIdResult, refetch: buttonSetByIdRefetch } =
    useQuery(UseButtonSets_GetButtonSetByIdDocument, () => ({
      id: buttonSetId.value as string,
    }))

  const buttonSets = computed(() => buttonSetsResult.value?.buttonset ?? [])

  const { mutate: upsertButtonSet } = useMutation(
    UseButtonSets_UpsertButtonSetDocument,
  )

  const { mutate: deleteButtonSetById } = useMutation(
    UseButtonSets_DeleteButtonSetByIdDocument,
  )
  return {
    buttonSetsResult,
    buttonSetsRefetch,
    buttonSets,

    buttonSetByIdResult,
    buttonSetByIdRefetch,
    upsertButtonSet,
    deleteButtonSetById,
  }
}
