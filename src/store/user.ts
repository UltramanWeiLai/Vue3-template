import { IUserInfo } from '@/api'
import { defineStore } from 'pinia'
import { getDataCache, TOKEN_KEY, USER_INFO_KEY } from '@/utils'

const cache = getDataCache()

interface IUserState {
  token?: string
  userInfo?: IUserInfo
}

export const useUserStore = defineStore('user', {
  state: (): IUserState => ({
    userInfo: cache.get(USER_INFO_KEY),
    token: cache.get(TOKEN_KEY),
  }),
  getters: {
    isLoggedIn: state => !!state.token,
  },
  actions: {
    setUserInfo(userInfo: IUserInfo) {
      this.userInfo = userInfo
      cache.set(USER_INFO_KEY, userInfo)
    },
    setToken(token: string) {
      this.token = token
      cache.set(TOKEN_KEY, token)
    },
    logout() {
      this.userInfo = undefined
      this.token = undefined
      cache.delete(USER_INFO_KEY)
      cache.delete(TOKEN_KEY)
    },
  },
})
