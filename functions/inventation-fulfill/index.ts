// import { gql } from 'graphql-request';
// import { nhost } from 'nhost-js-sdk';

export default async function handler(req, res) {
  const { event } = req.body;

  console.log("event", event);
  // Получаем email и ID нового пользователя
  //   const email = event.data.new.email;
  //   const userId = event.data.new.id;

  //   console.log({ email, userId });

  //   // Шаг 1: Проверяем, существует ли приглашение для этого email
  //   const INVITATION_QUERY = gql`
  //     query ($email: String!) {
  //       journal_invitation(where: { email: { _eq: $email }, is_fulfilled: { _eq: false } }) {
  //         id
  //         journal_id
  //       }
  //     }
  //   `;

  //   const response = await nhost.graphql.request(INVITATION_QUERY, { email });

  //   if (response.data.journal_invitation.length > 0) {
  //     // Шаг 2: Добавляем пользователя в journal_user
  //     const journalId = response.data.journal_invitation[0].journal_id;

  //     const INSERT_USER_MUTATION = gql`
  //       mutation ($journal_id: uuid!, $user_id: uuid!) {
  //         insert_journal_user_one(object: { journal_id: $journal_id, user_id: $user_id, is_editor: false }) {
  //           id
  //         }
  //       }
  //     `;

  //     await nhost.graphql.request(INSERT_USER_MUTATION, { journal_id: journalId, user_id: userId });

  //     // Шаг 3: Обновляем статус приглашения
  //     const INVITATION_UPDATE_MUTATION = gql`
  //       mutation ($id: uuid!) {
  //         update_journal_invitation_by_pk(pk_columns: { id: $id }, _set: { is_fulfilled: true }) {
  //           id
  //         }
  //       }
  //     `;

  //     await nhost.graphql.request(INVITATION_UPDATE_MUTATION, { id: response.data.journal_invitation[0].id });
  //   }

  res
    .status(200)
    .json({ message: "User processed successfully", event: event });
}
