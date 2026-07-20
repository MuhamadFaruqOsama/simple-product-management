"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { persistAuthCookie } from "@/lib/auth/cookie"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) {
      setError("Konfigurasi autentikasi belum tersedia.")
      return
    }

    setLoading(true)
    setMessage(null)
    setError(null)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      persistAuthCookie(data.session)
      router.replace("/produk")
      return
    }

    setMessage("Registrasi berhasil. Silakan cek email untuk konfirmasi akun.")
  }

  return (
    <div className="min-h-screen px-2 pt-8 flex items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Buat akun baru untuk menggunakan aplikasi.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <form className="space-y-3" onSubmit={handleRegister}>
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
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Register"}
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
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
