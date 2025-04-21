'use client';

import { setCookie, getCookie } from 'cookies-next'
import { useEffect, useState } from 'react'

const COOKIE_NAME = 'USER_CONSENT'

export enum CookieState {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

export const useCookiesPolicy = () => {
    const [cookieState, setCookieState] = useState<string | undefined>(undefined)

    useEffect(() => {
        const fetchCookie = async () => {
            const cookie = await getCookie(COOKIE_NAME)
            setCookieState(cookie as string | undefined)
        }
        fetchCookie()
    }, [])

    const updateConsent = (state: CookieState) => {
        const consent = state === CookieState.ACCEPTED ? 'granted' : 'denied'
        window.gtag('consent', 'update', {
            analytics_storage: consent,
            ad_storage: consent,
            ad_personalization: consent,
            ad_user_data: consent,
            fb_pixel: consent,
        })
    }

    const acceptCookies = () => {
        setCookieState(CookieState.ACCEPTED)
        setCookie(COOKIE_NAME, CookieState.ACCEPTED, { maxAge: 24 * 60 * 60 * 365 })
        updateConsent(CookieState.ACCEPTED)
    }

    const rejectCookies = () => {
        setCookieState(CookieState.REJECTED)
        setCookie(COOKIE_NAME, CookieState.REJECTED, { maxAge: 24 * 60 * 60 * 365 })
        updateConsent(CookieState.REJECTED)
    }

    useEffect(() => {
        if (!cookieState) setCookieState(CookieState.PENDING)
    }, [cookieState])

    return {
        cookieState,
        onAcceptCookies: acceptCookies,
        onRejectCookies: rejectCookies,
    }
}