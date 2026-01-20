const { createClient } = require('@supabase/supabase-js');

async function signUpUsers() {
    console.log("🚀 Singing Up Test Users...");
    const supabaseUrl = "https://mnkweisggxelscoqvwnd.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ua3dlaXNnZ3hlbHNjb3F2d25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzMxMTEsImV4cCI6MjA4NDAwOTExMX0.r5Y7j5GdBoQQE6pwEGqo7OPthhNiryQXtako8DRT4Nk";
    const authClient = createClient(supabaseUrl, supabaseAnonKey);

    const TEST_USERS = [
        { email: 'technoultra.ia+cliente@gmail.com', password: 'Kevin200', role: 'cliente' },
        { email: 'technoultra.ia+barberia@gmail.com', password: 'Kevin200', role: 'barberia' },
        { email: 'technoultra.ia+staff@gmail.com', password: 'Kevin200', role: 'staff' },
    ];

    for (const u of TEST_USERS) {
        console.log(`Creating ${u.email}...`);
        const { data, error } = await authClient.auth.signUp({
            email: u.email,
            password: u.password,
            options: { data: { role: u.role } }
        });
        if (error) console.error("Error:", error.message);
        else console.log("Success (User ID):", data.user?.id);
    }
}

signUpUsers();
