"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/index";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "group transition-all duration-300 ",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex w-full items-center justify-between gap-4 py-5 text-left outline-none transition-all duration-300 hover:no-underline",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1">
        {/* Icon kiri: muncul hanya saat open */}
        <span className="text-2xl font-medium text-black dark:text-white">{children}</span>
        <span className="flex h-6 w-6 items-center justify-center text-white/50 transition-all duration-300 group-data-[state=open]:opacity-100 group-data-[state=open]:scale-100 group-data-[state=closed]:opacity-0 group-data-[state=closed]:scale-75">
          <ChevronRight size={24} className="translate-x-1px font-medium" />
        </span>
      </div>

      {/* Icon kanan: > saat closed, ⌄ saat open */}
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.25)] backdrop-blur-md transition-all duration-300 group-data-[state=open]:rotate-90">
        <ChevronRight size={24} className="transition-transform duration-300 ease-out" />
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-5 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };