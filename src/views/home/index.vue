<template>
  <Container title="home" :breadcrumb="['home']">
    <div class="home">
      <div class="home__welcome">
        <Box class="welcome-box">
          <div class="welcome-content">
            <h1>{{ greeting }}！{{ userInfo.name || userInfo.username }}</h1>
            <p>现在是 {{ today }}，祝您工作愉快！</p>
          </div>
          <div class="user-stats">
            <div class="stat-item">
              <h3>{{ todayTasks }}</h3>
              <p>今日待办</p>
            </div>
            <div class="stat-item">
              <h3>{{ notifications }}</h3>
              <p>未读消息</p>
            </div>
          </div>
        </Box>
      </div>

      <div class="home__history">
        <Box class="history-box">
          <div class="history-header">
            <h3>访问历史</h3>
            <AButton type="link" @click="clearHistory" v-if="visitHistory.length">清空历史</AButton>
          </div>
          <ATimeline>
            <ATimelineItem v-for="item in visitHistory" :key="item.timestamp">
              <template #dot>
                <HistoryOutlined style="font-style: 16px" />
              </template>
              <div class="history-item" @click="handleHistoryClick(item)">
                <span class="history-title">{{ item.title }}</span>
                <span class="history-time">{{ formatTime(item.timestamp) }}</span>
              </div>
            </ATimelineItem>
            <ATimelineItem v-if="!visitHistory.length">
              <template #dot>
                <InfoCircleOutlined style="font-style: 16px" />
              </template>
              <span class="history-empty">暂无访问记录</span>
            </ATimelineItem>
          </ATimeline>
        </Box>
      </div>
      
      <div class="home__dashboard">
        <Box class="dashboard-box" v-for="card in quickAccess" :key="card.title">
          <div class="dashboard-card" @click="handleCardClick(card)">
            <component :is="card.icon" class="card-icon" />
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        </Box>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import {
  ProjectOutlined,
  MessageOutlined,
  SettingOutlined,
  TeamOutlined,
  HistoryOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'
import { useUserStore } from '@/store/user'
import type { IUserInfo } from '@/api'

const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo as IUserInfo)

const today = computed(() => dayjs().format('YYYY年MM月DD日 HH:mm:ss'))
const getGreeting = () => {
  const hour = dayjs().hour()
  if (hour >= 0 && hour < 5) return '凌晨好'
  if (hour >= 5 && hour < 9) return '早上好'
  if (hour >= 9 && hour < 12) return '上午好'
  if (hour >= 12 && hour < 14) return '中午好'
  if (hour >= 14 && hour < 18) return '下午好'
  return '晚上好'
}

const greeting = computed(() => getGreeting())
const todayTasks = ref(5)
const notifications = ref(3)

interface VisitHistoryItem {
  path: string
  title: string
  timestamp: number
}

const visitHistory = ref<VisitHistoryItem[]>([])

// 格式化时间
const formatTime = (timestamp: number) => {
  return dayjs(timestamp).format('MM-DD HH:mm')
}

// 清空历史记录
const clearHistory = () => {
  visitHistory.value = []
  localStorage.setItem('visitHistory', JSON.stringify([]))
}

// 点击历史记录项
const handleHistoryClick = (item: VisitHistoryItem) => {
  router.push(item.path)
}

// 初始化访问历史
const initVisitHistory = () => {
  const history = localStorage.getItem('visitHistory')
  if (history) {
    visitHistory.value = JSON.parse(history)
  }
}

// 添加访问记录
const addVisitHistory = (path: string, title: string) => {
  const timestamp = Date.now()
  const newRecord = { path, title, timestamp }
  
  // 移除重复的记录
  visitHistory.value = visitHistory.value.filter(item => item.path !== path)
  
  // 添加新记录到开头
  visitHistory.value.unshift(newRecord)
  
  // 只保留最近5条记录
  if (visitHistory.value.length > 5) {
    visitHistory.value = visitHistory.value.slice(0, 5)
  }
  
  // 保存到localStorage
  localStorage.setItem('visitHistory', JSON.stringify(visitHistory.value))
}

// 初始化
initVisitHistory()

const quickAccess = [
  {
    title: '项目管理',
    description: '查看和管理您的项目',
    icon: ProjectOutlined,
    path: '/projects'
  },
  {
    title: '消息中心',
    description: '查看您的消息和通知',
    icon: MessageOutlined,
    path: '/messages'
  },
  {
    title: '团队协作',
    description: '与团队成员协作',
    icon: TeamOutlined,
    path: '/team'
  },
  {
    title: '系统设置',
    description: '个性化您的工作台',
    icon: SettingOutlined,
    path: '/settings'
  }
]

const handleCardClick = (card: typeof quickAccess[0]) => {
  router.push(card.path)
}
</script>

<style lang="scss" scoped>
.home {
  &__welcome, &__history {
    margin-bottom: $spacing-large;

    .welcome-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-extra-large;

      .welcome-content {
        h1 {
          margin: 0;
          font-size: $font-size-extra-large;
          color: $text-primary;
        }

        p {
          margin: $spacing-small 0 0;
          color: $text-secondary;
        }
      }

      .user-stats {
        display: flex;
        gap: $spacing-extra-large;

        .stat-item {
          text-align: center;

          h3 {
            margin: 0;
            font-size: $font-size-large;
            color: $color-primary;
          }

          p {
            margin: $spacing-small 0 0;
            color: $text-secondary;
          }
        }
      }
    }
  }

  &__history {
    margin-bottom: $spacing-large;

    .history-box {
      padding: $spacing-large;

      .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $spacing-large;

        h3 {
          margin: 0;
          font-size: $font-size-medium;
          color: $text-primary;
        }
      }

      .history-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        &:hover .history-title {
          color: $color-primary;
        }

        .history-title {
          color: $text-primary;
          transition: color 0.3s ease;
        }

        .history-time {
          font-size: $font-size-small;
          color: $text-secondary;
        }
      }

      .history-empty {
        color: $text-secondary;
      }
    }
  }

  &__dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: $spacing-large;

    .dashboard-box {
      height: 100%;
    }

    .dashboard-card {
      padding: $spacing-large;
      text-align: center;
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      .card-icon {
        font-size: 32px;
        color: $color-primary;
      }

      h3 {
        margin: $spacing-base 0;
        color: $text-primary;
      }

      p {
        margin: 0;
        color: $text-secondary;
      }
    }
  }
}
</style>
