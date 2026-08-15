import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value
    const pathname = request.nextUrl.pathname

    if(!token) {
        if(pathname === "/login") {
            return NextResponse.next()
        }

        return NextResponse.redirect(new URL("/login", request.url))
    }

    const payload = await verifyToken(token)

    if(!payload) {
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("token")
        return response
    }

    if(pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url))
    } 

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ]
}