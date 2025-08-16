/** * 部署成功弹窗组件 * 用于显示应用部署成功后的信息，包括部署URL和操作按钮 *
支持复制部署链接、访问网站等操作 */
<template>
  <a-modal v-model:open="visible" title="部署成功" :footer="null" width="600px">
    <div class="deploy-success">
      <!-- 成功图标 -->
      <div class="success-icon">
        <CheckCircleOutlined style="color: #52c41a; font-size: 48px" />
      </div>

      <!-- 成功提示标题 -->
      <h3>网站部署成功！</h3>

      <!-- 成功提示描述 -->
      <p>你的网站已经成功部署，可以通过以下链接访问：</p>

      <!-- 部署URL显示区域 -->
      <div class="deploy-url">
        <a-input :value="deployUrl" readonly>
          <template #suffix>
            <!-- 复制链接按钮 -->
            <a-button type="text" @click="handleCopyUrl">
              <CopyOutlined />
            </a-button>
          </template>
        </a-input>
      </div>

      <!-- 操作按钮区域 -->
      <div class="deploy-actions">
        <a-button type="primary" @click="handleOpenSite">访问网站</a-button>
        <a-button @click="handleClose">关闭</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { message } from 'ant-design-vue'
import { CheckCircleOutlined, CopyOutlined } from '@ant-design/icons-vue'

/**
 * 组件属性定义
 */
interface Props {
  /** 控制弹窗显示/隐藏 */
  open: boolean
  /** 部署后的网站访问URL */
  deployUrl: string
}

/**
 * 组件事件定义
 */
interface Emits {
  /** 更新弹窗显示状态 */
  (e: 'update:open', value: boolean): void
  /** 访问网站事件 */
  (e: 'open-site'): void
}

// 定义组件属性
const props = defineProps<Props>()

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
 * 处理复制URL按钮点击事件
 * 将部署URL复制到剪贴板，并显示成功提示
 */
const handleCopyUrl = async () => {
  try {
    await navigator.clipboard.writeText(props.deployUrl)
    message.success('链接已复制到剪贴板')
  } catch (error) {
    console.error('复制失败：', error)
    message.error('复制失败')
  }
}

/**
 * 处理访问网站按钮点击事件
 * 向父组件发送open-site事件
 */
const handleOpenSite = () => {
  emit('open-site')
}

/**
 * 处理关闭按钮点击事件
 * 关闭弹窗
 */
const handleClose = () => {
  visible.value = false
}
</script>

<style scoped>
/* 部署成功内容区域样式 */
.deploy-success {
  text-align: center;
  padding: 24px;
}

/* 成功图标样式 */
.success-icon {
  margin-bottom: 16px;
}

/* 成功提示标题样式 */
.deploy-success h3 {
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 600;
}

/* 成功提示描述样式 */
.deploy-success p {
  margin: 0 0 24px;
  color: #666;
}

/* 部署URL显示区域样式 */
.deploy-url {
  margin-bottom: 24px;
}

/* 操作按钮区域样式 */
.deploy-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
