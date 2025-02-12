import axios from 'axios'
import { useUserStore } from '@/store/user'
import { BASE_URL } from '@/utils'
import { message } from 'ant-design-vue'

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { IRes } from '@/types'
import router from '@/router'

const request: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000
})

request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) config.headers['Token'] = `Bearer ${userStore.token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data as unknown as IRes

    if (res.code >= 400) {
      message.error(res.msg || '服务器繁忙，请稍后重试！')
      if (res.code === 401) {
        const userStore = useUserStore()
        userStore.logout()
        router.push('/login')
      }
      return Promise.reject(res)
    }
    return response.data
  },
  (error) => {
    const res = error.response?.data as unknown as IRes || { msg: error.message || '服务器繁忙，请稍后重试！' }
    message.error(res.msg)
    return Promise.reject(res)
  }
)

class ApiRequest {
  private static instance: ApiRequest
  constructor(private request: AxiosInstance) {}

  public static getInstance(request: AxiosInstance): ApiRequest {
    if (!this.instance) this.instance = new ApiRequest(request)
    return this.instance
  }

  get<T>(url: string, config?: AxiosRequestConfig){
    return this.request.get<T>(url, config) as unknown as Promise<T>
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig){
    return this.request.post<T>(url, data, config) as unknown as Promise<T>
  }

  patch<T>(url: string, data?: any, config?: AxiosRequestConfig){
    return this.request.patch<T>(url, data, config) as unknown as Promise<T>
  }

  delete<T>(url: string, config?: AxiosRequestConfig){
    return this.request.delete<T>(url, config) as unknown as Promise<T>
  }
}

function getApiRequest() {
  return ApiRequest.getInstance(request)
}

export { request, getApiRequest }
