

import { ChangeBadgeVariantInput } from "@/calendar/components/change-badge-variant-input";
import { ChangeVisibleHoursInput } from "@/calendar/components/change-visible-houts-input";
import { ChangeWorkingHoursInput } from "@/calendar/components/change-working-hours-input";
import { CalendarProvider } from "@/calendar/contexts/calendar";
import { getProfessionals, getSchedules, getServices } from "@/calendar/requests";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getServerSession } from "@/lib/auth/server-session";
import { Settings } from "lucide-react";




export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession()
    const [schedules, professionals, services] = await Promise.all([getSchedules(session?.accessToken), getProfessionals(session?.accessToken), getServices(session?.accessToken)]);

    return (
        <CalendarProvider professionals={professionals} schedules={schedules} initialServices={services}>
            <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-8 py-4">
                {children}
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger className="flex-none gap-2 py-0 hover:no-underline">
                            <div className="flex items-center gap-2">
                                <Settings className="size-4" />
                                <p className="text-base font-semibold">Calendar settings</p>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent>
                            <div className="mt-4 flex flex-col gap-6">
                                <ChangeBadgeVariantInput />
                                <ChangeVisibleHoursInput />
                                <ChangeWorkingHoursInput />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </CalendarProvider>
    );
}