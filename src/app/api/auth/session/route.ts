import { SESSION_COOKIE_NAME } from "@/lib/auth/helper";
import { decode } from "@/lib/auth/server-session";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookie = (await cookies()).get(SESSION_COOKIE_NAME);
    if (!cookie) {
        return NextResponse.json({}, { status: 401 });
    }

    const session = await decode(cookie.value);
    if (!session) {
        (await cookies()).delete(SESSION_COOKIE_NAME);
        return NextResponse.json({}, { status: 401 });
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${session.accessToken}` },
        }
    );

    const user = await res.json();
    if (user && res.ok) {
        return NextResponse.json(user, { status: 200 });
    }

    (await cookies()).delete(SESSION_COOKIE_NAME);
    return NextResponse.json({}, { status: 401 });
}