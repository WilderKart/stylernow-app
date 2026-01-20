const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// MUST use Service Role for Admin Ops (Delete users, Bypass RLS)
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    console.error("❌ Missing Env Vars. Ensure .env has SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function main() {
    console.log("🚀 STARTING PLATFORM SETUP (Phase 1)...");

    // 1. CLEANUP AUTH USERS
    console.log("\n🧹 [1/3] Cleaning Test Users...");
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const targets = users.users.filter(u => u.email.includes('technoultra') || u.email.includes('stylernow'));
    console.log(`   Found ${targets.length} users to delete.`);

    for (const u of targets) {
        const { error: delError } = await supabase.auth.admin.deleteUser(u.id);
        if (delError) console.error(`   Failed to delete ${u.email}:`, delError.message);
        else console.log(`   Deleted: ${u.email}`);
    }

    // 2. SEED PLANS
    console.log("\n🌱 [2/3] Seeding Plans...");
    const PLANS = [
        {
            name: "ESSENTIAL",
            description: "Para barberos independientes.",
            price_cop: 49900,
            limits: { max_staff: 1, max_sedes: 1 },
            features: { inventory: false, loyalty: false, custom_branding: false }
        },
        {
            name: "STUDIO",
            description: "Para pequeños equipos en crecimiento.",
            price_cop: 119000,
            limits: { max_staff: 5, max_sedes: 2 },
            features: { inventory: true, loyalty: false, custom_branding: false }
        },
        {
            name: "PRESTIGE",
            description: "Para marcas consolidadas.",
            price_cop: 349000,
            limits: { max_staff: 10, max_sedes: 5 },
            features: { inventory: true, loyalty: true, custom_branding: true }
        },
        {
            name: "SIGNATURE",
            description: "Soluciones a medida para franquicias.",
            price_cop: 0, // Custom Quote
            limits: { max_staff: 999, max_sedes: 999 },
            features: { inventory: true, loyalty: true, white_label: true }
        }
    ];

    for (const p of PLANS) {
        const { error } = await supabase.from('plans').upsert(p, { onConflict: 'name' });
        if (error) throw error;
        console.log(`   ✅ Plan seeded: ${p.name}`);
    }

    // 3. SEED SUPERUSER
    console.log("\n👑 [3/3] Creating Superuser...");
    const SUPER_EMAIL = "technoultra.ia@gmail.com";
    const SUPER_PASS = "StylerNow2026!"; // Strong password

    // Create Auth User
    const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
        email: SUPER_EMAIL,
        password: SUPER_PASS,
        email_confirm: true,
        user_metadata: { role: 'superuser', name: "Kevin Owner" }
    });

    if (createError) {
        console.error("   ⚠️ Superuser creation error (might exist):", createError.message);
        // If exists, ensure role in public table
    } else {
        console.log(`   ✅ Auth User Created: ${authUser.user.id}`);
    }

    // Ensure Public User Role (Critical)
    // We need to fetch the ID if we didn't just create it
    const { data: existingUser } = await supabase.from('users').select('id').eq('email', SUPER_EMAIL).single();
    if (existingUser) {
        const { error: roleError } = await supabase.from('users').update({
            role: 'superuser',
            full_name: "Kevin Owner (Super)"
        }).eq('id', existingUser.id);

        if (roleError) console.error("   ❌ Failed to set Superuser role:", roleError);
        else console.log("   ✅ Public Role 'superuser' confirmed.");
    }

    console.log("\n✨ SETUP COMPLETE. READY FOR PHASE 2.");
}

main().catch(console.error);
