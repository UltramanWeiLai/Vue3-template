import { getApiRequest } from '@/utils'
import { IRes, IResList, IPage } from '@/types'

const request = getApiRequest()

export interface IUserGroupInfo {
  id: number
  name: string
  description?: string
  role?: number[]
  user?: number[]
  state: number
  create?: string
  createTime?: string
  update?: string
  updateTime?: string
}

export interface IUserGroupParams {
  name: string
  description?: string
}

export interface IQueryUserGroupsParams extends IPage {
  name?: string
  userId?: number
}

// 创建用户组
export async function createUserGroup(params: IUserGroupParams) {
  return request.post<IRes>('/api/user-group', params)
}

// 更新用户组
export async function updateUserGroup(id: number, params: IUserGroupParams) {
  return request.patch<IRes>(`/api/user-group/${id}`, params)
}

// 删除用户组
export async function deleteUserGroup(id: number) {
  return request.delete<IRes>(`/api/user-group/${id}`)
}

// 获取用户组列表
export async function queryUserGroups(params: IQueryUserGroupsParams) {
  return request.get<IRes<IResList<IUserGroupInfo>>>('/api/user-group', { params })
}

// 获取用户组详情
export async function getUserGroupInfo(id: number) {
  return request.get<IRes<IUserGroupInfo>>(`/api/user-group/${id}`)
}

// 启用用户组
export async function enableUserGroup(id: number) {
  return request.patch<IRes>(`/api/user-group/enable/${id}`)
}

// 禁用用户组
export async function disableUserGroup(id: number) {
  return request.patch<IRes>(`/api/user-group/disable/${id}`)
}

// 分配用户
export async function assignUsers(id: number, user: number[]) {
  return request.patch<IRes>(`/api/user-group/user/${id}`, { user })
}

// 分配角色
export async function assignRoles(id: number, role: number[]) {
  return request.patch<IRes>(`/api/user-group/role/${id}`, { role })
}
