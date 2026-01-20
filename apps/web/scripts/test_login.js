const { createClient } = require('@supabase/supabase-js');

async function testLogin() {
    console.log("Testing Login...");
    const url = "https://mnkweisggxelscoqvwnd.supabase.co";
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ua3dlaXNnZ3hlbHNjb3F2d25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzMxMTEsImV4cCI6MjA4NDAwOTExMX0.r5Y7j5GdBoQQE6pwEGqo7OPthhNiryQXtako8DRT4Nk";

    const supabase = createClient(url, key);

    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'cliente@stylernow.com',
        password: 'Kevin200'
    });

    if (error) {
        console.error("LOGIN ERROR:", JSON.stringify(error, null, 2));
    } else {
        console.log("LOGIN SUCCESS:", data.user.id);
    }
}

testLogin();
