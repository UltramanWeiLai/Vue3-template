import { getApiRequest } from '@/utils'
import { IRes, IResList, IPage } from '@/types'

const request = getApiRequest()

export enum PowerAction {
  Manage = 'manage',
  Create = 'create',
  View = 'view',
  Update = 'update',
  Delete = 'delete',
}

export interface IPowerInfo {
  id: number
  name: string
  action: PowerAction
  resourceKey: string
  description?: string
  state: number
  create?: string
  createTime?: string
  update?: string
  updateTime?: string
}

export interface IPowerParams {
  name: string
  action: PowerAction
  resourceKey: string
  description?: string
}

export interface IQueryPowersParams extends IPage {
  name?: string
}

// 创建权限
export async function createPower(params: IPowerParams) {
  return request.post<IRes>('/api/power', params)
}

// 更新权限
export async function updatePower(id: number, params: IPowerParams) {
  return request.patch<IRes>(`/api/power/${id}`, params)
}

// 删除权限
export async function deletePower(id: number) {
  return request.delete<IRes>(`/api/power/${id}`)
}

// 获取权限列表
export async function queryPowers(params: IQueryPowersParams) {
  return request.get<IRes<IResList<IPowerInfo>>>('/api/power', { params })
}

// 获取权限详情
export async function getPowerInfo(id: number) {
  return request.get<IRes<IPowerInfo>>(`/api/power/${id}`)
}

// 启用权限
export async function enablePower(id: number) {
  return request.patch<IRes>(`/api/power/enable/${id}`)
}

// 禁用权限
export async function disablePower(id: number) {
  return request.patch<IRes>(`/api/power/disable/${id}`)
}
