import { Link as RouterLink } from '@tanstack/react-router'
import React from 'react'

type RouterLinkProps = React.ComponentProps<typeof RouterLink>

export const Link: React.FC<
  RouterLinkProps & {
    className?: string
    title?: string
    target?: '_blank' | '_self' | '_parent' | '_top'
    children?: React.ReactNode
  }
> = ({ className, children, ...props }) => {
  return (
    <RouterLink to={props.href} {...props} className={className}>
      {children}
    </RouterLink>
  )
}
