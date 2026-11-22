// /payment/ page: starts a HelcimPay.js checkout (via /api/pay/start) and opens Helcim's secure window over the page.
// Card and bank numbers are typed into Helcim's window only; nothing sensitive is handled or stored here.
(() => {
  const form = document.getElementById('pay-form');
  if (!form) return;
  const err = document.getElementById('pay-error');
  const btn = form.querySelector('button[type=submit]');
  const btnHTML = btn.innerHTML;
  const done = document.getElementById('pay-done');
  const fallback = form.dataset.fallback;
  const money = n => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  let token = null;

  const showError = (msg, withLink) => {
    err.hidden = false;
    err.innerHTML = '';
    err.append(msg);
    if (withLink && fallback) {
      const a = document.createElement('a');
      a.href = fallback; a.rel = 'noopener'; a.textContent = 'Pay on our Helcim payment page instead';
      err.append(' ', a, '.');
    }
  };
  const busy = on => { btn.disabled = on; btn.innerHTML = on ? 'Opening secure checkout…' : btnHTML; };

  const amountInput = form.elements.amount;
  amountInput.addEventListener('blur', () => {
    const n = Number(amountInput.value.replace(/[$,\s]/g, ''));
    if (n > 0) amountInput.value = n.toFixed(2);
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    err.hidden = true;
    const f = form.elements;
    for (const el of [f.name, f.email, f.invoice, f.amount]) el.removeAttribute('aria-invalid');
    const amount = Number(f.amount.value.replace(/[$,\s]/g, ''));
    const bad = [];
    if (!f.name.value.trim()) bad.push(f.name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) bad.push(f.email);
    if (!f.invoice.value.trim()) bad.push(f.invoice);
    if (!(amount >= 1 && amount <= 50000)) bad.push(f.amount);
    if (bad.length) {
      bad.forEach(el => el.setAttribute('aria-invalid', 'true'));
      bad[0].focus();
      return showError(bad[0] === f.amount ? 'Please enter the amount from your invoice, between $1 and $50,000.' : 'Please fill in the fields marked *.');
    }
    if (typeof window.appendHelcimPayIframe !== 'function') return showError('The secure checkout didn’t load.', true);
    busy(true);
    try {
      const r = await fetch('/api/pay/start', { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: f.name.value, email: f.email.value, phone: f.phone.value, invoice: f.invoice.value, amount }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.checkoutToken) { busy(false); return showError(d.error || 'We couldn’t start the payment.', true); }
      token = d.checkoutToken;
      window.appendHelcimPayIframe(token, true);
    } catch {
      busy(false);
      showError('We couldn’t reach the payment service.', true);
    }
  });

  const removeFrame = () => {
    if (typeof window.removeHelcimPayIframe === 'function') { try { window.removeHelcimPayIframe(); return; } catch {} }
    document.getElementById('helcimPayIframe')?.remove();
  };

  window.addEventListener('message', e => {
    if (!token || !e.data || e.data.eventName !== 'helcim-pay-js-' + token) return;
    const status = e.data.eventStatus;
    if (status === 'SUCCESS') {
      let t = {};
      try { const m = typeof e.data.eventMessage === 'string' ? JSON.parse(e.data.eventMessage) : e.data.eventMessage; t = (m && m.data && m.data.data) || {}; } catch {}
      removeFrame();
      const isBank = /withdrawal/i.test(t.type || '');
      const f = form.elements;
      done.querySelector('[data-done-line]').textContent = isBank
        ? 'Your bank transfer is on its way. It takes about 3 to 5 business days to clear.'
        : 'Your card payment went through.';
      const rows = [['Amount', t.amount ? money(t.amount) : money(f.amount.value)], ['Invoice', f.invoice.value.trim()], ['Reference', t.transactionId || '']].filter(r => r[1]);
      const dl = done.querySelector('[data-done-specs]');
      dl.innerHTML = '';
      for (const [k, v] of rows) { const div = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = k; dd.textContent = v; div.append(dt, dd); dl.append(div); }
      form.hidden = true;
      done.hidden = false;
      done.focus();
      token = null;
    } else if (status === 'ABORTED') {
      busy(false);
      removeFrame();
      token = null;
      showError('The payment didn’t go through, and you weren’t charged. Please check the details and try again, or call us.');
    } else if (status === 'HIDE') {
      busy(false);
      removeFrame();
      token = null;
    }
  });
})();
