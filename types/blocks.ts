export interface BaseBlock {
  id: string
  type: string
  content: any
  createdAt: Date
  updatedAt: Date
}

export interface TextBlock extends BaseBlock {
  type: "text"
  content: {
    text: string
    formatting?: {
      bold?: boolean
      italic?: boolean
      underline?: boolean
      color?: string
    }
  }
}

export interface HeadingBlock extends BaseBlock {
  type: "heading"
  content: {
    text: string
    level: 1 | 2 | 3
  }
}

export interface TodoBlock extends BaseBlock {
  type: "todo"
  content: {
    text: string
    completed: boolean
  }
}

export interface FormBlock extends BaseBlock {
  type: "form"
  content: {
    title: string
    fields: FormField[]
    submissions?: FormSubmission[]
  }
}

export interface FormField {
  id: string
  type: "text" | "email" | "textarea" | "select" | "checkbox" | "radio"
  label: string
  placeholder?: string
  required?: boolean
  options?: string[] // for select, radio
}

export interface FormSubmission {
  id: string
  data: Record<string, any>
  submittedAt: Date
}

export interface BulletListBlock extends BaseBlock {
  type: "bullet-list"
  content: {
    items: string[]
  }
}

export interface NumberedListBlock extends BaseBlock {
  type: "numbered-list"
  content: {
    items: string[]
  }
}

export interface QuoteBlock extends BaseBlock {
  type: "quote"
  content: {
    text: string
    author?: string
  }
}

export interface CodeBlock extends BaseBlock {
  type: "code"
  content: {
    code: string
    language?: string
  }
}

export interface DividerBlock extends BaseBlock {
  type: "divider"
  content: {}
}

export interface ImageBlock extends BaseBlock {
  type: "image"
  content: {
    url?: string
    caption?: string
    altText?: string
    filename?: string
    size?: number
    type?: string
    width?: number
    height?: number
  }
}

export type Block =
  | TextBlock
  | HeadingBlock
  | TodoBlock
  | FormBlock
  | BulletListBlock
  | NumberedListBlock
  | QuoteBlock
  | CodeBlock
  | DividerBlock
  | ImageBlock // Added ImageBlock to union type

export interface Page {
  id: string
  title: string
  icon?: string // Emoji (existing behavior)
  // Enhanced icon support (optional). If provided, takes precedence over emoji.
  iconLucide?: string // Lucide icon name, e.g., "Star", "Home"
  iconImage?: { url: string; width?: number; height?: number } // Custom uploaded icon
  coverPhoto?: string // URL to cover image
  blocks: Block[]
  createdAt: Date
  updatedAt: Date
  parentId?: string
}
