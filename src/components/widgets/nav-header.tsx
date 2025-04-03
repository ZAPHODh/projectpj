'use client';

import { usePathname } from "next/navigation";
import { UserNav } from "./user-nav";
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/navigation";


export default function NavHeader() {
    const pathname = usePathname()
    if (pathname.includes('finance')) return null
    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <UserNav />
                </div>
            </div>
        </div>
    )
}

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/finance"
                className="text-sm font-medium transition-colors hover:text-primary"
            >
                Financeiro
            </Link>
            <Link
                href="/salon/"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Salão
            </Link>
            <Link
                href="/calendar/week-view"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Agenda
            </Link>
        </nav>
    )
}