import { useMutation, useQuery } from '@urql/vue';
import { GuestProfile, GuestUser } from '~/models/base';

export const useGraphql = () => {
  const usersQuery = () => useQuery<{ users: GuestUser[] }>({
    query: `
      query {
        users {
          is_guest
          user_name
          guest_profile {
            contact_info
            name
          }
          id
          state
        }
      }    
    `,
    
  })

  const userStateMutation = useMutation<{ state: string, updateUserStateId: string }>(`
      mutation ($state: String!, $updateUserStateId: String!) {
        updateUserState(state: $state, id: $updateUserStateId) {
          id
          state
          user_name
          is_guest
        }
      }  
    `
  )

  const userProfileMutation = useMutation<
    {
      "guestProfile": GuestProfile,
      "updateUserProfileId": string
    }>(`
  mutation UpdateUserProfile($guestProfile: GuestProfileInput!, $updateUserProfileId: String!) {
    updateUserProfile(guest_profile: $guestProfile, id: $updateUserProfileId) {
      id
      user_name
      is_guest
      guest_profile {
        name
        contact_info
      }
      state
    }
  }
`
    )


  const adduserMutation = useMutation<
    {userReq:{
      "password": string,
      "user_name": string,
      "is_guest": boolean
    }}>(

      `mutation UpdateUserProfile($userReq: NewUserRequest!) {
        addUser(userReq: $userReq) {
          id
          user_name
          is_guest
          guest_profile {
            name
            contact_info
          }
          state
        }
      }`
    )

  return {
    usersQuery, userStateMutation, userProfileMutation, adduserMutation
  }
}