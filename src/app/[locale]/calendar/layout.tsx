

import { ChangeBadgeVariantInput } from "@/calendar/components/change-badge-variant-input";
import { CalendarProvider } from "@/calendar/contexts/calendar";
import { getProfessionals, getSchedules } from "@/calendar/requests";



export default async function Layout({ children }: { children: React.ReactNode }) {
    const [schedules, professionals] = await Promise.all([getSchedules(), getProfessionals()]);

    return (
        <CalendarProvider professionals={professionals} schedules={schedules}>
            <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-8 py-4">
                {children}
                <ChangeBadgeVariantInput />
            </div>
        </CalendarProvider>
    );
}