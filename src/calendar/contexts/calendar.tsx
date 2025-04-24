"use client";

import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

import type { ISchedule, IProfessional } from "@/calendar/interfaces";
import { TVisibleHours, TWorkingHours } from "../types";

interface ICalendarContext {
    selectedDate: Date;
    setSelectedDate: (date: Date | undefined) => void;
    selectedProfessionalId: IProfessional["id"] | "all";
    setSelectedProfessionalId: (userId: IProfessional["id"] | "all") => void;
    badgeVariant: "dot" | "colored";
    setBadgeVariant: (variant: "dot" | "colored") => void;
    professionals: IProfessional[];
    schedules: ISchedule[];
    setSchedules: Dispatch<SetStateAction<ISchedule[]>>
    services: Service[];
    workingHours: TWorkingHours;
    setWorkingHours: Dispatch<SetStateAction<TWorkingHours>>;
    visibleHours: TVisibleHours;
    setVisibleHours: Dispatch<SetStateAction<TVisibleHours>>;

}
const WORKING_HOURS = {
    0: { from: 0, to: 0 },
    1: { from: 8, to: 17 },
    2: { from: 8, to: 17 },
    3: { from: 8, to: 17 },
    4: { from: 8, to: 17 },
    5: { from: 8, to: 17 },
    6: { from: 8, to: 12 },
};
const VISIBLE_HOURS = { from: 7, to: 18 };

const CalendarContext = createContext({} as ICalendarContext);

export function CalendarProvider({ children, professionals, schedules, initialServices }: { children: React.ReactNode; professionals: IProfessional[]; schedules: ISchedule[]; initialServices: Service[] }) {
    const [badgeVariant, setBadgeVariant] = useState<"dot" | "colored">("dot");
    const [visibleHours, setVisibleHours] = useState<TVisibleHours>(VISIBLE_HOURS);
    const [workingHours, setWorkingHours] = useState<TWorkingHours>(WORKING_HOURS);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedProfessionalId, setSelectedProfessionalId] = useState<IProfessional["id"] | "all">("all");
    const [cachedSchedules, setCachedSchedules] = useState<ISchedule[]>(schedules)
    const [services] = useState<Service[]>(initialServices)
    const handleSelectDate = (date: Date | undefined) => {
        if (!date) return;
        setSelectedDate(date);
    };
    return (
        <CalendarContext.Provider
            value={{
                visibleHours,
                setVisibleHours,
                workingHours,
                setWorkingHours, selectedDate, setSelectedDate: handleSelectDate, selectedProfessionalId, setSelectedProfessionalId, badgeVariant, setBadgeVariant, professionals, schedules: cachedSchedules, setSchedules: setCachedSchedules, services
            }}
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