import * as React from "react"
import { cn } from "@/lib/utils"

export const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props} />
  )
)
Avatar.displayName = "Avatar"

export const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, src, alt, ...props }, ref) => (
    <img ref={ref} src={src} alt={alt} className={cn("aspect-square h-full w-full object-cover", className)} {...props} />
  )
)
AvatarImage.displayName = "AvatarImage"

export const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex h-full w-full items-center justify-center rounded-full bg-stone-200 dark:bg-stone-800 font-medium", className)} {...props} />
  )
)
AvatarFallback.displayName = "AvatarFallback"
