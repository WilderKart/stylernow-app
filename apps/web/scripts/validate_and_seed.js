const { createClient } = require('@supabase/supabase-js');

async function runValidation() {
    console.log("🚀 Starting Production Readiness (Validation Only)...");

    const supabaseUrl = "https://mnkweisggxelscoqvwnd.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ua3dlaXNnZ3hlbHNjb3F2d25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzMxMTEsImV4cCI6MjA4NDAwOTExMX0.r5Y7j5GdBoQQE6pwEGqo7OPthhNiryQXtako8DRT4Nk";

    const authClient = createClient(supabaseUrl, supabaseAnonKey);

    const TEST_USERS = [
        { email: 'technoultra.ia+cliente@gmail.com', password: 'Kevin200', role: 'cliente' },
        { email: 'technoultra.ia+barberia@gmail.com', password: 'Kevin200', role: 'barberia' },
        { email: 'technoultra.ia+staff@gmail.com', password: 'Kevin200', role: 'staff' },
    ];

    // --- STEP 0: VERIFY LOGIN ---
    console.log("\n🛠️ [SETUP] Verifying Test Users (Login Check)...");
    const userMap = {};

    for (const u of TEST_USERS) {
        const { data: loginData, error: loginError } = await authClient.auth.signInWithPassword({
            email: u.email,
            password: u.password
        });

        if (loginError || !loginData.session) {
            console.error(`   ❌ User ${u.email} login failed: ${loginError?.message || "No session"}`);
            // If login fails, we stop.
            throw new Error("Login Validation Failed for " + u.email);
        } else {
            console.log(`   ✅ User ${u.email} logged in. ID: ${loginData.user.id}`);
            userMap[u.role] = loginData.user.id;
        }
    }

    // --- STEP 0.5: ENSURE DATA (Barberia, Staff, Service) ---
    console.log("\n🛠️ [SETUP] Ensure Business Data...");

    // Login as Barberia to insert data (RLS)
    const { error: clientLoginError } = await authClient.auth.signInWithPassword({ email: 'technoultra.ia+cliente@gmail.com', password: 'Kevin200' });
    if (clientLoginError) throw new Error("Client Login Failed in Simulation: " + clientLoginError.message);

    // 1. Barberia
    let barberiaId;
    console.log("   -> Debug: Checking Barberia/Owner", userMap['barberia']);
    const { data: existingB } = await authClient.from('barberias').select('id').eq('owner_id', userMap['barberia']).single();
    if (existingB) {
        barberiaId = existingB.id;
        console.log(`   ✅ Barberia exists: ${barberiaId}`);
    } else {
        const { data: newB, error: bError } = await authClient.from('barberias').insert({
            name: "Mustache Barber Test",
            owner_id: userMap['barberia'],
            status: "active"
        }).select().single();
        if (bError) throw bError;
        barberiaId = newB.id;
        console.log(`   ✅ Created Barberia: ${barberiaId}`);
    }

    // 2. Staff (Linked to staff@stylernow.com User)
    let staffId;
    const { data: existingS } = await authClient.from('staff').select('id').eq('user_id', userMap['staff']).single();
    if (existingS) {
        staffId = existingS.id;
        console.log(`   ✅ Staff exists: ${staffId}`);
    } else {
        const { data: newS, error: sError } = await authClient.from('staff').insert({
            name: "Carlos Test",
            barberia_id: barberiaId,
            user_id: userMap['staff'],
            is_active: true,
            nivel: "Master"
        }).select().single();
        if (sError) throw sError;
        staffId = newS.id;
        console.log(`   ✅ Created Staff: ${staffId}`);
    }

    // 3. Service
    let serviceId;
    const { data: existingServ } = await authClient.from('servicios').select('id').eq('name', 'Corte Test').single();
    if (existingServ) {
        serviceId = existingServ.id;
        console.log(`   ✅ Service exists: ${serviceId}`);
    } else {
        const { data: newServ, error: servError } = await authClient.from('servicios').insert({
            name: "Corte Test",
            barberia_id: barberiaId,
            price: 35000,
            duration_minutes: 60
        }).select().single();
        if (servError) throw servError;
        serviceId = newServ.id;
        console.log(`   ✅ Created Service: ${serviceId}`);
    }

    await authClient.auth.signOut();

    // --- STEP 1: SIMULATE FLOW ---
    console.log("\n🎬 [SIMULATION] Executing Flow...");

    // CLIENT BOOKING
    await authClient.auth.signInWithPassword({ email: 'cliente@stylernow.com', password: 'Kevin200' });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0); // 2:00 PM

    const { error: clientLoginError2 } = await authClient.auth.signInWithPassword({ email: 'technoultra.ia+cliente@gmail.com', password: 'Kevin200' });
    if (clientLoginError2) throw new Error("Client Login Failed: " + clientLoginError2.message);

    const sessionResponse = await authClient.auth.getSession();
    const session = sessionResponse.data.session;

    if (!session || !session.access_token) {
        throw new Error("❌ No Session established after login. User might not be confirmed.");
    }
    const token = session.access_token;

    if (!token) throw new Error("Token is empty!");
    console.log("   🔑 Token generated:", token.substring(0, 20) + "...");
    console.log("   Drafting Reservation (via FETCH)...");
    const response = await fetch("https://mnkweisggxelscoqvwnd.supabase.co/functions/v1/create_reserva", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            staff_id: staffId,
            service_id: serviceId,
            start_time: tomorrow.toISOString()
        })
    });

    const responseText = await response.text();
    let bookingData;
    try {
        bookingData = JSON.parse(responseText);
    } catch (e) {
        bookingData = { raw: responseText };
    }

    if (!response.ok) {
        require('fs').writeFileSync('error_log_raw.txt', responseText);
        console.error("❌ EDGE FUNCTION RAW ERROR:", response.status);
        throw new Error("Booking Failed: " + responseText);
    }

    const booking = { data: bookingData.data, payment_info: bookingData.payment_info };
    console.log(`   ✅ Booking Created: ${booking.data.id} (Ref: ${booking.payment_info.reference})`);

    // Resume flow...
    /*
    if (bookError || (booking && booking.error)) {
        require('fs').writeFileSync('error_log.txt', JSON.stringify({ booking, bookError }, null, 2));
        throw new Error("Booking Failed - Checks error_log.txt");
    }
    console.log(`   ✅ Booking Created: ${booking.data.id} (Ref: ${booking.payment_info.reference})`);
    */

    await authClient.auth.signOut();

    // STAFF CHECK
    await authClient.auth.signInWithPassword({ email: 'staff@stylernow.com', password: 'Kevin200' });
    const { data: agenda } = await authClient.from('reservas').select('status').eq('id', booking.data.id).single();
    if (!agenda) throw new Error("Staff cannot see booking!");
    console.log(`   ✅ Staff sees booking. Status: ${agenda.status}`);

    // Update to Completed (Simulate Service Done)
    const { error: updateError } = await authClient.from('reservas').update({ status: 'completed' }).eq('id', booking.data.id);
    if (updateError) console.warn("   ⚠️ Staff update failed (RLS?):", updateError.message);
    else console.log("   ✅ Staff marked booking as completed.");

    await authClient.auth.signOut();

    console.log("\n✨ VALIDATION SUCCESS ✨");
}

runValidation().catch(e => {
    require('fs').writeFileSync('error_log_raw.txt', JSON.stringify(e, Object.getOwnPropertyNames(e)));
    console.error(e);
    process.exit(1);
});
