"use client"

import * as React from "react"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      expand={false}
      visibleToasts={4}
      closeButton
      richColors={false}
      offset={20}
      gap={12}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-[18px]" />,
        info: <InfoIcon className="size-[18px]" />,
        warning: <TriangleAlertIcon className="size-[18px]" />,
        error: <OctagonXIcon className="size-[18px]" />,
        loading: <Loader2Icon className="size-[18px] animate-spin" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: `
            group toast
            w-[calc(100vw-24px)] sm:w-[420px]
            rounded-[26px]
            px-4 py-3.5
            border border-white/35 dark:border-white/10
            bg-white/55 dark:bg-white/10
            text-neutral-900 dark:text-white
            shadow-[0_12px_40px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.35)]
            dark:shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]
            backdrop-blur-2xl backdrop-saturate-150
            supports-[backdrop-filter]:bg-white/45
            dark:supports-[backdrop-filter]:bg-white/10
            flex items-start gap-3
            transition-all duration-300
          `,
          content: "flex-1",
          title: "text-[15px] font-semibold leading-5 tracking-[-0.01em]",
          description: "mt-1 text-[13px] leading-5 text-neutral-700 dark:text-neutral-300",
          icon: "mt-0.5 shrink-0",
          closeButton: `
            !left-auto !right-3 !top-3
            rounded-full border border-black/5 dark:border-white/10
            bg-white/55 dark:bg-white/10
            text-neutral-600 dark:text-neutral-300
            hover:bg-white/80 dark:hover:bg-white/15
            backdrop-blur-md
          `,
          actionButton: `
            mt-3 inline-flex h-9 items-center justify-center rounded-full
            bg-neutral-900 text-white dark:bg-white dark:text-neutral-900
            px-4 text-xs font-medium
            hover:opacity-90
          `,
          cancelButton: `
            mt-3 inline-flex h-9 items-center justify-center rounded-full
            border border-black/10 dark:border-white/10
            bg-white/55 dark:bg-white/10
            px-4 text-xs font-medium text-neutral-800 dark:text-white
            hover:bg-white/80 dark:hover:bg-white/15
          `,
          success: `
            border-emerald-200/50 dark:border-emerald-400/15
            bg-emerald-50/55 dark:bg-emerald-500/10
            [&_[data-icon]]:text-emerald-600 dark:[&_[data-icon]]:text-emerald-400
          `,
          error: `
            border-rose-200/50 dark:border-rose-400/15
            bg-rose-50/55 dark:bg-rose-500/10
            [&_[data-icon]]:text-rose-600 dark:[&_[data-icon]]:text-rose-400
          `,
          warning: `
            border-amber-200/50 dark:border-amber-400/15
            bg-amber-50/55 dark:bg-amber-500/10
            [&_[data-icon]]:text-amber-600 dark:[&_[data-icon]]:text-amber-400
          `,
          info: `
            border-sky-200/50 dark:border-sky-400/15
            bg-sky-50/55 dark:bg-sky-500/10
            [&_[data-icon]]:text-sky-600 dark:[&_[data-icon]]:text-sky-400
          `,
          loading: `
            border-white/35 dark:border-white/10
            bg-white/55 dark:bg-white/10
          `,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }