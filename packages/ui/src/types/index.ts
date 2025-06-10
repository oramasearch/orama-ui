import { ComponentProps, ElementType, ReactNode } from "react"

export type PolymorphicComponentProps<T extends ElementType, P = object> = P & {
  as?: T
  children?: ReactNode
} & Omit<ComponentProps<T>, keyof P | 'as' | 'children'>