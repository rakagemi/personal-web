'use client'

import * as z from "zod"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Spinner from "@/components/spinner/Spinner";
import { Controller, useForm } from "react-hook-form";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { formSchema } from "@/lib/form-schema";
import { CLIENT_ENV } from "@/utils/environment/client";

export function ContactFormContent() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("access_key", `${CLIENT_ENV.formDataKey}`);
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("message", data.message);
      formData.append("subject", `New Message from ${data.name} via Portfolio`);

      const response = await fetch(`${CLIENT_ENV.formDataEndpoint}/submit`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Message sent successfully!", {
          description: "Thank you for reaching out. I will get back to you soon.",
          position: "top-center",
          // PERBAIKAN: Toast theme support
          className: "bg-neutral-950 text-white border-neutral-800 shadow-lg",
        });
        form.reset();
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error) {
      toast.error("Oops! Something went wrong.", {
        description: "Please try again later or contact me directly via email.",
        position: "top-center",
        className: "bg-neutral-950 text-white border-neutral-800 shadow-lg",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:col-span-3">
        <Card className=" bg-neutral-900/40 border-neutral-800 backdrop-blur-xl shadow-2xl transition-colors">
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl text-white transition-colors">Send a Message</CardTitle>
            <CardDescription className="text-neutral-400 text-base transition-colors">
              Fill out the form below and I&apos;ll get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="contact-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-neutral-300 transition-colors">Your Name</label>
                      <Input
                        {...field}
                        id="name"
                        placeholder="John Doe"
                        aria-invalid={fieldState.invalid}
                        className="bg-neutral-950/50 border-neutral-800 text-white h-12 focus-visible:ring-blue-500 transition-colors"
                      />
                      {fieldState.invalid && (
                        <p className="text-xs text-red-400 mt-1">{fieldState.error?.message}</p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-neutral-300 transition-colors">Email Address</label>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        aria-invalid={fieldState.invalid}
                        className="bg-neutral-950/50 border-neutral-800 text-white h-12 focus-visible:ring-blue-500 transition-colors"
                      />
                      {fieldState.invalid && (
                        <p className="text-xs text-red-400 mt-1">{fieldState.error?.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
              <Controller
                name="message"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-neutral-300 transition-colors">Your Message</label>
                    <Textarea
                      {...field}
                      id="message"
                      placeholder="Tell me about your project, timeline, and goals..."
                      rows={6}
                      aria-invalid={fieldState.invalid}
                      className="bg-neutral-950/50 border-neutral-800 text-white min-h-37.5 resize-none focus-visible:ring-blue-500 transition-colors"
                    />
                    <div className="flex justify-between items-center mt-1">
                      {fieldState.invalid ? (
                        <p className="text-xs text-red-400">{fieldState.error?.message}</p>
                      ) : (
                        <p className="text-xs text-neutral-500">Markdown is not supported.</p>
                      )}
                      <p className="text-xs text-neutral-500 tabular-nums">
                        {field.value.length}/1000
                      </p>
                    </div>
                  </div>
                )}
              />
            </form>
          </CardContent>
          <CardFooter className="pt-6 rounded-b-xl border-t border-neutral-800 transition-colors">
            <div className="w-full flex justify-end items-center gap-4 h-full">
              <Button
                type="button"
                variant="ghost"
                onClick={() => form.reset()}
                className=" text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer transition-all"
              >
                Clear
              </Button>
              <Button
                type="submit"
                form="contact-form"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 px-8 transition-all cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <div className="flex items-center gap-2"><Spinner size="sm" /> Sending...</div> : (
                  <span className="flex items-center gap-2">
                    Send Message <IconSend className="w-4 h-4 transition-all duration-300 ease-in-out animate-pulse" />
                  </span>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
  )
}