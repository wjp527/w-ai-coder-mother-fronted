/** * 用户信息展示组件 * 用于显示用户的基本信息，包括头像和用户名 *
支持不同尺寸的头像显示，可选择是否显示用户名 */
<template>
  <div class="user-info">
    <!-- 用户头像，如果没有头像则显示用户名首字母 -->
    <a-avatar :src="user?.userAvatar" :size="size">
      {{ user?.userName?.charAt(0) || 'U' }}
    </a-avatar>
    <!-- 用户名，根据showName属性决定是否显示 -->
    <span v-if="showName" class="user-name">{{ user?.userName || '未知用户' }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * 组件属性定义
 */
interface Props {
  /** 用户信息对象 */
  user?: API.UserVO
  /** 头像尺寸，支持数字或预设值 */
  size?: number | 'small' | 'default' | 'large'
  /** 是否显示用户名 */
  showName?: boolean
}

// 定义组件属性，设置默认值
withDefaults(defineProps<Props>(), {
  size: 'default',
  showName: true,
})
</script>

<style scoped>
/* 用户信息容器样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 用户名样式 */
.user-name {
  font-size: 14px;
  color: #1a1a1a;
}
</style>
