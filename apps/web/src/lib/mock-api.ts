import { Barberia, Reserva, Sede, Servicio, Staff, User } from "@/types/db";

// ... [Keep previous mocks] ...

// [SUPERUSER SPECIFIC MOCKS]

export interface SuperUserKPIs {
    active_barberias: number;
    total_users: number;
    monthly_revenue_global: number;
    churn_rate: number;
    conversion_rate: number;
}

export const MOCK_SUPERUSER_KPIS: SuperUserKPIs = {
    active_barberias: 24,
    total_users: 15430,
    monthly_revenue_global: 125000000, // 125M COP
    churn_rate: 1.2,
    conversion_rate: 4.5
};

// [EXISTING HELPERS...]

export async function getSuperUserKPIs(): Promise<SuperUserKPIs> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_SUPERUSER_KPIS;
}

