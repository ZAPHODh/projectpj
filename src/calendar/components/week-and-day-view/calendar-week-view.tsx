import { startOfWeek, addDays, format, parseISO, isSameDay, areIntervalsOverlapping } from "date-fns";



import { ScrollArea } from "@/components/ui/scroll-area";


import { ScheduleBlock } from "@/calendar/components/week-and-day-view/schedule-block";
import { DroppableTimeBlock } from "@/calendar/components/dnd/droppable-time-block";


import { cn } from "@/lib/utils";


import type { ISchedule } from "@/calendar/interfaces";
import { useCalendar } from "@/calendar/contexts/calendar";
import { getScheduleBlockStyle, getVisibleHours, groupSchedules, isWorkingHour } from "@/calendar/helper";
import { WeekViewMultiDaySchedulesRow } from "./week-view-multi-day-schedule-row";
import { AddScheduleDialog } from "../dialogs/add-schedule";
import { CalendarTimeline } from "./calendar-timeline";

interface IProps {
    singleDaySchedules: ISchedule[];
    multiDaySchedules: ISchedule[];
}

export function CalendarWeekView({ singleDaySchedules, multiDaySchedules }: IProps) {
    const { selectedDate, workingHours, visibleHours } = useCalendar();

    const { hours, earliestScheduleHour, latestScheduleHour } = getVisibleHours(visibleHours, singleDaySchedules);

    const weekStart = startOfWeek(selectedDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
        <>
            <div className="flex flex-col items-center justify-center border-b py-4 text-sm text-muted-foreground sm:hidden">
                <p>Weekly view is not available on smaller devices.</p>
                <p>Please switch to daily or monthly view.</p>
            </div>

            <div className="hidden flex-col sm:flex">
                <div>
                    <WeekViewMultiDaySchedulesRow selectedDate={selectedDate} multiDaySchedules={multiDaySchedules} />

                    {/* Week header */}
                    <div className="relative z-20 flex border-b">
                        <div className="w-18"></div>
                        <div className="grid flex-1 grid-cols-7 divide-x border-l">
                            {weekDays.map((day, index) => (
                                <span key={index} className="py-2 text-center text-xs font-medium text-muted-foreground">
                                    {format(day, "EE")} <span className="ml-1 font-semibold text-foreground">{format(day, "d")}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <ScrollArea className="h-[736px]" type="always">
                    <div className="flex overflow-hidden">
                        {/* Hours column */}
                        <div className="relative w-18">
                            {hours.map((hour, index) => (
                                <div key={hour} className="relative" style={{ height: "96px" }}>
                                    <div className="absolute -top-3 right-2 flex h-6 items-center">
                                        {index !== 0 && <span className="text-xs text-muted-foreground">{format(new Date().setHours(hour), "hh a")}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Week grid */}
                        <div className="relative flex-1 border-l">
                            <div className="grid grid-cols-7 divide-x">
                                {weekDays.map((day, dayIndex) => {
                                    const daySchedules = singleDaySchedules.filter(schedule =>
                                        isSameDay(parseISO(schedule.startDate), day) ||
                                        isSameDay(parseISO(schedule.endDate), day)
                                    );
                                    const groupedSchedules = groupSchedules(daySchedules);

                                    return (
                                        <div key={dayIndex} className="relative">
                                            {hours.map((hour, index) => {
                                                const isDisabled = !isWorkingHour(day, hour, workingHours);

                                                return (
                                                    <div key={hour} className={cn("relative", isDisabled && "bg-calendar-disabled-hour")} style={{ height: "96px" }}>
                                                        {index !== 0 && <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>}

                                                        <DroppableTimeBlock date={day} hour={hour} minute={0}>
                                                            <AddScheduleDialog startDate={day} startTime={{ hour, minute: 0 }}>
                                                                <div className="absolute inset-x-0 top-0 h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                                                            </AddScheduleDialog>
                                                        </DroppableTimeBlock>

                                                        <DroppableTimeBlock date={day} hour={hour} minute={15}>
                                                            <AddScheduleDialog startDate={day} startTime={{ hour, minute: 15 }}>
                                                                <div className="absolute inset-x-0 top-[24px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                                                            </AddScheduleDialog>
                                                        </DroppableTimeBlock>

                                                        <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>

                                                        <DroppableTimeBlock date={day} hour={hour} minute={30}>
                                                            <AddScheduleDialog startDate={day} startTime={{ hour, minute: 30 }}>
                                                                <div className="absolute inset-x-0 top-[48px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                                                            </AddScheduleDialog>
                                                        </DroppableTimeBlock>

                                                        <DroppableTimeBlock date={day} hour={hour} minute={45}>
                                                            <AddScheduleDialog startDate={day} startTime={{ hour, minute: 45 }}>
                                                                <div className="absolute inset-x-0 top-[72px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                                                            </AddScheduleDialog>
                                                        </DroppableTimeBlock>
                                                    </div>
                                                );
                                            })}

                                            {groupedSchedules.map((group, groupIndex) =>
                                                group.map(schedule => {
                                                    let style = getScheduleBlockStyle(
                                                        schedule,
                                                        day,
                                                        groupIndex,
                                                        groupedSchedules.length,
                                                        { from: earliestScheduleHour, to: latestScheduleHour }
                                                    );
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
                                    );
                                })}
                            </div>
                            <CalendarTimeline />
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </>
    );
}