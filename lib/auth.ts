import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET
)

export async function createToken(payload: {
    id: number,
    username: string
}) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret)
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret)

        return payload
    } catch (error) {
        console.log(error)
        return null
    }
}