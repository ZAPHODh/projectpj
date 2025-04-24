"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


import { toast } from "sonner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"


import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"

import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"


import { formatDate, getFnsLocale } from "@/lib/helper"
import { useLocale, useTranslations } from "next-intl"
import { useSession } from "../providers/session"






function ProfileForm() {
    const t = useTranslations('account.profileForm');
    const { session } = useSession()
    const profileFormSchema = z.object({
        name: z
            .string()
            .min(2, {
                message: t('errors.name.min'),
            })
            .max(30, {
                message: t('errors.name.max'),
            }),
        dob: z.date({
            required_error: t('errors.dob'),
        }),
        email: z
            .string({
                required_error: t('errors.email'),
            })
            .email(),
        theme: z.enum(["light", "dark"], {
            required_error: t('errors.theme'),
        }),
        font: z.enum(["inter", "manrope", "system"], {
            invalid_type_error: t('errors.font'),
            required_error: t('errors.font'),
        }),
    })
    type ProfileFormValues = z.infer<typeof profileFormSchema>
    const currentLocale = useLocale()
    const fnsLocale = getFnsLocale(currentLocale)
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        mode: "onChange",
        defaultValues: {
            name: session?.user.name || '',
            dob: new Date()
        }
    })

    function onSubmit(data: ProfileFormValues) {
        toast(
            "You submitted the following values:", {
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        }
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-md ">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('labels.name')}</FormLabel>
                            <FormControl>
                                <Input
                                    className="w-[200px]"
                                    placeholder={t('placeholders.name')}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                {t('descriptions.name')}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>{t('labels.dob')}</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>

                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[200px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                formatDate(field.value, currentLocale, 'PPP')
                                            ) : (
                                                <span>{t('placeholders.date')}</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        locale={fnsLocale}
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                {t('descriptions.dob')}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">{t('buttons.update')}</Button>
            </form>
        </Form>
    )
}

export { ProfileForm }