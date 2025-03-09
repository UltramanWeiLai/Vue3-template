import { getApiRequest } from '@/utils'
import type { IRes, IResList, IPage } from '@/types'
import type { IUserGroupInfo, IRoleInfo } from '../index'

const request = getApiRequest()

interface ILoginParams {
  username: string
  password: string
}

export interface IUserInfo {
  id: number
  name?: string
  email?: string
  phone?: string
  avatar?: string
  username: string
  state: number
  feishu?: string
  roles?: IRoleInfo[]
  powers?: unknown[]
  groups?: IUserGroupInfo[]
  userRoleIds?: number[]
  userGroupRoleIds?: number[]
  create?: string
  createTime?: string
  update?: string
  updateTime?: string
}

export interface ILoginRes {
  token: string
  userInfo: IUserInfo
}

export async function login(params: ILoginParams) {
  return request.post<IRes<ILoginRes>>('/api/user/login', params)
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

export interface IUpdateUserParams {
  name?: string
  email?: string
  phone?: string
  avatar?: string
}

export async function updateUser(id: number, params: IUpdateUserParams) {
  return request.patch<IRes>(`/api/user/${id}`, params)
}

export async function updatePassword(id: number, params: ILoginParams) {
  return request.patch<IRes>(`/api/user/password/${id}`, params)
}

export async function enableUser(id: number) {
  return request.patch<IRes>(`/api/user/enable/${id}`)
}

export async function disableUser(id: number) {
  return request.patch<IRes>(`/api/user/disable/${id}`)
}

export async function setUserRoles(id: number, role: number[]) {
  return request.patch<IRes>(`/api/user/role/${id}`, { role })
}

export async function setUserGroups(id: number, group: number[]) {
  return request.patch<IRes>(`/api/user/group/${id}`, { group })
}

export async function deleteUser(id: number) {
  return request.delete<IRes>(`/api/user/${id}`)
}

export interface IQueryUsersParams extends IPage {
  username?: string
  name?: string
}

export async function queryUsers(params: IQueryUsersParams) {
  return request.get<IRes<IResList<IUserInfo>>>('/api/user', { params })
}
