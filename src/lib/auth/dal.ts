import 'server-only'

import { cookies } from 'next/headers'
import { decode } from './server-session'
import { redirect } from '@/i18n/navigation'
import { cache } from 'react'
import { getLocale } from 'next-intl/server'


export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value
    const locale = await getLocale()
    const session = await decode(cookie)

    if (!session?.user.id) {
        redirect({ href: '/auth/signin', locale })
    }

    return { isAuth: true, userId: session?.user.id }
})
