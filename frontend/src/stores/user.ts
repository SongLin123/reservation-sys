import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {RESTManager} from '~/utils'
import type {UserModel} from '../models/user'
import {getToken, removeToken, setToken} from '../utils/auth'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserModel | null>(null)
  const token = ref<string>('')
  const router = useRouter()


  const $token = getToken()
  if ($token) {
    token.value = $token
  }

  return {
    user,
    token,

    async fetchUser() {

      try {


        user.value = await RESTManager.api.whoAmI.get<UserModel>();
      }
      catch {
        user.value = null

      }
    },

    updateToken($token: string) {
      setToken($token, 7)

      token.value = $token
    },


    logoutUser() {
      user.value = null;
      token.value = '';
      removeToken()

      router.replace({
        path: "/login"
      })

    }
  }
})
