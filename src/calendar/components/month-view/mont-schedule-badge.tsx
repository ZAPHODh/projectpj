import { cva } from "class-variance-authority";
import { endOfDay, isSameDay, parseISO, startOfDay } from "date-fns";

import type { ISchedule } from "@/calendar/interfaces";
import type { VariantProps } from "class-variance-authority";
import { useCalendar } from "@/calendar/contexts/calendar";
import { ScheduleDetailsDialog } from "../dialogs/detail-schedule";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/helper";
import { useLocale } from "next-intl";

const scheduleBadgeVariants = cva(
    "mx-1 flex h-6.5 w-auto select-none items-center justify-between gap-1.5 truncate whitespace-nowrap rounded-md border px-2 text-xs",
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
            multiDayPosition: {
                first: "relative z-10 mr-0 w-[calc(100%_+_1px)] rounded-r-none border-r-0 [&>span]:mr-2.5",
                middle: "relative z-10 mx-0 w-[calc(100%_+_1px)] rounded-none border-x-0",
                last: "ml-0 rounded-l-none border-l-0",
                none: "",
            },
        },
        defaultVariants: {
            color: "blue-dot",
        },
    }
);

interface IProps extends Omit<VariantProps<typeof scheduleBadgeVariants>, "color" | "multiDayPosition"> {
    schedule: ISchedule;
    cellDate: Date;
    scheduleCurrentDay?: number;
    scheduleTotalDays?: number;
    className?: string;
    position?: "first" | "middle" | "last" | "none";
}

export function MonthScheduleBadge({
    schedule,
    cellDate,
    scheduleCurrentDay,
    scheduleTotalDays,
    className,
    position: propPosition,
}: IProps) {
    const { badgeVariant } = useCalendar();
    const locale = useLocale()
    const itemStart = startOfDay(parseISO(schedule.startDate));
    const itemEnd = endOfDay(parseISO(schedule.endDate));

    if (cellDate < itemStart || cellDate > itemEnd) return null;

    let position: "first" | "middle" | "last" | "none" | undefined;

    if (propPosition) {
        position = propPosition;
    } else if (scheduleCurrentDay && scheduleTotalDays) {
        position = "none";
    } else if (isSameDay(itemStart, itemEnd)) {
        position = "none";
    } else if (isSameDay(cellDate, itemStart)) {
        position = "first";
    } else if (isSameDay(cellDate, itemEnd)) {
        position = "last";
    } else {
        position = "middle";
    }

    const renderBadgeText = ["first", "none"].includes(position);
    const color = (badgeVariant === "dot" ? `${schedule.color}-dot` : schedule.color) as VariantProps<typeof scheduleBadgeVariants>["color"];

    return (
        <ScheduleDetailsDialog schedule={schedule}>
            <div role="button" tabIndex={0} className={cn(scheduleBadgeVariants({ color, multiDayPosition: position, className }))}>
                <div className="flex items-center gap-1.5 truncate">
                    {!["middle", "last"].includes(position) && badgeVariant === "dot" && (
                        <svg width="8" height="8" viewBox="0 0 8 8" className="shrink-0">
                            <circle cx="4" cy="4" r="4" />
                        </svg>
                    )}

                    {renderBadgeText && (
                        <p className="flex-1 truncate font-semibold">
                            {scheduleCurrentDay && (
                                <span className="text-xs">
                                    Dia {scheduleCurrentDay} de {scheduleTotalDays} •{" "}
                                </span>
                            )}
                            {schedule.title}
                        </p>
                    )}
                </div>

                {renderBadgeText && <span>{formatDate(new Date(schedule.startDate), locale, "HH:mm")}</span>}
            </div>
        </ScheduleDetailsDialog>
    );
}