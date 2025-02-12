import { getApiRequest } from '@/utils'
import { IRes, IResList, IPage } from '@/types'

const request = getApiRequest()

export interface IRoleInfo {
  id: number
  parentId?: number
  name: string
  description?: string
  userIds?: number[]
  powerIds?: number[]
  userGroupIds?: number[]
  state: number
  create?: string
  createTime?: string
  update?: string
  updateTime?: string
}

export interface IRoleParams {
  parentId?: number
  name: string
  description?: string
}

export interface IQueryRolesParams extends IPage {
  parentId?: number
  name?: string
}

// 创建角色
export async function createRole(params: IRoleParams) {
  return request.post<IRes>('/api/role', params)
}

// 更新角色
export async function updateRole(id: number, params: IRoleParams) {
  return request.patch<IRes>(`/api/role/${id}`, params)
}

// 删除角色
export async function deleteRole(id: number) {
  return request.delete<IRes>(`/api/role/${id}`)
}

// 获取角色列表
export async function queryRoles(params: IQueryRolesParams) {
  return request.get<IRes<IResList<IRoleInfo>>>('/api/role', { params })
}

// 获取角色详情
export async function getRoleInfo(id: number) {
  return request.get<IRes<IRoleInfo>>(`/api/role/${id}`)
}

// 启用角色
export async function enableRole(id: number) {
  return request.patch<IRes>(`/api/role/enable/${id}`)
}

// 禁用角色
export async function disableRole(id: number) {
  return request.patch<IRes>(`/api/role/disable/${id}`)
}

// 修改角色权限
export async function setRolePowers(id: number, power: number[]) {
  return request.patch<IRes>(`/api/role/power/${id}`, { power })
}

// 修改角色用户
export async function setRoleUsers(id: number, user: number[]) {
  return request.patch<IRes>(`/api/role/user/${id}`, { user })
}

// 修改角色用户组
export async function setRoleUserGroups(id: number, group: number[]) {
  return request.patch<IRes>(`/api/role/userGroup/${id}`, { group })
}
