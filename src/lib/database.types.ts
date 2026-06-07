export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      waitlist: {
        Row: {
          id: string
          email: string
          name: string | null
          company: string | null
          use_case: string | null
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          company?: string | null
          use_case?: string | null
          source?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          company?: string | null
          use_case?: string | null
          source?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
