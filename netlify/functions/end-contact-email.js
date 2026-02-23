// netlify/functions/send-contact-email.js
// REEMPLAZA TODO el contenido de este archivo

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "RESEND_API_KEY not configured" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { name, email, phone, message, recipient } = body;
  
  if (!name || !email || !message) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing fields" }) };
  }

  const toEmail = recipient || 'shawn@leashtolegacy.org';

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Leash to Legacy <onboarding@resend.dev>",
        to: [toEmail],
        reply_to: email,
        subject: `Contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return { statusCode: 500, headers, body: JSON.stringify({ error: err }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};