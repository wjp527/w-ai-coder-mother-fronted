/** * 应用卡片组件 * 用于展示应用的基本信息，包括封面图、应用名称、创建者等 *
支持特色应用的高亮显示，并提供查看对话和查看作品的操作按钮 */
<template>
  <div class="app-card" :class="{ 'app-card--featured': featured }">
    <!-- 应用预览区域 -->
    <div class="app-preview">
      <!-- 应用封面图，如果没有则显示占位符 -->
      <img v-if="app.cover" :src="app.cover" :alt="app.appName" />
      <div v-else class="app-placeholder">
        <span>🤖</span>
      </div>
      <!-- 悬停时显示的操作按钮遮罩层 -->
      <div class="app-overlay">
        <a-space>
          <a-button type="primary" @click="handleViewChat">查看对话</a-button>
          <a-button v-if="app.deployKey" type="default" @click="handleViewWork">查看作品</a-button>
        </a-space>
      </div>
    </div>

    <!-- 应用信息区域 -->
    <div class="app-info">
      <!-- 左侧用户头像 -->
      <div class="app-info-left">
        <a-avatar :src="app.user?.userAvatar" :size="40">
          {{ app.user?.userName?.charAt(0) || 'U' }}
        </a-avatar>
      </div>
      <!-- 右侧应用名称和创建者信息 -->
      <div class="app-info-right">
        <h3 class="app-title">{{ app.appName || '未命名应用' }}</h3>
        <p class="app-author">
          {{ app.user?.userName || (featured ? '官方' : '未知用户') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 组件属性定义
 */
interface Props {
  /** 应用信息对象 */
  app: API.AppVO
  /** 是否为特色应用，特色应用会有特殊的样式显示 */
  featured?: boolean
}

/**
 * 组件事件定义
 */
interface Emits {
  /** 查看对话事件，传递应用ID */
  (e: 'view-chat', appId: string | number | undefined): void
  /** 查看作品事件，传递应用对象 */
  (e: 'view-work', app: API.AppVO): void
}

// 定义组件属性，设置默认值
const props = withDefaults(defineProps<Props>(), {
  featured: false,
})

// 定义组件事件
const emit = defineEmits<Emits>()

/**
 * 处理查看对话按钮点击事件
 * 向父组件发送view-chat事件，传递应用ID
 */
const handleViewChat = () => {
  emit('view-chat', props.app.id)
}

/**
 * 处理查看作品按钮点击事件
 * 向父组件发送view-work事件，传递应用对象
 */
const handleViewWork = () => {
  emit('view-work', props.app)
}
</script>

<style scoped>
/* 应用卡片基础样式 */
.app-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  cursor: pointer;
}

/* 悬停效果：向上移动并增强阴影 */
.app-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.25);
}

/* 应用预览区域样式 */
.app-preview {
  height: 180px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

/* 应用封面图样式 */
.app-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 无封面图时的占位符样式 */
.app-placeholder {
  font-size: 48px;
  color: #d9d9d9;
}

/* 操作按钮遮罩层样式 */
.app-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

/* 悬停时显示遮罩层 */
.app-card:hover .app-overlay {
  opacity: 1;
}

/* 应用信息区域样式 */
.app-info {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 左侧用户头像区域 */
.app-info-left {
  flex-shrink: 0;
}

/* 右侧应用信息区域 */
.app-info-right {
  flex: 1;
  min-width: 0;
}

/* 应用标题样式 */
.app-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 应用创建者样式 */
.app-author {
  font-size: 14px;
  color: #666;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
