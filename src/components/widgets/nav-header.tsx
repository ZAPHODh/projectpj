'use client'

import { usePathname } from "next/navigation"
import { UserNav } from "./user-nav"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export default function NavHeader() {
    const pathname = usePathname()
    if (pathname.includes('finance') || pathname.includes('sign')) return null

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 hover:cursor-pointer"><Link href={'/'}>PROJECT</Link></h1>
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
    const t = useTranslations('header')
    const pathname = usePathname()

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
            <Link
                href="/finance"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.includes("/finance") ? "" : "text-muted-foreground"
                )}
            >
                {t('finance')}
            </Link>
            <Link
                href="/professionals"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.includes("/professionals") ? "" : "text-muted-foreground"
                )}
            >
                {t('professionals')}
            </Link>
            <Link
                href="/customers"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.includes("/customers") ? "" : "text-muted-foreground"
                )}
            >
                {t('customers')}
            </Link>
            <Link
                href="/calendar/week-view"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.includes("/calendar") ? "" : "text-muted-foreground"
                )}
            >
                {t('schedule')}
            </Link>
        </nav>
    )
}