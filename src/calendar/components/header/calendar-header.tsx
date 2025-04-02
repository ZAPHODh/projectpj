import Link from "next/link";
import { Columns, Grid3X3, List, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProfessionalSelect } from "@/calendar/components/header/professional-select";
import { TodayButton } from "@/calendar/components/header/today-button";
import { DateNavigator } from "@/calendar/components/header/date-navigator";
import { AddScheduleDialog } from "@/calendar/components/dialogs/add-schedule";

import type { ISchedule } from "@/calendar/interfaces";
import type { TCalendarView } from "@/calendar/types";

interface IProps {
    view: TCalendarView;
    schedules: ISchedule[];
}

export function CalendarHeader({ view, schedules }: IProps) {
    return (
        <header className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
                <TodayButton />
                <DateNavigator view={view} schedules={schedules} />
            </div>

            <div className="flex items-center justify-between gap-3">
                <div className="flex gap-1.5">
                    <Button asChild variant="outline" size="sm" aria-label="Visualização diária">
                        <Link href="/calendar/day-view">
                            <List className="h-4 w-4" />
                        </Link>
                    </Button>

                    <Button asChild variant="outline" size="sm" aria-label="Visualização semanal" className="hidden md:flex">
                        <Link href="/calendar/week-view">
                            <Columns className="h-4 w-4" />
                        </Link>
                    </Button>

                    <Button asChild variant="outline" size="sm" aria-label="Visualização mensal">
                        <Link href="/calendar/month-view">
                            <Grid3X3 className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <ProfessionalSelect />

                    <AddScheduleDialog>
                        <Button size="icon" className="gap-1 rounded-full">
                            <Plus className="h-4 w-4" />
                            {/* Novo Agendamento */}
                        </Button>
                    </AddScheduleDialog>
                </div>
            </div>
        </header>
    );
}