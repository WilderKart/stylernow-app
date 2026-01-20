export type RoleType = 'superuser' | 'admin' | 'barberia' | 'staff' | 'cliente';

export interface User {
    id: string; // UUID
    email: string;
    role: RoleType;
    created_at?: string;
}

export type BarberiaPlan = 'ESSENTIAL' | 'STUDIO' | 'PRESTIGE' | 'SIGNATURE';

export interface Barberia {
    id: string; // UUID
    owner_id: string; // UUID
    name: string;
    plan: BarberiaPlan;
    status: 'active' | 'blocked' | 'past_due';
    banner_url?: string; // For UI
    logo_url?: string; // For UI
    created_at?: string;
}

export interface Sede {
    id: string;
    barberia_id: string;
    name: string;
    address?: string;
    phone?: string;
    created_at?: string;
}

export type StaffLevel = 'Junior' | 'Pro' | 'Expert' | 'Master';

export interface Staff {
    id: string;
    user_id?: string; // Optional link to auth user
    barberia_id: string;
    sede_id?: string;
    name: string;
    nivel: StaffLevel;
    porcentaje_ganancia: number; // 50.00
    photo_url?: string;
    is_active: boolean;
    specialties?: string[]; // UI helper, JSON in DB?
    rating?: number; // Calculated field
    services_count?: number; // Calculated field
}

export interface Servicio {
    id: string;
    barberia_id: string;
    name: string;
    price: number;
    duration_minutes: number;
    description?: string;
    image_url?: string; // UI helper
}

export type ReservaStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface Reserva {
    id: string;
    cliente_id: string;
    barberia_id: string;
    sede_id?: string;
    staff_id: string;
    servicio_id: string;
    start_time: string; // ISO String
    end_time: string; // ISO String
    status: ReservaStatus;
    wompi_reference?: string;
    created_at?: string;
}
