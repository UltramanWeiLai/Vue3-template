

class DataCache {
  private static instance: DataCache
  private cache: Map<string, any>
  private store: Storage
  private constructor() {
    this.cache = new Map()
    this.store = window.localStorage
  }
  public static getInstance(): DataCache {
    if (!this.instance) this.instance = new DataCache()
    return this.instance
  }
  public set(key: string, value: any) {
    this.cache.set(key, value)
    this.store.setItem(key, JSON.stringify(value))
  }
  public get(key: string) {
    const val = this.cache.get(key) || this.store.getItem(key)
    if (val && typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch (error) {}
    }
    return val
  }
  public delete(key: string) {
    this.cache.delete(key)
    this.store.removeItem(key)
  }
  public clear() {
    this.cache.clear()
    this.store.clear()
  }
}

export function getDataCache() {
  return DataCache.getInstance()
}
