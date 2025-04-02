import { cva } from "class-variance-authority";
import { format, differenceInMinutes, parseISO } from "date-fns";



import type { HTMLAttributes } from "react";
import type { ISchedule } from "@/calendar/interfaces";
import type { VariantProps } from "class-variance-authority";
import { useCalendar } from "@/calendar/contexts/calendar";
import { cn } from "@/lib/utils";
import { ScheduleDetailsDialog } from "../dialogs/detail-schedule";

const calendarWeekScheduleCardVariants = cva(
    "flex select-none flex-col gap-0.5 truncate whitespace-nowrap rounded-md border px-2 py-1.5 text-xs focus-visible:outline-offset-2",
    {
        variants: {
            color: {
                blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
                green: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
                red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
                yellow: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
                purple: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",
                orange: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300",
                "blue-dot": "border-b-primary bg-secondary text-t-primary [&_svg]:fill-blue-600",
                "green-dot": "border-b-primary bg-secondary text-t-primary [&_svg]:fill-green-600",
                "red-dot": "border-b-primary bg-secondary text-t-primary [&_svg]:fill-red-600",
                "orange-dot": "border-b-primary bg-secondary text-t-primary [&_svg]:fill-orange-600",
                "purple-dot": "border-b-primary bg-secondary text-t-primary [&_svg]:fill-purple-600",
                "yellow-dot": "border-b-primary bg-secondary text-t-primary [&_svg]:fill-yellow-600",
            },
        },
        defaultVariants: {
            color: "blue-dot",
        },
    }
);

interface IProps extends HTMLAttributes<HTMLDivElement>, Omit<VariantProps<typeof calendarWeekScheduleCardVariants>, "color"> {
    schedule: ISchedule;
}

export function ScheduleBlock({ schedule, className }: IProps) {
    const { badgeVariant } = useCalendar();

    const start = parseISO(schedule.startDate);
    const end = parseISO(schedule.endDate);
    const durationInMinutes = differenceInMinutes(end, start);
    const heightInPixels = (durationInMinutes / 60) * 96 - 8;

    const color = (badgeVariant === "dot" ? `${schedule.color}-dot` : schedule.color) as VariantProps<typeof calendarWeekScheduleCardVariants>["color"];
    console.log(color)
    const calendarWeekScheduleCardClasses = cn(
        calendarWeekScheduleCardVariants({ color, className }),
        durationInMinutes < 35 && "py-0 justify-center hover:cursor-pointer"
    );

    return (
        <ScheduleDetailsDialog schedule={schedule}>
            <div role="button" tabIndex={0} className={calendarWeekScheduleCardClasses} style={{ height: `${heightInPixels}px` }}>
                <div className="flex items-center gap-1.5 truncate">
                    {badgeVariant === "dot" && (
                        <svg width="8" height="8" viewBox="0 0 8 8" className="shrink-0">
                            <circle cx="4" cy="4" r="4" />
                        </svg>
                    )}

                    <p className="truncate font-semibold">{schedule.title}</p>
                </div>

                {durationInMinutes > 25 && (
                    <p>
                        {format(start, "HH:mm")} - {format(end, "HH:mm")}
                    </p>
                )}
            </div>
        </ScheduleDetailsDialog>
    );
}