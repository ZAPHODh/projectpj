
import { AppSidebar } from "@/components/finance/navigation/app-sidebar";
import { SiteHeader } from "@/components/finance/navigation/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout(props: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            {props.children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}