const STYLE_ID = 'visual-editor-style'
const HOVER_CLASS = 'visual-editor-hovered'
const SELECTED_CLASS = 'visual-editor-selected'

export interface VisualEditorSelectedElement {
  tagName: string
  id?: string
  className?: string
  textContent: string
  path: string
  attributes: Record<string, string>
}

interface VisualEditorBridgeOptions {
  onSelectionChange?: (info: VisualEditorSelectedElement | null) => void
}

type BridgeError = 'none' | 'no-iframe' | 'not-ready' | 'cross-origin'

const shouldSkipElement = (element: HTMLElement, doc: Document) => {
  return element === doc.body || element === doc.documentElement
}

const getHTMLElementCtor = (doc: Document | null): typeof window.HTMLElement | undefined => {
  const view = doc?.defaultView
  if (view?.HTMLElement) {
    return view.HTMLElement
  }
  if (typeof window !== 'undefined' && window.HTMLElement) {
    return window.HTMLElement
  }
  return undefined
}

const buildElementPath = (element: HTMLElement) => {
  const segments: string[] = []
  let current: HTMLElement | null = element

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    const tag = current.tagName.toLowerCase()
    if (current.id) {
      segments.unshift(`${tag}#${current.id}`)
      break
    } else {
      let selector = tag
      if (current.classList.length) {
        selector += '.' + Array.from(current.classList).slice(0, 2).join('.')
      }

      const parent = current.parentElement
      if (parent) {
        const sameTagSiblings = Array.from(parent.children).filter(
          (child) => child.tagName === current!.tagName,
        )
        if (sameTagSiblings.length > 1) {
          const index = sameTagSiblings.indexOf(current)
          selector += `:nth-of-type(${index + 1})`
        }
      }
      segments.unshift(selector)
    }
    current = current.parentElement
  }

  return segments.join(' > ')
}

const buildElementInfo = (element: HTMLElement): VisualEditorSelectedElement => {
  const text = element.innerText.replace(/\s+/g, ' ').trim()
  const truncatedText = text.length > 200 ? text.slice(0, 200) + '…' : text

  const attributes: Record<string, string> = {}
  Array.from(element.attributes).forEach((attr) => {
    attributes[attr.name] = attr.value
  })

  return {
    tagName: element.tagName.toLowerCase(),
    id: element.id || undefined,
    className: element.className || undefined,
    textContent: truncatedText,
    path: buildElementPath(element),
    attributes,
  }
}

const injectStyles = (doc: Document) => {
  if (doc.getElementById(STYLE_ID)) {
    return
  }
  const style = doc.createElement('style')
  style.id = STYLE_ID
  style.innerHTML = `
    .${HOVER_CLASS} {
      outline: 2px dashed #1677ff !important;
      cursor: crosshair !important;
      outline-offset: -2px !important;
    }
    .${SELECTED_CLASS} {
      outline: 2px solid #fa541c !important;
      cursor: crosshair !important;
      outline-offset: -2px !important;
    }
  `
  doc.head.appendChild(style)
}

const safeGetDocument = (iframe: HTMLIFrameElement | null) => {
  if (!iframe) {
    return { doc: null, error: 'no-iframe' as BridgeError }
  }
  try {
    const doc = iframe.contentDocument
    if (!doc) {
      return { doc: null, error: 'not-ready' as BridgeError }
    }
    return { doc, error: 'none' as BridgeError }
  } catch (error) {
    console.warn('跨域 iframe，无法注入可视化编辑脚本', error)
    return { doc: null, error: 'cross-origin' as BridgeError }
  }
}

export const createVisualEditorBridge = (options: VisualEditorBridgeOptions = {}) => {
  let iframeEl: HTMLIFrameElement | null = null
  let doc: Document | null = null
  let enabled = false
  let hoverElement: HTMLElement | null = null
  let selectedElement: HTMLElement | null = null
  let lastError: BridgeError = 'none'

  const clearHover = () => {
    if (hoverElement) {
      hoverElement.classList.remove(HOVER_CLASS)
      hoverElement = null
    }
  }

  const clearSelectedClass = () => {
    if (selectedElement) {
      selectedElement.classList.remove(SELECTED_CLASS)
      selectedElement = null
    }
  }

  const notifySelection = (element: HTMLElement | null) => {
    if (!element) {
      options.onSelectionChange?.(null)
      return
    }
    options.onSelectionChange?.(buildElementInfo(element))
  }

  const setHover = (element: HTMLElement) => {
    if (hoverElement === element || shouldSkipElement(element, doc!)) {
      return
    }
    clearHover()
    hoverElement = element
    hoverElement.classList.add(HOVER_CLASS)
  }

  const setSelected = (element: HTMLElement) => {
    if (shouldSkipElement(element, doc!)) {
      return
    }
    clearSelectedClass()
    selectedElement = element
    selectedElement.classList.add(SELECTED_CLASS)
    notifySelection(selectedElement)
  }

  const getValidElement = (target: EventTarget | null) => {
    if (!target || !doc) return null
    const HTMLElementCtor = getHTMLElementCtor(doc)
    const isHTMLElement = (node: unknown): node is HTMLElement =>
      !!HTMLElementCtor && node instanceof HTMLElementCtor

    if (!isHTMLElement(target)) {
      const parent = (target as Node).parentElement
      return parent && isHTMLElement(parent) ? parent : null
    }
    return target
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!enabled) return
    const target = getValidElement(event.target)
    if (!target || shouldSkipElement(target, doc!)) {
      clearHover()
      return
    }
    setHover(target)
  }

  const handleMouseOut = (event: MouseEvent) => {
    if (!enabled) return
    const related = getValidElement(event.relatedTarget)
    if (!related) {
      clearHover()
    }
  }

  const handleClick = (event: MouseEvent) => {
    if (!enabled) return
    event.preventDefault()
    event.stopPropagation()
    const target = getValidElement(event.target)
    if (!target) return
    setSelected(target)
  }

  const attachListeners = () => {
    if (!doc) return false
    injectStyles(doc)
    doc.addEventListener('mousemove', handleMouseMove, true)
    doc.addEventListener('mouseout', handleMouseOut, true)
    doc.addEventListener('click', handleClick, true)
    enabled = true
    return true
  }

  const detachListeners = () => {
    if (!doc || !enabled) return
    doc.removeEventListener('mousemove', handleMouseMove, true)
    doc.removeEventListener('mouseout', handleMouseOut, true)
    doc.removeEventListener('click', handleClick, true)
    enabled = false
    clearHover()
  }

  const setIframe = (iframe: HTMLIFrameElement | null | undefined) => {
    if (iframeEl === iframe) {
      return
    }
    detachListeners()
    clearSelected()
    iframeEl = iframe || null
    const { doc: iframeDoc, error } = safeGetDocument(iframeEl)
    doc = iframeDoc
    lastError = error
  }

  const clearSelected = () => {
    clearSelectedClass()
    notifySelection(null)
  }

  return {
    setIframe,
    enable: () => {
      const { doc: iframeDoc, error } = safeGetDocument(iframeEl)
      doc = iframeDoc
      lastError = error
      if (!doc) return false
      const attached = attachListeners()
      if (attached) {
        lastError = 'none'
      }
      return attached
    },
    disable: () => {
      detachListeners()
      clearHover()
    },
    clearSelection: () => {
      clearSelected()
    },
    destroy: () => {
      detachListeners()
      clearHover()
      clearSelected()
      iframeEl = null
      doc = null
      lastError = 'none'
    },
    getLastError: () => lastError,
  }
}


