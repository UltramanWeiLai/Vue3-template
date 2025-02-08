import { getApiRequest } from '@/utils'
import { IRes, IResList } from '@/types'

const request = getApiRequest()

interface ILoginParams {
  username: string
  password: string
}

export interface IUserInfo {
  id: number
  name?: string;
  email?: string;
  avatar?: string;
  username: string
  createTime: string
  updateTime: string
  status: number
  feishu?: string
  powers?: unknown[]
}

export interface ILoginRes {
  token: string
  userInfo: IUserInfo
}

export async function login(data: ILoginParams) {
  return request.post<IRes<ILoginRes>>('/api/user/login', data)
}

export async function logout() {
  return request.post<IRes>('/api/user/logout')
}

export async function register(data: ILoginParams) {
  return request.post<IRes>('/api/user/register', data)
}

export async function getUserInfo(id: number) {
  return request.get<IRes<IUserInfo>>(`/api/user/${id}`)
}

export async function updateUserInfo(id: number, data: any) {
  return request.patch<IRes>(`/api/user/${id}`, data)
}

export async function queryUsers() {
  return request.get<IRes<IResList<IUserInfo>>>('/api/user')
}

