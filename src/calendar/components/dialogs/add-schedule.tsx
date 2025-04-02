"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDisclosure } from "@/hooks/use-disclosure";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TimeInput } from "@/components/ui/time-input";
import { SingleDayPickerInput } from "@/components/ui/single-day-picker-input";

import { scheduleSchema } from "@/calendar/schema";
import type { TScheduleFormData } from "@/calendar/schema";
import type { TimeValue } from "react-aria-components";
import { useEffect } from "react";
import { useTranslations } from "next-intl";


interface IProps {
    children: React.ReactNode;
    startDate?: Date;
    startTime?: { hour: number; minute: number };
}

export function AddScheduleDialog({ children, startDate, startTime }: IProps) {
    const t = useTranslations('calendar.dialog.add');
    const { isOpen, onClose, onToggle } = useDisclosure();

    const form = useForm<TScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            title: "",
            description: "",
            startDate: startDate ?? new Date(),
            startTime: startTime ?? { hour: 9, minute: 0 },
            endDate: startDate ?? new Date(),
            endTime: startTime ?? { hour: 10, minute: 0 },
        },
    });

    useEffect(() => {
        if (startDate || startTime) {
            form.reset({
                ...form.getValues(),
                startDate: startDate ?? new Date(),
                startTime: startTime ?? { hour: 9, minute: 0 },
                endDate: startDate ?? new Date(),
                endTime: startTime ?? { hour: 10, minute: 0 },
            });
        }
    }, [startDate, startTime, form]);

    const onSubmit = (values: TScheduleFormData) => {
        console.log("Form values:", values);
        onClose();
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onToggle}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>{t('description')}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('fields.title.label')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('fields.title.placeholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>{t('fields.startDate.label')}</FormLabel>
                                        <FormControl>
                                            <SingleDayPickerInput
                                                value={field.value}
                                                onSelect={date => field.onChange(date as Date)}
                                                placeholder={t('fields.startDate.placeholder')}
                                                data-invalid={fieldState.invalid}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>{t('fields.endDate.label')}</FormLabel>
                                        <FormControl>
                                            <SingleDayPickerInput
                                                value={field.value}
                                                onSelect={date => field.onChange(date as Date)}
                                                placeholder={t('fields.endDate.placeholder')}
                                                data-invalid={fieldState.invalid}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('fields.startTime.label')}</FormLabel>
                                        <FormControl>
                                            <TimeInput
                                                value={field.value as TimeValue}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('fields.endTime.label')}</FormLabel>
                                        <FormControl>
                                            <TimeInput
                                                value={field.value as TimeValue}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="variant"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('fields.variant.label')}</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('fields.variant.placeholder')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="blue">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                                                    <span>{t('fields.variant.options.blue.label')}</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="green">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full bg-green-500" />
                                                    <span>{t('fields.variant.options.green.label')}</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="red">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full bg-red-500" />
                                                    <span>{t('fields.variant.options.red.label')}</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="purple">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full bg-purple-500" />
                                                    <span>{t('fields.variant.options.purple.label')}</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('fields.description.label')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t('fields.description.placeholder')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    {t('buttons.cancel')}
                                </Button>
                            </DialogClose>
                            <Button type="submit">{t('buttons.submit')}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}