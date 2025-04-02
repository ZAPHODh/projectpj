"use client";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useCalendar } from "../contexts/calendar";

export function ChangeBadgeVariantInput() {
    const { badgeVariant, setBadgeVariant } = useCalendar();

    return (
        <div className="space-y-2 ">
            <p className="text-sm font-medium">Estilo dos agendamentos</p>

            <Select value={badgeVariant} onValueChange={setBadgeVariant}>
                <SelectTrigger className="w-full md:w-[250px]">
                    <SelectValue placeholder="Selecione o estilo" />
                </SelectTrigger>

                <SelectContent align="end" position="popper" className="w-[200px]">
                    <SelectItem value="dot">
                        <span className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            Exibição vetorizada
                        </span>
                    </SelectItem>

                    <SelectItem value="colored">
                        <span className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-sm bg-blue-500" />
                            Exibição colorida
                        </span>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}