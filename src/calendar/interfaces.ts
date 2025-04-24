import type { TEventColor } from "@/calendar/types";

// export interface IProfessional {
//     id: string;
//     name: string;
//     picturePath: string | null;
// }

export interface IProfessional {
    id: string;
    name: string;
    categroy: string;
    cpf?: string;
    address?: string;
    profile?: string;
    phone?: string;
    email?: string;
    description?: string;
    salonId: string;
    birthDay?: Date;
    createdAt: Date;
    updatedAt: Date;
    picturePath: string | null;
    services?: Service[];
    salon?: Salon;
    sales?: Sale[];
    Commission: Commission[];
    schedules?: ISchedule[];
}

export interface ISchedule {
    id: number;
    startDate: string;
    endDate: string;
    title: string;
    color: TEventColor;
    description: string;
    professional: IProfessional;
    service: Service
    customer: Customer
}

export interface ICalendarCell {
    day: number;
    currentMonth: boolean;
    date: Date;
}