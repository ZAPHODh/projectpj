import { startOfWeek, addDays, format, parseISO, isSameDay, areIntervalsOverlapping } from "date-fns";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AddScheduleDialog } from "@/calendar/components/dialogs/add-schedule";
import { ScheduleBlock } from "@/calendar/components/week-and-day-view/schedule-block";



import type { ISchedule } from "@/calendar/interfaces";
import { useCalendar } from "@/calendar/contexts/calendar";
import { WeekViewMultiDaySchedulesRow } from "./week-view-multi-day-schedule-row";
import { getScheduleBlockStyle, groupSchedules } from "@/calendar/helper";
import { CalendarTimeline } from "./calendar-timeline";

interface IProps {
    singleDaySchedules: ISchedule[];
    multiDaySchedules: ISchedule[];
}

export function CalendarWeekView({ singleDaySchedules, multiDaySchedules }: IProps) {
    const { selectedDate } = useCalendar();

    const weekStart = startOfWeek(selectedDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <>
            <div className="flex flex-col items-center justify-center border-b py-4 text-sm text-muted-foreground sm:hidden">
                <p>Visualização semanal não disponível em dispositivos menores.</p>
                <p>Por favor, utilize a visualização diária ou mensal.</p>
            </div>

            <div className="hidden flex-col sm:flex">
                <div>
                    <WeekViewMultiDaySchedulesRow selectedDate={selectedDate} multiDaySchedules={multiDaySchedules} />

                    {/* Cabeçalho da semana */}
                    <div className="relative z-20 flex border-b">
                        <div className="w-18"></div>
                        <div className="grid flex-1 grid-cols-7 divide-x border-l">
                            {weekDays.map((day, index) => (
                                <span key={index} className="py-2 text-center text-xs font-medium text-muted-foreground">
                                    {format(day, "EEEE")} <span className="ml-1 font-semibold text-foreground">{format(day, "d")}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <ScrollArea className="h-[736px]" type="always">
                    <div className="flex">
                        {/* Coluna de horas */}
                        <div className="relative w-18">
                            {hours.map((hour, index) => (
                                <div key={hour} className="relative" style={{ height: "96px" }}>
                                    <div className="absolute -top-3 right-2 flex h-6 items-center">
                                        {index !== 0 && <span className="text-xs text-muted-foreground">{format(new Date().setHours(hour), "HH:mm")}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Grade da semana */}
                        <div className="relative flex-1 border-l">
                            <div className="grid grid-cols-7 divide-x">
                                {weekDays.map((day, dayIndex) => {
                                    const daySchedules = singleDaySchedules.filter(schedule =>
                                        isSameDay(parseISO(schedule.startDate), day) || isSameDay(parseISO(schedule.endDate), day)
                                    );
                                    const groupedSchedules = groupSchedules(daySchedules);

                                    return (
                                        <div key={dayIndex} className="relative">
                                            {hours.map((hour, index) => (
                                                <div key={hour} className="relative" style={{ height: "96px" }}>
                                                    {index !== 0 && <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>}
                                                    <AddScheduleDialog startDate={day} startTime={{ hour, minute: 0 }}>
                                                        <div className="absolute inset-x-0 top-0 h-[48px] cursor-pointer transition-colors hover:bg-accent/50" />
                                                    </AddScheduleDialog>

                                                    <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>

                                                    <AddScheduleDialog startDate={day} startTime={{ hour, minute: 30 }}>
                                                        <div className="absolute inset-x-0 top-[48px] h-[48px] cursor-pointer transition-colors hover:bg-accent/50" />
                                                    </AddScheduleDialog>
                                                </div>
                                            ))}

                                            {groupedSchedules.map((group, groupIndex) =>
                                                group.map(schedule => {
                                                    let style = getScheduleBlockStyle(schedule, day, groupIndex, groupedSchedules.length);
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