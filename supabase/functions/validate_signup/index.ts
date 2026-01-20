import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const DISPOSABLE_DOMAINS = [
  "yopmail.com",
  "tempmail.com",
  "guerrillamail.com",
  "mailinator.com",
  "10minutemail.com",
  "throwawaymail.com"
];

serve(async (req) => {
  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" } 
      });
    }

    const domain = email.split("@")[1];
    if (!domain) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    if (DISPOSABLE_DOMAINS.includes(domain)) {
      return new Response(JSON.stringify({ error: "Temporary email domains are not allowed." }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ message: "Email validation passed" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { 
      status: 400,
      headers: { "Content-Type": "application/json" } 
    });
  }
});
