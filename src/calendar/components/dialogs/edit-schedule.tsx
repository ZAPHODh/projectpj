"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { parseISO } from "date-fns";

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
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TimeInput } from "@/components/ui/time-input";
import { SingleDayPickerInput } from "@/components/ui/single-day-picker-input";
import { Combobox } from "@/components/ui/input/combobox";

import { scheduleSchema } from "@/calendar/schema";
import type { TScheduleFormData } from "@/calendar/schema";
import type { TimeValue } from "react-aria-components";
import { useCalendar } from "@/calendar/contexts/calendar";
import { useSession } from "@/components/providers/session";
import type { ISchedule } from "@/calendar/interfaces";

interface IProps {
    children: React.ReactNode;
    schedule: ISchedule;
}

export function EditScheduleDialog({ children, schedule }: IProps) {
    const { session } = useSession();
    const { professionals, services, setSchedules } = useCalendar();
    const t = useTranslations('calendar.dialog.edit');
    const { isOpen, onClose, onToggle } = useDisclosure();

    const form = useForm<TScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            customerId: schedule.customer.id,
            description: schedule.description,
            startDate: parseISO(schedule.startDate),
            startTime: {
                hour: parseISO(schedule.startDate).getHours(),
                minute: parseISO(schedule.startDate).getMinutes()
            },
            endDate: parseISO(schedule.endDate),
            endTime: {
                hour: parseISO(schedule.endDate).getHours(),
                minute: parseISO(schedule.endDate).getMinutes()
            },
            professionalId: schedule.professional.id,
            serviceId: schedule.service.id,
        },
    });

    useEffect(() => {
        if (schedule) {
            form.reset({
                customerId: schedule.customer.id,
                description: schedule.description,
                startDate: parseISO(schedule.startDate),
                startTime: {
                    hour: parseISO(schedule.startDate).getHours(),
                    minute: parseISO(schedule.startDate).getMinutes()
                },
                endDate: parseISO(schedule.endDate),
                endTime: {
                    hour: parseISO(schedule.endDate).getHours(),
                    minute: parseISO(schedule.endDate).getMinutes()
                },
                professionalId: schedule.professional.id,
                serviceId: schedule.service.id,
            });
        }
    }, [schedule, form]);

    const onSubmit = async (values: TScheduleFormData) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/appointments/${schedule.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(values)
            });

            if (!res.ok) throw new Error('Failed to update schedule');

            const data = await res.json();
            setSchedules(prev => prev.map(s =>
                s.id === schedule.id ? data.appointment : s
            ));

            toast.success(t('success'));
            onClose();
        } catch (error) {
            toast.error(t('error'));
        }
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
                        <div className="grid grid-cols-2 gap-4">
                            <Combobox
                                referenceId="professionalId"
                                datas={professionals || []}
                                title={t('fields.professional.label')}
                                placeholder={t('fields.professional.placeholder')}
                                description={t('fields.professional.description')}
                                chave="professionalId"
                            />
                            <Combobox
                                referenceId="serviceId"
                                datas={services || []}
                                title={t('fields.service.label')}
                                placeholder={t('fields.service.placeholder')}
                                description={t('fields.service.description')}
                                chave="serviceId"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>{t('fields.startDate.label')}</FormLabel>
                                        <FormControl>
                                            <SingleDayPickerInput
                                                lang="pt-BR"
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