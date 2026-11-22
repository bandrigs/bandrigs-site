// Cloudflare Pages advanced-mode worker for bandrigs.com.
// Serves the static site as usual and adds one endpoint: POST /api/pay/start, which starts a
// HelcimPay.js checkout session with the HELCIM_API_TOKEN secret (set in Cloudflare, never in this repo).
// Card and bank details are entered in Helcim's own secure window and never reach this worker.
const ALLOWED = /^https:\/\/(bandrigs\.com|www\.bandrigs\.com|([a-z0-9-]+\.)?bandrigs\.pages\.dev)$/;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max);

async function startCheckout(request, env) {
  const origin = request.headers.get('origin') || '';
  if (!ALLOWED.test(origin)) return json({ error: 'Not allowed.' }, 403);
  if (!env.HELCIM_API_TOKEN) return json({ error: 'Online payment isn’t set up yet.' }, 503);
  let b;
  try { b = await request.json(); } catch { return json({ error: 'Bad request.' }, 400); }
  const name = clean(b.name, 80), email = clean(b.email, 120), phone = clean(b.phone, 20), invoice = clean(b.invoice, 40);
  const amount = Math.round(Number(String(b.amount ?? '').replace(/[$,\s]/g, '')) * 100) / 100;
  if (!name || !invoice) return json({ error: 'Please fill in your name and invoice number.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Please enter a valid email.' }, 400);
  if (!(amount >= 1 && amount <= 50000)) return json({ error: 'Please enter an amount between $1 and $50,000.' }, 400);

  const billing = { name, email };
  if (phone) billing.phone = phone;
  const payload = {
    paymentType: 'purchase', amount, currency: 'USD',
    paymentMethod: 'cc-ach', hasConvenienceFee: 1,
    confirmationScreen: false,
    customStyling: { appearance: 'dark', brandColor: '8EC5FF', cornerRadius: 'rectangular', ctaButtonText: 'pay' },
    customerRequest: { contactName: name, ...(phone ? { cellPhone: phone } : {}), billingAddress: billing },
    invoiceRequest: { notes: `Website payment toward BandRigs invoice ${invoice}`, lineItems: [{ description: `Payment toward invoice ${invoice}`, quantity: 1, price: amount, total: amount }] },
  };
  const r = await fetch('https://api.helcim.com/v2/helcim-pay/initialize', {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json', 'api-token': env.HELCIM_API_TOKEN },
    body: JSON.stringify(payload),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data.checkoutToken) {
    console.log('helcim initialize failed', r.status, JSON.stringify(data.errors || data).slice(0, 500));
    return json({ error: 'We couldn’t start the payment. Please try again, or call us.' }, 502);
  }
  // secretToken stays here; the browser only needs the checkoutToken to open Helcim's window.
  return json({ checkoutToken: data.checkoutToken });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/pay/start') {
      if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
      try { return await startCheckout(request, env); } catch (e) { console.log('pay start error', String(e)); return json({ error: 'Something went wrong. Please call us.' }, 500); }
    }
    return env.ASSETS.fetch(request);
  },
};
