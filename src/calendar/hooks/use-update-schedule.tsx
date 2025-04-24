import { useCalendar } from "../contexts/calendar";
import { ISchedule } from "../interfaces";


export function useUpdateSchedule() {
    const { setSchedules } = useCalendar();

    // This is just and example, in a real scenario
    // you would call an API to update the event
    const updateSchedule = (schedule: ISchedule) => {
        const newSchedule: ISchedule = schedule;

        newSchedule.startDate = new Date(schedule.startDate).toISOString();
        newSchedule.endDate = new Date(schedule.endDate).toISOString();

        setSchedules(prev => {
            const index = prev.findIndex(s => s.id === schedule.id);
            if (index === -1) return prev;
            return [...prev.slice(0, index), schedule, ...prev.slice(index + 1)];
        });
    };

    return { updateSchedule };
}