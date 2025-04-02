"use client";

import { useMemo } from "react";
import { isSameDay, parseISO } from "date-fns";


import { CalendarMonthView } from "@/calendar/components/month-view/calendar-month-view";
import { CalendarDayView } from "@/calendar/components/week-and-day-view/calendar-day-view";
import { CalendarWeekView } from "@/calendar/components/week-and-day-view/calendar-week-view";

import type { TCalendarView } from "@/calendar/types";
import { useCalendar } from "../contexts/calendar";
import { CalendarHeader } from "./header/calendar-header";

interface IProps {
    view: TCalendarView;
}

export function ClientContainer({ view }: IProps) {
    const { selectedDate, selectedProfessionalId, schedules } = useCalendar();

    const filteredSchedules = useMemo(() => {
        return schedules.filter(schedule => {
            const itemStartDate = new Date(schedule.startDate);
            const itemEndDate = new Date(schedule.endDate);

            const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

            const isInSelectedMonth = itemStartDate <= monthEnd && itemEndDate >= monthStart;
            const isProfessionalMatch = selectedProfessionalId === "all" || schedule.professional.id === selectedProfessionalId;
            return isInSelectedMonth && isProfessionalMatch;
        });
    }, [selectedDate, selectedProfessionalId, schedules]);

    const singleDaySchedules = filteredSchedules.filter(schedule => {
        const startDate = parseISO(schedule.startDate);
        const endDate = parseISO(schedule.endDate);
        return isSameDay(startDate, endDate);
    });

    const multiDaySchedules = filteredSchedules.filter(schedule => {
        const startDate = parseISO(schedule.startDate);
        const endDate = parseISO(schedule.endDate);
        return !isSameDay(startDate, endDate);
    });

    return (
        <div className="rounded-xl border">
            <CalendarHeader view={view} schedules={filteredSchedules} />
            {view === "month" && <CalendarMonthView singleDaySchedules={singleDaySchedules} multiDaySchedules={multiDaySchedules} />}
            {view === "week" && <CalendarWeekView singleDaySchedules={singleDaySchedules} multiDaySchedules={multiDaySchedules} />}
            {view === "day" && <CalendarDayView singleDaySchedules={singleDaySchedules} multiDaySchedules={multiDaySchedules} />}
        </div>
    );
}