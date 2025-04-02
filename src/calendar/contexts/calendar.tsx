"use client";

import { createContext, useContext, useState } from "react";

import type { ISchedule, IProfessional } from "@/calendar/interfaces";

interface ICalendarContext {
    selectedDate: Date;
    setSelectedDate: (date: Date | undefined) => void;
    selectedProfessionalId: IProfessional["id"] | "all";
    setSelectedProfessionalId: (userId: IProfessional["id"] | "all") => void;
    badgeVariant: "dot" | "colored";
    setBadgeVariant: (variant: "dot" | "colored") => void;
    professionals: IProfessional[];
    schedules: ISchedule[];
}

const CalendarContext = createContext({} as ICalendarContext);

export function CalendarProvider({ children, professionals, schedules }: { children: React.ReactNode; professionals: IProfessional[]; schedules: ISchedule[] }) {
    const [badgeVariant, setBadgeVariant] = useState<"dot" | "colored">("dot");

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedProfessionalId, setSelectedProfessionalId] = useState<IProfessional["id"] | "all">("all");

    const handleSelectDate = (date: Date | undefined) => {
        console.log(date)
        if (!date) return;
        setSelectedDate(date);
    };

    return (
        <CalendarContext.Provider
            value={{ selectedDate, setSelectedDate: handleSelectDate, selectedProfessionalId, setSelectedProfessionalId, badgeVariant, setBadgeVariant, professionals, schedules }}
        >
            {children}
        </CalendarContext.Provider>
    );
}

export function useCalendar(): ICalendarContext {
    const context = useContext(CalendarContext);
    if (!context) throw new Error("useCalendar must be used within a CalendarProvider.");
    return context;
}