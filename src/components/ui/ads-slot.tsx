// components/AdsSlot.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/providers/session";

export const AdsSlot = ({ adClient, adSlot }: { adClient: string; adSlot: string }) => {
    const { session } = useSession();
    const [adLoaded, setAdLoaded] = useState(false);

    useEffect(() => {
        const loadAd = () => {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                console.log('Ad initialized:', adSlot);
                setAdLoaded(true);
            } catch (error) {
                console.error('Ad error:', error);
            }
        };

        if (typeof window !== "undefined" && !window.adsbygoogle) {
            const script = document.createElement('script');
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            script.async = true;
            script.onload = loadAd;
            document.head.appendChild(script);
        } else if (window.adsbygoogle) {
            loadAd();
        }
    }, [adClient, adSlot]);

    if (session && session.user.subscriptionRole !== null) {
        return null;
    }

    return (
        <div className="ad-container" data-ad-status={adLoaded ? 'loaded' : 'loading'}>
            <ins className="adsbygoogle"
                style={{ display: 'block', border: '1px solid red' }}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-adtest={process.env.NODE_ENV === 'development' ? 'on' : 'off'}>
            </ins>
        </div>
    );
};