import { getApiRequest } from '@/utils'
import { IRes, IResList, IPage } from '@/types'

const request = getApiRequest()

export interface IResourceInfo {
  id: number
  name: string
  key: string
  description?: string
  state: number
  create?: string
  createTime?: string
  update?: string
  updateTime?: string
}

export interface IResourceParams {
  name: string
  key: string
  description?: string
}

export interface IQueryResourcesParams extends IPage {
  name?: string
  key?: string
}

// 创建资源
export async function createResource(params: IResourceParams) {
  return request.post<IRes>('/api/resource', params)
}

// 更新资源
export async function updateResource(id: number, params: IResourceParams) {
  return request.patch<IRes>(`/api/resource/${id}`, params)
}

// 删除资源
export async function deleteResource(id: number) {
  return request.delete<IRes>(`/api/resource/${id}`)
}

// 获取资源列表
export async function queryResources(params: IQueryResourcesParams) {
  return request.get<IRes<IResList<IResourceInfo>>>('/api/resource', { params })
}

// 获取资源详情
export async function getResourceInfo(id: number) {
  return request.get<IRes<IResourceInfo>>(`/api/resource/${id}`)
}

// 启用资源
export async function enableResource(id: number) {
  return request.patch<IRes>(`/api/resource/enable/${id}`)
}

// 禁用资源
export async function disableResource(id: number) {
  return request.patch<IRes>(`/api/resource/disable/${id}`)
}
