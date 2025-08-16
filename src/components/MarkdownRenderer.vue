/** * Markdown渲染器组件 * 用于将Markdown文本内容渲染为HTML，支持代码高亮、表格、链接等格式 *
基于markdown-it库实现，使用highlight.js进行代码语法高亮 */
<template>
  <div class="markdown-content" v-html="renderedMarkdown"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

// 引入代码高亮样式
import 'highlight.js/styles/github.css'

/**
 * 组件属性定义
 */
interface Props {
  /** 要渲染的Markdown文本内容 */
  content: string
}

// 定义组件属性
const props = defineProps<Props>()

/**
 * 配置 markdown-it 实例
 * 启用HTML支持、链接自动识别、排版优化等功能
 */
const md: MarkdownIt = new MarkdownIt({
  html: true, // 允许HTML标签
  linkify: true, // 自动识别链接
  typographer: true, // 启用排版优化
  highlight: function (str: string, lang: string): string {
    // 如果指定了语言且highlight.js支持该语言，则进行代码高亮
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        )
      } catch {
        // 忽略错误，使用默认处理
      }
    }

    // 默认处理：转义HTML字符并包装在pre和code标签中
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  },
})

/**
 * 计算属性：渲染后的Markdown HTML内容
 * 将Markdown文本转换为HTML字符串
 */
const renderedMarkdown = computed(() => {
  return md.render(props.content)
})
</script>

<style scoped>
/* Markdown内容基础样式 */
.markdown-content {
  line-height: 1.6;
  color: #333;
  word-wrap: break-word;
}

/* 全局样式，影响 v-html 内容 */
/* 标题样式 */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 1.5em 0 0.5em 0;
  font-weight: 600;
  line-height: 1.25;
}

/* 一级标题样式 */
.markdown-content :deep(h1) {
  font-size: 1.5em;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3em;
}

/* 二级标题样式 */
.markdown-content :deep(h2) {
  font-size: 1.3em;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3em;
}

/* 三级标题样式 */
.markdown-content :deep(h3) {
  font-size: 1.1em;
}

/* 段落样式 */
.markdown-content :deep(p) {
  margin: 0.8em 0;
}

/* 列表样式 */
.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.8em 0;
  padding-left: 1.5em;
}

/* 列表项样式 */
.markdown-content :deep(li) {
  margin: 0.3em 0;
}

/* 引用块样式 */
.markdown-content :deep(blockquote) {
  margin: 1em 0;
  padding: 0.5em 1em;
  border-left: 4px solid #ddd;
  background-color: #f9f9f9;
  color: #666;
}

/* 行内代码样式 */
.markdown-content :deep(code) {
  background-color: #f1f1f1;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
}

/* 代码块样式 */
.markdown-content :deep(pre) {
  background-color: #f8f8f8;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  padding: 1em;
  overflow-x: auto;
  margin: 1em 0;
}

/* 代码块内的代码样式 */
.markdown-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  font-size: 0.9em;
  line-height: 1.4;
}

/* 表格样式 */
.markdown-content :deep(table) {
  border-collapse: collapse;
  margin: 1em 0;
  width: 100%;
}

/* 表格单元格样式 */
.markdown-content :deep(table th),
.markdown-content :deep(table td) {
  border: 1px solid #ddd;
  padding: 0.5em 0.8em;
  text-align: left;
}

/* 表格表头样式 */
.markdown-content :deep(table th) {
  background-color: #f5f5f5;
  font-weight: 600;
}

/* 表格偶数行背景色 */
.markdown-content :deep(table tr:nth-child(even)) {
  background-color: #f9f9f9;
}

/* 链接样式 */
.markdown-content :deep(a) {
  color: #1890ff;
  text-decoration: none;
}

/* 链接悬停样式 */
.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

/* 图片样式 */
.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 0.5em 0;
}

/* 分割线样式 */
.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid #eee;
  margin: 1.5em 0;
}

/* 代码高亮样式优化 */
.markdown-content :deep(.hljs) {
  background-color: #f8f8f8 !important;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
  line-height: 1.4;
}

/* 特定语言的代码块样式 */
/* 关键字样式 */
.markdown-content :deep(.hljs-keyword) {
  color: #d73a49;
  font-weight: 600;
}

/* 字符串样式 */
.markdown-content :deep(.hljs-string) {
  color: #032f62;
}

/* 注释样式 */
.markdown-content :deep(.hljs-comment) {
  color: #6a737d;
  font-style: italic;
}

/* 数字样式 */
.markdown-content :deep(.hljs-number) {
  color: #005cc5;
}

/* 函数样式 */
.markdown-content :deep(.hljs-function) {
  color: #6f42c1;
}

/* 标签样式 */
.markdown-content :deep(.hljs-tag) {
  color: #22863a;
}

/* 属性样式 */
.markdown-content :deep(.hljs-attr) {
  color: #6f42c1;
}

/* 标题样式 */
.markdown-content :deep(.hljs-title) {
  color: #6f42c1;
  font-weight: 600;
}
</style>
