"use client"

import type { Session } from "@supabase/supabase-js"

import { AUTH_COOKIE_NAME } from "./constants"

export function persistAuthCookie(session: Session | null) {
  if (typeof document === "undefined") {
    return
  }

  if (!session?.access_token) {
    clearAuthCookie()
    return
  }

  const maxAge = Math.max(0, session.expires_in ?? 60 * 60)
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(
    session.access_token
  )}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
}

export function clearAuthCookie() {
  if (typeof document === "undefined") {
    return
  }
  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`
}