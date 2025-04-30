'use client';

import { SalonConfigForm } from "@/components/account/salon/salon-form"
import { Separator } from "@/components/ui/separator"
import { TourCard } from "@/components/widgets/tour";
import { salonConfigSteps } from "@/lib/tour/steps/salon";

import { useTranslations } from "next-intl"
import { Onborda, OnbordaProvider } from "onborda";

export default function Page() {
    const t = useTranslations("salon.config")

    return (
        <OnbordaProvider>
            <Onborda
                steps={salonConfigSteps}
                cardComponent={TourCard}
                shadowOpacity="0.8"
                cardTransition={{ type: "spring", stiffness: 100, damping: 10 }}
            >
                <div className="space-y-6" >
                    <div>
                        <h3 className="text-lg font-medium" > {t('title')} </h3>
                        < p className="text-sm text-muted-foreground" >
                            {t('description')}
                        </p>
                    </div>
                    < Separator />
                    <SalonConfigForm />
                </div>
            </Onborda>
        </OnbordaProvider>

    )
}