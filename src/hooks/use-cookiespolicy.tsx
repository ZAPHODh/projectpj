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
    const [cookieState, setCookieState] = useState<CookieState>(CookieState.PENDING)

    useEffect(() => {
        const cookie = getCookie(COOKIE_NAME)
        setCookieState(cookie as CookieState || CookieState.PENDING)
    }, [])

    const updateConsent = (state: CookieState) => {
        const consent = state === CookieState.ACCEPTED ? 'granted' : 'denied'
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
            event: 'updateConsent',
            ad_storage: consent,
            analytics_storage: consent,
            ad_personalization: consent,
            ad_user_data: consent
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

    return {
        cookieState,
        onAcceptCookies: acceptCookies,
        onRejectCookies: rejectCookies,
    }
}