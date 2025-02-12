import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('../layout/index.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        meta: { title: '首页' },
        component: () => import('../views/home/index.vue')
      },
      {
        path: 'user',
        name: 'User',
        meta: { title: '用户管理' },
        component: () => import('../views/user/index.vue')
      },
      {
        path: 'user-group',
        name: 'UserGroup',
        meta: { title: '用户组管理' },
        component: () => import('../views/user-group/index.vue')
      },
      {
        path: 'role',
        name: 'Role',
        meta: { title: '角色管理' },
        component: () => import('../views/role/index.vue')
      },
      {
        path: 'power',
        name: 'Power',
        meta: { title: '权限管理' },
        component: () => import('../views/power/index.vue')
      },
      {
        path:'resource',
        name: 'Resource',
        meta: { title: '资源管理' },
        component: () => import('../views/resource/index.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
const whiteList = ['/login']
router.beforeEach((
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const userStore = useUserStore()
  if (!userStore.token && !whiteList.includes(to.path)) return next('/login')
  if (userStore.token && to.path === '/login') return next('/')
  if (to.meta.title) document.title = to.meta.title as string

  // 记录访问历史
  if (userStore.token && to.name && !whiteList.includes(to.path)) {
    const history = localStorage.getItem('visitHistory')
    const visitHistory = history ? JSON.parse(history) : []
    
    const timestamp = Date.now()
    const newRecord = { path: to.path, title: to.meta.title || to.name, timestamp }
    
    // 移除重复的记录
    const filteredHistory = visitHistory.filter((item: any) => item.path !== to.path)
    
    // 添加新记录到开头
    filteredHistory.unshift(newRecord)
    
    // 只保留最近5条记录
    const updatedHistory = filteredHistory.slice(0, 5)
    
    // 保存到localStorage
    localStorage.setItem('visitHistory', JSON.stringify(updatedHistory))
  }

  next()
})

export default router
