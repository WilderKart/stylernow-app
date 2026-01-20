import { Database } from './supabase';

export type RoleType = Database['public']['Enums']['role_type'];

export interface User {
    id: string;
    email: string;
    role: RoleType;
    created_at?: string;
}

export type BarberiaPlan = string; // Plan is text in DB, enum in app logic often differs slightly or is loose

export type Barberia = Database['public']['Tables']['barberias']['Row'] & {
    banner_url?: string;
    logo_url?: string;
};
export type Sede = Database['public']['Tables']['sedes']['Row'];
export type Staff = Database['public']['Tables']['staff']['Row'] & {
    photo_url?: string;
    specialties?: string[];
    rating?: number;
    services_count?: number;
};
export type Servicio = Database['public']['Tables']['servicios']['Row'] & {
    image_url?: string;
};
export type Reserva = Database['public']['Tables']['reservas']['Row'];

// Helper for Status if needed, or rely on string
export type ReservaStatus = string;

// Re-export specific fields if key interfaces expect slightly different naming,
// or keep as Row if direct mapping works (which it should for standard usage).

