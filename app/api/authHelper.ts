import { verifyToken } from "@/lib/auth"
import { NextRequest } from "next/server"

export async function isAuthenticated(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value
    
    if(!token) {
        return {
            status: false,
            payload: null,
            message: "unauthorized"
        }
    }
    
    const payload = await verifyToken(token)
    
    if(!payload) {
        return {
            status: false,
            payload: null,
            message: "unauthorized"
        }
    }

    return {
        status: true,
        payload,
        message: "authorized"
    }
} 