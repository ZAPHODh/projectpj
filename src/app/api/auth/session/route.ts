import { SESSION_COOKIE_MAX_AGE, SESSION_COOKIE_NAME } from "@/lib/auth/helper";
import { decode, encode } from "@/lib/auth/server-session";
import { Session } from "@/lib/auth/types";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookie = (await cookies()).get(SESSION_COOKIE_NAME);
    if (!cookie) {
        return NextResponse.json({}, { status: 401 });
    }

    const payload = await decode(cookie.value);
    if (!payload) {
        (await cookies()).delete(SESSION_COOKIE_NAME);
        return NextResponse.json({}, { status: 401 });
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh-token`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${payload.accessToken}` },
        }
    );

    const session: Session | null = await res.json();
    if (session && res.ok) {
        const newSession = await encode(session)
        const expires = new Date(Date.now() + SESSION_COOKIE_MAX_AGE)

        const cookieStore = await cookies()
        cookieStore.set('session', newSession, {
            httpOnly: true,
            secure: true,
            expires: expires,
            sameSite: 'lax',
            path: '/',
        })
        return NextResponse.json(session.user, { status: 200 });
    }

    (await cookies()).delete(SESSION_COOKIE_NAME);
    return NextResponse.json({}, { status: 401 });
}