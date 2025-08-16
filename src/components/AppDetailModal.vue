/** * 应用详情弹窗组件 * 用于显示应用的详细信息，包括创建者、创建时间等 *
支持编辑和删除操作（仅对应用所有者或管理员显示） */
<template>
  <a-modal v-model:open="visible" title="应用详情" :footer="null" width="500px">
    <div class="app-detail-content">
      <!-- 应用基础信息展示区域 -->
      <div class="app-basic-info">
        <!-- 创建者信息 -->
        <div class="info-item">
          <span class="info-label">创建者：</span>
          <UserInfo :user="app?.user" size="small" />
        </div>
        <!-- 创建时间信息 -->
        <div class="info-item">
          <span class="info-label">创建时间：</span>
          <span>{{ formatTime(app?.createTime) }}</span>
        </div>
      </div>

      <!-- 操作按钮区域（仅本人或管理员可见） -->
      <div v-if="showActions" class="app-actions">
        <a-space>
          <!-- 编辑按钮 -->
          <a-button type="primary" @click="handleEdit">
            <template #icon>
              <EditOutlined />
            </template>
            修改
          </a-button>
          <!-- 删除按钮，带确认提示 -->
          <a-popconfirm
            title="确定要删除这个应用吗？"
            @confirm="handleDelete"
            ok-text="确定"
            cancel-text="取消"
          >
            <a-button danger>
              <template #icon>
                <DeleteOutlined />
              </template>
              删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import UserInfo from './UserInfo.vue'
import { formatTime } from '@/utils/time'

/**
 * 组件属性定义
 */
interface Props {
  /** 控制弹窗显示/隐藏 */
  open: boolean
  /** 应用信息对象 */
  app?: API.AppVO
  /** 是否显示操作按钮（编辑、删除） */
  showActions?: boolean
}

/**
 * 组件事件定义
 */
interface Emits {
  /** 更新弹窗显示状态 */
  (e: 'update:open', value: boolean): void
  /** 编辑应用事件 */
  (e: 'edit'): void
  /** 删除应用事件 */
  (e: 'delete'): void
}

// 定义组件属性，设置默认值
const props = withDefaults(defineProps<Props>(), {
  showActions: false,
})

// 定义组件事件
const emit = defineEmits<Emits>()

/**
 * 计算属性：控制弹窗的显示状态
 * 支持v-model双向绑定
 */
const visible = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

/**
 * 处理编辑按钮点击事件
 * 向父组件发送edit事件
 */
const handleEdit = () => {
  emit('edit')
}

/**
 * 处理删除按钮点击事件
 * 向父组件发送delete事件
 */
const handleDelete = () => {
  emit('delete')
}
</script>

<style scoped>
/* 弹窗内容区域样式 */
.app-detail-content {
  padding: 8px 0;
}

/* 应用基础信息区域样式 */
.app-basic-info {
  margin-bottom: 24px;
}

/* 信息项样式 */
.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

/* 信息标签样式 */
.info-label {
  width: 80px;
  color: #666;
  font-size: 14px;
  flex-shrink: 0;
}

/* 操作按钮区域样式 */
.app-actions {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
