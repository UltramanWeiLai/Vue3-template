import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layout/index.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/home/index.vue')
      }
      // ... 其他子路由
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
  next()
})

export default router
