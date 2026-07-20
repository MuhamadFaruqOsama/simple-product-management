"use client"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          auth_user_id: string
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          auth_user_id: string
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          auth_user_id?: string
          email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product: {
        Row: {
          id: number
          user_id: number
          name: string
          stock: number
          price: number
          unit: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id?: number
          name: string
          stock: number
          price: number
          unit: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          name?: string
          stock?: number
          price?: number
          unit?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_sold: {
        Row: {
          id: number
          product_id: number
          total: number
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          product_id: number
          total: number
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          total?: number
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

let browserClient: SupabaseClient | null = null

export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey)
  }

  return browserClient
}

export type { Database }
