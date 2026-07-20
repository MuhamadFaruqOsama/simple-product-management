"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { persistAuthCookie } from "@/lib/auth/cookie"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const nextPath = searchParams.get("next") || "/produk"

  useEffect(() => {
    if (!supabase) {
      return
    }

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        persistAuthCookie(data.session)
        router.replace(nextPath)
      }
    }

    void checkSession()
  }, [nextPath, router, supabase])

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) {
      setError("Konfigurasi autentikasi belum tersedia.")
      return
    }

    setLoading(true)
    setError(null)
    setMessage(null)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    persistAuthCookie(data.session)
    setMessage("Login berhasil. Mengarahkan ke halaman produk...")
    router.replace(nextPath)
  }

  return (
    <div className="min-h-screen px-2 pt-8 flex items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Masuk untuk mengakses halaman produk.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <form className="space-y-3" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Login"}
            </Button>
          </form>

          {message && (
            <div className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
