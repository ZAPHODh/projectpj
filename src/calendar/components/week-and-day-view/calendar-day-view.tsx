import { Calendar as LucideCalendar, Clock, User } from "lucide-react";
import { parseISO, areIntervalsOverlapping, format, isWithinInterval } from "date-fns";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AddScheduleDialog } from "@/calendar/components/dialogs/add-schedule";


import type { ISchedule } from "@/calendar/interfaces";
import { useCalendar } from "@/calendar/contexts/calendar";
import { getScheduleBlockStyle, groupSchedules } from "@/calendar/helper";
import { DayViewMultiDaySchedulesRow } from "./day-view-multi-day-schedules-row";
import { ScheduleBlock } from "./schedule-block";
import { CalendarTimeline } from "./calendar-timeline";
import { useLocale, useTranslations } from "next-intl";
import { getFnsLocale } from "@/lib/helper";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface IProps {
    singleDaySchedules: ISchedule[];
    multiDaySchedules: ISchedule[];
}

export function CalendarDayView({ singleDaySchedules, multiDaySchedules }: IProps) {
    const locale = useLocale()
    const fnsLocale = getFnsLocale(locale)
    const t = useTranslations('calendar.dayView');
    const { selectedDate, setSelectedDate, professionals } = useCalendar();

    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getCurrentSchedules = (schedules: ISchedule[]) => {
        const now = new Date();
        return schedules.filter(schedule =>
            isWithinInterval(now, {
                start: parseISO(schedule.startDate),
                end: parseISO(schedule.endDate),
            })
        );
    };

    const currentSchedules = getCurrentSchedules(singleDaySchedules);
    const daySchedules = singleDaySchedules.filter(schedule => {
        const scheduleDate = parseISO(schedule.startDate);
        return (
            scheduleDate.getDate() === selectedDate.getDate() &&
            scheduleDate.getMonth() === selectedDate.getMonth() &&
            scheduleDate.getFullYear() === selectedDate.getFullYear()
        );
    });

    const groupedSchedules = groupSchedules(daySchedules);
    return (
        <div className="flex">
            <div className="flex flex-1 flex-col">
                <div>
                    <DayViewMultiDaySchedulesRow selectedDate={selectedDate} multiDaySchedules={multiDaySchedules} />
                    <div className="relative z-20 flex border-b">
                        <div className="w-18"></div>
                        <span className="flex-1 border-l py-2 text-center text-xs font-medium text-muted-foreground">
                            {format(selectedDate, "EE", { locale: fnsLocale })}{" "}
                            <span className="font-semibold text-foreground">{format(selectedDate, "d", { locale: fnsLocale })}</span>
                        </span>
                    </div>
                </div>

                <ScrollArea className="h-[800px]" type="always">
                    <div className="flex">
                        <div className="relative w-18 capitalize">
                            {hours.map((hour, index) => (
                                <div key={hour} className="relative" style={{ height: "96px" }}>
                                    <div className="absolute -top-3 right-2 flex h-6 items-center">
                                        {index !== 0 && <span className="text-xs text-muted-foreground capitalize">{format(new Date().setHours(hour), "hh a", { locale: fnsLocale })}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="relative flex-1 border-l">
                            <div className="relative">
                                {hours.map((hour, index) => (
                                    <div key={hour} className="relative" style={{ height: "96px" }}>
                                        {index !== 0 && <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>}

                                        <AddScheduleDialog startDate={selectedDate} startTime={{ hour, minute: 0 }}>
                                            <div className="absolute inset-x-0 top-0 h-[48px] cursor-pointer transition-colors hover:bg-accent/50" />
                                        </AddScheduleDialog>

                                        <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed" />

                                        <AddScheduleDialog startDate={selectedDate} startTime={{ hour, minute: 30 }}>
                                            <div className="absolute inset-x-0 top-[48px] h-[48px] cursor-pointer transition-colors hover:bg-accent/50" />
                                        </AddScheduleDialog>
                                    </div>
                                ))}

                                {groupedSchedules.map((group, groupIndex) =>
                                    group.map(schedule => {
                                        let style = getScheduleBlockStyle(schedule, selectedDate, groupIndex, groupedSchedules.length);
                                        const hasOverlap = groupedSchedules.some(
                                            (otherGroup, otherIndex) =>
                                                otherIndex !== groupIndex &&
                                                otherGroup.some(otherSchedule =>
                                                    areIntervalsOverlapping(
                                                        { start: parseISO(schedule.startDate), end: parseISO(schedule.endDate) },
                                                        { start: parseISO(otherSchedule.startDate), end: parseISO(otherSchedule.endDate) }
                                                    )
                                                )
                                        );

                                        if (!hasOverlap) style = { ...style, width: "100%", left: "0%" };

                                        return (
                                            <div key={schedule.id} className="absolute p-1" style={style}>
                                                <ScheduleBlock schedule={schedule} />
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <CalendarTimeline />
                        </div>
                    </div>
                </ScrollArea>
            </div>

            <div className="hidden w-72 divide-y border-l md:block">
                <Calendar className="mx-auto w-fit" mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />

                <div className="flex-1 space-y-3 items-center">
                    {currentSchedules.length > 0 ? (
                        <div className="flex items-start gap-2 px-4 pt-4">
                            <span className="relative mt-[5px] flex size-2.5">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75"></span>
                                <span className="relative inline-flex size-2.5 rounded-full bg-success"></span>
                            </span>
                            <p className="text-sm font-semibold text-foreground">  {t('currentSchedules.ongoing')}</p>
                        </div>
                    ) : (
                        <p className="p-4 text-center text-sm italic text-muted-foreground">{t('currentSchedules.empty')}</p>
                    )}

                    {currentSchedules.length > 0 && (
                        <ScrollArea className="h-[422px] px-4" type="always">
                            <div className="space-y-6 pb-4 ">
                                {currentSchedules.map(schedule => {
                                    const professional = professionals.find(p => p.id === schedule.professional.id);

                                    return (
                                        <Card key={schedule.id} className="space-y-1.5">
                                            <CardHeader>
                                                <CardTitle>{schedule.title}</CardTitle>
                                                {professional && (
                                                    <CardDescription >
                                                        <User className="size-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">{professional.name}</span>
                                                    </CardDescription>
                                                )}

                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center gap-1.5">
                                                    <LucideCalendar className="size-4 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">{format(new Date(), "PP", { locale: fnsLocale })}</span>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="size-4 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">
                                                        {format(parseISO(schedule.startDate), "HH:mm", { locale: fnsLocale })} - {format(parseISO(schedule.endDate), "HH:mm", { locale: fnsLocale })}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                        </ScrollArea>
                    )}
                </div>
            </div>
        </div>
    );
}