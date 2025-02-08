export interface IRes<T = null> {
  data: T
  code: number
  msg: string
  success: boolean
}

export interface IResList<T = []> {
  currPage: number
  pageSize: number
  total: number
  data: T[]
}
