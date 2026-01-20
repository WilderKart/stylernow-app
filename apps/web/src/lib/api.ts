import { createBrowserClient } from "@supabase/ssr";
import { Barberia, Reserva, Staff, Servicio, User } from "@/types/db";

// Singleton Client for Client Components
const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- BARBERIAS ---

export async function getBarberias(): Promise<Barberia[]> {
    const { data, error } = await supabase
        .from('barberias')
        .select('*')
        .eq('status', 'active');

    if (error) {
        console.error('Error fetching barberias:', error);
        return [];
    }
    return data as Barberia[];
}

export async function getBarberiaById(id: string): Promise<Barberia | null> {
    const { data, error } = await supabase
        .from('barberias')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data as Barberia;
}

// --- STAFF ---

export async function getStaffByBarberia(barberiaId: string): Promise<Staff[]> {
    const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('barberia_id', barberiaId)
        .eq('is_active', true);

    if (error) return [];
    return data as Staff[];
}

// --- SERVICIOS ---

export async function getServiciosByBarberia(barberiaId: string): Promise<Servicio[]> {
    const { data, error } = await supabase
        .from('servicios')
        .select('*')
        .eq('barberia_id', barberiaId);

    if (error) return [];
    return data as Servicio[];
}

// --- RESERVAS (CLIENTE FLOW) ---

export interface CreateReservaParams {
    staff_id: string;
    service_id: string;
    start_time: string; // ISO string
}

export interface CreateReservaResponse {
    data: Reserva;
    payment_info: {
        reference: string;
        amount_in_cents: number;
        currency: string;
        public_key: string;
    }
}

export async function createReserva(params: CreateReservaParams): Promise<CreateReservaResponse> {
    const { data, error } = await supabase.functions.invoke('create_reserva', {
        body: params
    });

    if (error) throw new Error(error.message || "Error al conectar con el servidor.");
    if (data?.error) throw new Error(data.error);

    return data as CreateReservaResponse;
}

// --- MY RESERVATIONS (CLIENT) ---

export async function getMyReservations(): Promise<Reserva[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('reservas')
        .select(`
            *,
            barberias (name),
            servicios (name, price, duration_minutes),
            staff (name)
        `)
        .eq('cliente_id', user.id)
        .order('start_time', { ascending: false });

    if (error) return [];
    return data as any as Reserva[];
}

// --- STAFF DASHBOARD ---

export async function getStaffAppointments(): Promise<Reserva[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: staffRecord } = await supabase
        .from('staff')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!staffRecord) return [];

    const todayStart = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('reservas')
        .select(`
            *,
            servicios (name, price),
            users (email)
        `)
        .eq('staff_id', staffRecord.id)
        .gte('start_time', todayStart)
        .order('start_time', { ascending: true });

    if (error) return [];
    return data as any as Reserva[];
}

export interface StaffEarningsReal {
    total_pagar: number;
    total_servicios: number;
    total_propinas: number;
}

export async function getStaffDailyEarnings(): Promise<StaffEarningsReal> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { total_pagar: 0, total_servicios: 0, total_propinas: 0 };

    const { data: staffRecord } = await supabase.from('staff').select('id').eq('user_id', user.id).single();
    if (!staffRecord) return { total_pagar: 0, total_servicios: 0, total_propinas: 0 };

    const todayStart = new Date().toISOString().split('T')[0];

    // Services
    const { data: completedReservas } = await supabase
        .from('reservas')
        .select(`servicios (price)`)
        .eq('staff_id', staffRecord.id)
        .eq('status', 'completed')
        .gte('created_at', todayStart);

    // Propinas
    const { data: propinas } = await supabase
        .from('propinas')
        .select('monto')
        .eq('staff_id', staffRecord.id)
        .gte('created_at', todayStart);

    const totalServices = completedReservas?.reduce((acc: number, curr: any) => acc + (curr.servicios?.price || 0), 0) || 0;
    const totalTips = propinas?.reduce((acc: number, curr: any) => acc + (curr.monto || 0), 0) || 0;

    return {
        total_servicios: totalServices,
        total_propinas: totalTips,
        total_pagar: totalServices + totalTips
    };
}

// --- BARBERIA DASHBOARD ---

export interface AdminKPIsReal {
    monthly_revenue: number;
    total_appointments: number;
    active_staff: number;
    occupancy_rate: number;
}

export async function getBarberiaKPIs(): Promise<AdminKPIsReal> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { monthly_revenue: 0, total_appointments: 0, active_staff: 0, occupancy_rate: 0 };

    // Get Barberia owned by user
    const { data: barberia } = await supabase.from('barberias').select('id').eq('owner_id', user.id).single();
    if (!barberia) return { monthly_revenue: 0, total_appointments: 0, active_staff: 0, occupancy_rate: 0 };

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const startOfMonthIso = startOfMonth.toISOString();

    // 1. Revenue (From Pagos linked to Reserves in this barberia)
    // Note: RLS 'Owner view stats pagos' allows this.
    const { data: pagos } = await supabase
        .from('pagos')
        .select('monto, reserva_id, reservas!inner(barberia_id)')
        .eq('reservas.barberia_id', barberia.id)
        .eq('status', 'approved')
        .gte('created_at', startOfMonthIso);

    const monthly_revenue = pagos?.reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0) || 0;

    // 2. Total Appointments (This Month)
    const { count: total_appointments } = await supabase
        .from('reservas')
        .select('id', { count: 'exact', head: true })
        .eq('barberia_id', barberia.id)
        .gte('start_time', startOfMonthIso);

    // 3. Active Staff
    const { count: active_staff } = await supabase
        .from('staff')
        .select('id', { count: 'exact', head: true })
        .eq('barberia_id', barberia.id)
        .eq('is_active', true);

    // 4. Occupancy Rate (Simplistic: Appointments / (Staff * 30 days * 5 slots)) * 100
    // Very rough approx
    const theoreticalCapacity = (active_staff || 1) * 30 * 8; // 8 slots/day
    const occupancy_rate = Math.min(Math.round(((total_appointments || 0) / theoreticalCapacity) * 100), 100);

    return {
        monthly_revenue,
        total_appointments: total_appointments || 0,
        active_staff: active_staff || 0,
        occupancy_rate
    };
}

export async function getGlobalAgenda(): Promise<Reserva[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: barberia } = await supabase.from('barberias').select('id').eq('owner_id', user.id).single();
    if (!barberia) return [];

    const todayStart = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('reservas')
        .select(`
            *,
            staff (name),
            servicios (name)
        `)
        .eq('barberia_id', barberia.id)
        .gte('start_time', todayStart)
        .order('start_time', { ascending: true });

    if (error) return [];
    return data as any as Reserva[];
}
