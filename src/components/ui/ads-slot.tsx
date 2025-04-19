'use client'
import { useEffect } from 'react'
import Script from 'next/script'

interface AdSlotProps {
    client: string
    slot: string
}

export function AdSlot({ client, slot }: AdSlotProps) {
    // 1) Carrega a lib do AdSense (só precisa uma vez por página/layout)
    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`

    useEffect(() => {
        // 3) Quando o <ins> já estiver no DOM, dispara o anúncio
        if ((window as any).adsbygoogle) {
            ; (window as any).adsbygoogle.push({})
        }
    }, [])

    return (
        <>
            {/* 1) O script que carrega a lib adsbygoogle.js */}
            <Script
                id={`adsense-lib-${client}`}
                strategy="afterInteractive"
                src={src}
                async
                crossOrigin="anonymous"
            />

            {/* 2) Container do anúncio */}
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </>
    )
}
