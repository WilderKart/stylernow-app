export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      barberias: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string
          plan: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
          plan?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          plan?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "barberias_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bloqueos_horarios: {
        Row: {
          approved_by: string | null
          end_date: string
          id: string
          reason: string | null
          staff_id: string
          start_date: string
        }
        Insert: {
          approved_by?: string | null
          end_date: string
          id?: string
          reason?: string | null
          staff_id: string
          start_date: string
        }
        Update: {
          approved_by?: string | null
          end_date?: string
          id?: string
          reason?: string | null
          staff_id?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "bloqueos_horarios_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bloqueos_horarios_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      comisiones_clientes_nuevos: {
        Row: {
          barberia_id: string
          created_at: string | null
          estado: string | null
          id: string
          monto: number
          reserva_id: string
        }
        Insert: {
          barberia_id: string
          created_at?: string | null
          estado?: string | null
          id?: string
          monto: number
          reserva_id: string
        }
        Update: {
          barberia_id?: string
          created_at?: string | null
          estado?: string | null
          id?: string
          monto?: number
          reserva_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comisiones_clientes_nuevos_barberia_id_fkey"
            columns: ["barberia_id"]
            isOneToOne: false
            referencedRelation: "barberias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comisiones_clientes_nuevos_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      facturas: {
        Row: {
          barberia_id: string
          created_at: string | null
          estado: string | null
          id: string
          pdf_url: string | null
          periodo_mes: string
          total_comisiones: number
          total_pagar: number | null
          total_suscripcion: number
        }
        Insert: {
          barberia_id: string
          created_at?: string | null
          estado?: string | null
          id?: string
          pdf_url?: string | null
          periodo_mes: string
          total_comisiones: number
          total_pagar?: number | null
          total_suscripcion: number
        }
        Update: {
          barberia_id?: string
          created_at?: string | null
          estado?: string | null
          id?: string
          pdf_url?: string | null
          periodo_mes?: string
          total_comisiones?: number
          total_pagar?: number | null
          total_suscripcion?: number
        }
        Relationships: [
          {
            foreignKeyName: "facturas_barberia_id_fkey"
            columns: ["barberia_id"]
            isOneToOne: false
            referencedRelation: "barberias"
            referencedColumns: ["id"]
          },
        ]
      }
      horarios: {
        Row: {
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          staff_id: string
          start_time: string
        }
        Insert: {
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          staff_id: string
          start_time: string
        }
        Update: {
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          staff_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "horarios_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          barbershop_name: string
          consent: boolean
          created_at: string
          email: string
          id: string
          name: string
          phone: string
        }
        Insert: {
          barbershop_name: string
          consent?: boolean
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
        }
        Update: {
          barbershop_name?: string
          consent?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      pagos: {
        Row: {
          created_at: string | null
          id: string
          monto: number
          reserva_id: string
          status: string | null
          wompi_transaction_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          monto: number
          reserva_id: string
          status?: string | null
          wompi_transaction_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          monto?: number
          reserva_id?: string
          status?: string | null
          wompi_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json
          id: string
          limits: Json
          name: string
          price_cop: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json
          id?: string
          limits?: Json
          name: string
          price_cop: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json
          id?: string
          limits?: Json
          name?: string
          price_cop?: number
        }
        Relationships: []
      }
      propinas: {
        Row: {
          created_at: string | null
          id: string
          monto: number
          reserva_id: string
          staff_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          monto: number
          reserva_id: string
          staff_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          monto?: number
          reserva_id?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "propinas_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propinas_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: {
          barberia_id: string
          checkin_at: string | null
          cliente_id: string
          created_at: string | null
          end_time: string
          id: string
          sede_id: string | null
          service_id: string
          staff_id: string
          start_time: string
          status: string
          updated_at: string | null
          wompi_reference: string | null
        }
        Insert: {
          barberia_id: string
          checkin_at?: string | null
          cliente_id: string
          created_at?: string | null
          end_time: string
          id?: string
          sede_id?: string | null
          service_id: string
          staff_id: string
          start_time: string
          status?: string
          updated_at?: string | null
          wompi_reference?: string | null
        }
        Update: {
          barberia_id?: string
          checkin_at?: string | null
          cliente_id?: string
          created_at?: string | null
          end_time?: string
          id?: string
          sede_id?: string | null
          service_id?: string
          staff_id?: string
          start_time?: string
          status?: string
          updated_at?: string | null
          wompi_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservas_barberia_id_fkey"
            columns: ["barberia_id"]
            isOneToOne: false
            referencedRelation: "barberias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_servicio_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "servicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      sedes: {
        Row: {
          address: string | null
          barberia_id: string
          created_at: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          barberia_id: string
          created_at?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          barberia_id?: string
          created_at?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sedes_barberia_id_fkey"
            columns: ["barberia_id"]
            isOneToOne: false
            referencedRelation: "barberias"
            referencedColumns: ["id"]
          },
        ]
      }
      servicios: {
        Row: {
          barberia_id: string
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          name: string
          price: number
        }
        Insert: {
          barberia_id: string
          created_at?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          name: string
          price: number
        }
        Update: {
          barberia_id?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "servicios_barberia_id_fkey"
            columns: ["barberia_id"]
            isOneToOne: false
            referencedRelation: "barberias"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          barberia_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          nivel: string | null
          porcentaje_ganancia: number | null
          sede_id: string | null
          user_id: string | null
        }
        Insert: {
          barberia_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          nivel?: string | null
          porcentaje_ganancia?: number | null
          sede_id?: string | null
          user_id?: string | null
        }
        Update: {
          barberia_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          nivel?: string | null
          porcentaje_ganancia?: number | null
          sede_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_barberia_id_fkey"
            columns: ["barberia_id"]
            isOneToOne: false
            referencedRelation: "barberias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_earnings: {
        Row: {
          created_at: string | null
          id: string
          periodo_end: string
          periodo_start: string
          staff_id: string
          status: string | null
          total_pagar: number | null
          total_propinas: number | null
          total_servicios: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          periodo_end: string
          periodo_start: string
          staff_id: string
          status?: string | null
          total_pagar?: number | null
          total_propinas?: number | null
          total_servicios?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          periodo_end?: string
          periodo_start?: string
          staff_id?: string
          status?: string | null
          total_pagar?: number | null
          total_propinas?: number | null
          total_servicios?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_earnings_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          barberia_id: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          updated_at: string | null
        }
        Insert: {
          barberia_id?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          updated_at?: string | null
        }
        Update: {
          barberia_id?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_barberia_id_fkey"
            columns: ["barberia_id"]
            isOneToOne: true
            referencedRelation: "barberias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      suscripciones: {
        Row: {
          barberia_id: string
          created_at: string | null
          estado: string | null
          id: string
          plan: string
          precio_mensual: number
          renovacion_next: string
        }
        Insert: {
          barberia_id: string
          created_at?: string | null
          estado?: string | null
          id?: string
          plan: string
          precio_mensual: number
          renovacion_next: string
        }
        Update: {
          barberia_id?: string
          created_at?: string | null
          estado?: string | null
          id?: string
          plan?: string
          precio_mensual?: number
          renovacion_next?: string
        }
        Relationships: [
          {
            foreignKeyName: "suscripciones_barberia_id_fkey"
            columns: ["barberia_id"]
            isOneToOne: false
            referencedRelation: "barberias"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: Database["public"]["Enums"]["role_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          role?: Database["public"]["Enums"]["role_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["role_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["role_type"]
      }
    }
    Enums: {
      AppointmentStatus:
        | "PENDING"
        | "CONFIRMED"
        | "COMPLETED"
        | "CANCELLED"
        | "NO_SHOW"
      LeadStatus: "PENDING" | "CONTACTED" | "APPROVED" | "REJECTED"
      PaymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
      role_type:
        | "superuser"
        | "admin"
        | "barberia"
        | "staff"
        | "cliente"
        | "manager"
      subscription_status:
        | "active"
        | "past_due"
        | "canceled"
        | "trialing"
        | "blocked"
      SubscriptionStatus: "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELED"
      UserRole: "CLIENT" | "BARBER" | "ADMIN" | "SUPER_ROOT" | "MANICURIST"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      AppointmentStatus: [
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED",
        "NO_SHOW",
      ],
      LeadStatus: ["PENDING", "CONTACTED", "APPROVED", "REJECTED"],
      PaymentStatus: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      role_type: [
        "superuser",
        "admin",
        "barberia",
        "staff",
        "cliente",
        "manager",
      ],
      subscription_status: [
        "active",
        "past_due",
        "canceled",
        "trialing",
        "blocked",
      ],
      SubscriptionStatus: ["TRIAL", "ACTIVE", "PAST_DUE", "CANCELED"],
      UserRole: ["CLIENT", "BARBER", "ADMIN", "SUPER_ROOT", "MANICURIST"],
    },
  },
} as const
