import { packages, gear, recommend } from '/data.js?v=aec6dce8d4';

const KEY = 'bandrigs-finder';
const arrow = '<span aria-hidden="true" class="arr"><svg class="tri" viewBox="0 0 10 12" width="9" height="11" aria-hidden="true"><path d="M0 0 10 6 0 12Z" fill="currentColor"/></svg></span>';
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const load = () => { try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch { return {}; } };
if (location.hash === '#finder-restart') { try { sessionStorage.removeItem(KEY); } catch {} history.replaceState(null, '', location.pathname + '#finder'); requestAnimationFrame(() => document.getElementById('finder')?.scrollIntoView()); }
const save = a => { try { sessionStorage.setItem(KEY, JSON.stringify(a)); } catch {} };

// ---------- Lead source: where this visitor came from (UTM tags, ad click ids, referrer) ----------
// The last visit with a real signal wins; plain direct visits keep what was stored. Sent to the CRM "Lead Source" field.
const SRC_KEY = 'br_src';
const leadSource = (() => {
  const q = new URLSearchParams(location.search), g = k => (q.get(k) || '').trim().toLowerCase().slice(0, 80);
  const s = g('utm_source'), m = g('utm_medium'), c = g('utm_campaign');
  let ref = ''; try { const h = new URL(document.referrer).hostname.replace(/^www\./, ''); if (h && h !== location.hostname.replace(/^www\./, '') && !/(^|\.)bandrigs\.(com|pages\.dev)$/.test(h)) ref = h; } catch {}
  const paid = /cpc|ppc|paid|ad/.test(m), clickG = ['gclid', 'gbraid', 'wbraid'].some(k => q.has(k)), clickM = q.has('fbclid');
  const social = /facebook|instagram|^meta$|^fb$|^ig$/, search = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|brave|search)\./.test(ref + '.');
  const ch = clickG || (/google/.test(s) && paid) ? 'Google Ads'
    : social.test(s) ? (paid ? 'Meta Ads' : 'IG')
    : /youtube/.test(s) || /(^|\.)youtube\.com$|^youtu\.be$/.test(ref) ? 'YouTube'
    : /tiktok/.test(s) || /tiktok\.com$/.test(ref) ? 'TikTok'
    : /outreach/.test(s + ' ' + m) ? 'Outreach'
    : /partner|referral/.test(s + ' ' + m) ? 'Partner'
    : /email|newsletter/.test(m) ? 'Email List'
    : clickM || /(facebook|instagram)\.com$/.test(ref) ? 'IG'
    : ref && !search && !s ? 'External Referral'
    : (s || ref) ? 'Organic' : '';
  const now = { ch, detail: [s || (clickG ? 'google' : clickM ? 'facebook' : ref), m || (clickG ? 'cpc' : ref ? (search ? 'organic' : 'referral') : ''), c].filter(Boolean).join(' / '), land: location.pathname, at: new Date().toISOString().slice(0, 10) };
  let saved = null; try { saved = JSON.parse(localStorage.getItem(SRC_KEY)); } catch {}
  if (ch || !saved) { if (!ch) Object.assign(now, { ch: 'Organic', detail: 'direct' }); try { localStorage.setItem(SRC_KEY, JSON.stringify(now)); } catch {} return now; }
  return saved;
})();

// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
menuBtn?.addEventListener('click', () => { const open = menuBtn.getAttribute('aria-expanded') !== 'true'; menuBtn.setAttribute('aria-expanded', open); document.body.classList.toggle('menu-open', open); });

// ---------- Rig finder ----------
const WHO = [
  ['solo', 'Just me', 'Solo artist', 1], ['duo', 'Two of us', 'Duo', 2], ['band', 'A band', '3 to 6 players', 4],
  ['big', 'A big band', '7 or more players', 7], ['production', 'A church or production team', 'Worship team, theater, touring crew', 8],
];
const GOAL = [
  ['monitoring', 'In-ears only', 'The venue or our sound person runs the main mix'],
  ['everything', 'Mixing and in-ears', 'We run our own sound at most gigs'],
  ['upgrade', 'Improve gear we already own', 'We have a mixer or in-ears and want it to work better'],
  ['unsure', 'Not sure yet', 'Help us figure it out'],
];
const MOVE = [
  ['none', 'Nobody, wired is fine', 'Everyone stays in one spot'],
  ['some', 'Singers and front line', 'Some players move, drums and keys stay put'],
  ['all', 'Everyone', 'The whole band moves around'],
  ['unsure', 'Not sure', 'We’ll suggest what makes sense'],
];
const label = (list, v) => (list.find(x => x[0] === v) || [])[1] || '';

export function summaryText(a) {
  if (!a || !a.who) return '';
  const key = recommend({ ...a, goal: a.goal === 'unsure' ? 'monitoring' : a.goal });
  return `Rig finder answers\nWho's playing: ${label(WHO, a.who)}\nPeople who want their own in-ear mix: ${a.people}\nWhat the rig should do: ${label(GOAL, a.goal)}\nWho moves around: ${label(MOVE, a.move)}\nSuggested rig: ${packages[key].name} (${packages[key].sub})`;
}

const finder = document.querySelector('[data-finder]');
if (finder) {
  let a = load(); let step = a.done ? 4 : 0;
  const total = 4;
  const head = (n, title, hint) => `<div class="f-top"><span class="label">Step ${n} of ${total}</span><div class="f-bar" aria-hidden="true">${[1, 2, 3, 4].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</div></div><h3 class="f-q" tabindex="-1">${title}</h3>${hint ? `<p class="muted f-hint">${hint}</p>` : ''}`;
  const tiles = (name, list) => `<div class="tiles" role="group" aria-label="Choices">${list.map(([v, t, h]) => `<button type="button" class="tile" data-${name}="${v}" aria-pressed="${a[name] === v}"><span class="tile-t">${t}</span><span class="tile-h">${h}</span></button>`).join('')}</div>`;
  const back = () => step > 0 ? `<button type="button" class="link-btn" data-back>← Back</button>` : '';

  const render = (focus = true) => {
    let html = '';
    if (step === 0) html = head(1, 'Who’s playing?') + tiles('who', WHO);
    else if (step === 1) html = head(2, 'How many people want their own in-ear mix?', 'Count everyone who wants to hear their own balance of vocals and instruments.') +
      `<div class="stepper"><button type="button" class="step-btn" data-dec aria-label="One fewer">−</button><output class="step-val" aria-live="polite">${a.people}</output><button type="button" class="step-btn" data-inc aria-label="One more">+</button><span class="muted">${a.people === 1 ? 'person' : 'people'}</span></div><div class="f-actions">${back()}<button type="button" class="btn btn-primary" data-next>Next ${arrow}</button></div>`;
    else if (step === 2) html = head(3, 'What should the rig do?') + tiles('goal', GOAL) + `<div class="f-actions">${back()}</div>`;
    else if (step === 3) html = head(4, 'Who needs to move around on stage?', 'Players who move get wireless in-ears. Everyone else can stay wired, which costs less.') + tiles('move', MOVE) + `<div class="f-actions">${back()}</div>`;
    else html = result();
    finder.innerHTML = html;
    if (focus) finder.querySelector('.f-q, .r-name')?.focus({ preventScroll: false });
  };

  const result = () => {
    const key = recommend({ ...a, goal: a.goal === 'unsure' ? 'monitoring' : a.goal });
    const p = packages[key];
    const why = [];
    why.push(`${a.people} personal in-ear ${a.people === 1 ? 'mix' : 'mixes'}${a.people > 1 ? ', one for each player who wants one' : ''}`);
    if (a.move === 'none') why.push('All wired, which keeps the cost down');
    else if (a.move === 'all') why.push('Wireless in-ears for everyone');
    else if (a.move === 'some') why.push('Wireless for the players who move, wired for the rest');
    else why.push('We’ll help you decide what should be wireless');
    if (key === 'compact') why.push('A WING Rack mixer and Midas DL8 stage box, so you can run your own sound');
    else if (key === 'band') why.push('A WING Rack mixer and Midas DL16 stage box, with four wireless in-ear mixes included');
    else if (a.goal === 'everything') why.push('A digital mixer for your main mix, in the same rack');
    if (a.goal === 'upgrade') why.push('We start from the gear you already own');
    if (a.goal === 'unsure') why.push('We’ll talk through whether you need mixing too');
    return `<div class="result"><p class="label">We’d start with</p><h3 class="r-name" tabindex="-1">${p.name}</h3><p class="rig-sub">${esc(p.sub)}</p>
<p class="r-price">${p.price ? `<span class="label">Starting at</span> ${p.price}` : '<span class="label">Price</span> Custom quote after a free gear review'}</p>
<ul class="ticks">${why.map(w => `<li>${esc(w)}</li>`).join('')}</ul>
<p class="small muted">Typical gear: ${p.gear.map(g => gear[g].name).join(', ')}.</p>
${key === 'band' && a.goal === 'everything' ? `<p class="small muted">Running the main speakers too? <a href="/systems/complete/">${packages.complete.name}</a>, our complete live rig, adds front-of-house mixing and splitting from ${packages.complete.price}.</p>` : ''}
<div class="f-actions"><a class="btn btn-primary" href="/plan/?system=${key}">Plan this rig ${arrow}</a><a class="quiet" href="/systems/${key}/">What’s included ${arrow}</a></div>
<button type="button" class="link-btn" data-restart>Start over</button></div>`;
  };

  finder.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.who) { const w = WHO.find(x => x[0] === t.dataset.who); a.who = w[0]; if (!a.people || !a._touched) a.people = w[3]; step = 1; }
    else if ('inc' in t.dataset) { a.people = Math.min(32, a.people + 1); a._touched = true; render(false); save(a); return; }
    else if ('dec' in t.dataset) { a.people = Math.max(1, a.people - 1); a._touched = true; render(false); save(a); return; }
    else if ('next' in t.dataset) step = 2;
    else if (t.dataset.goal) { a.goal = t.dataset.goal; step = 3; }
    else if (t.dataset.move) { a.move = t.dataset.move; a.done = true; step = 4; }
    else if ('back' in t.dataset) step = Math.max(0, step - 1);
    else if ('restart' in t.dataset) { a = {}; step = 0; }
    else return;
    save(a); render();
  });
  render(false);
}

// ---------- Plan form -> Zoho CRM (Leads web form "Website rig request New Leads", New Leads layout, Bandrigs org) ----------
const ZOHO = { url: 'https://crm.zoho.com/crm/WebToLeadForm', xnQsjsdp: '403043ba007944169c7357582e835edab47f04b33e76b28489a88e2aa9f0dbb1', xmIwtLD: '0afd4abe2500cd3cd54cee688ec3163da44f55ca05936946c17eb25d26206be03ea974d5ae89f230fd29843c371a2b75', actionType: 'TGVhZHM=',
  // CRM "Product" (LEADCF1) picklist values, spelled exactly as in Zoho
  product: { compact: 'The Trobadour - Solo & Duo', band: 'The CenterStage - Full Band', complete: 'The Headliner - Complete Live', upgrade: 'The Encore - Expand Your Existing Rig', custom: 'The Signature - Custom Build' },
  // CRM "When Needed" (LEADCF3) picklist values, spelled exactly as in Zoho
  // CRM "Lead Source" picklist: our channel name -> the value Zoho stores
  source: { 'Google Ads': 'Advertisement', IG: 'Facebook' },
  when: { 'Within a month': 'Within a month', '1–3 months': '1-3 Months', '3–6 months': '3-6 Months', 'Just exploring': 'Just exploring' } };
// US numbers -> (xxx) xxx-xxxx for the CRM; anything else is sent as typed
const usPhone = v => { let n = String(v).replace(/\D/g, ''); if (n.length === 11 && n[0] === '1') n = n.slice(1); return n.length === 10 ? `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}` : String(v).trim(); };
// Capitalize names for the CRM; all-lower or ALL-CAPS names are fully proper-cased, mixed case (McDonald) is kept
const properName = v => { const t = String(v).trim().replace(/\s+/g, ' '); const mixed = t !== t.toLowerCase() && t !== t.toUpperCase(); return t.replace(/[^\s\-']+/g, w => w[0].toUpperCase() + (mixed ? w.slice(1) : w.slice(1).toLowerCase())); };
const form = document.querySelector('#plan-form');
if (form) {
  const a = load();
  const params = new URLSearchParams(location.search);
  const sys = packages[params.get('system')] ? params.get('system') : (a.done ? recommend({ ...a, goal: a.goal === 'unsure' ? 'monitoring' : a.goal }) : '');
  if (sys) form.elements.system.value = sys;
  if (a.done) {
    const map = { solo: 'Solo artist', duo: 'Duo', band: a.people <= 4 ? '3–4 piece' : '5–6 piece', big: '7 or more', production: 'Church or production team' };
    if (map[a.who]) form.elements.size.value = map[a.who];
  }
  // Side box shows the rig picked in "Rig interested in" and follows it as it changes
  const box = document.querySelector('[data-summary]');
  const showRig = () => {
    const p = packages[form.elements.system.value];
    box.hidden = !p;
    if (p) box.innerHTML = `<p class="label">Your rig</p><p class="small"><strong>${esc(p.name)}</strong> · ${esc(p.sub)}</p><p class="small muted">${p.price ? 'Starting at ' + p.price : 'Quoted for your setup'}</p>`;
  };
  showRig();
  form.elements.system.addEventListener('change', showRig);
  // Performers sets a default rig (Solo/Duo -> Troubadour, 3+ -> CenterStage) until the person picks a rig themselves
  let rigPicked = false;
  form.elements.system.addEventListener('change', () => { rigPicked = true; });
  form.elements.size.addEventListener('change', () => {
    if (rigPicked) return;
    const v = form.elements.size.value;
    const rig = /^(Solo artist|Duo)$/.test(v) ? 'compact' : /^(3–4 piece|5–6 piece|7 or more)$/.test(v) ? 'band' : '';
    if (rig) { form.elements.system.value = rig; showRig(); }
  });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const err = document.querySelector('#plan-error');
    const bad = !d.name.trim() ? 'name' : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email.trim()) ? 'email' : '';
    form.querySelectorAll('[aria-invalid]').forEach(x => x.removeAttribute('aria-invalid'));
    if (bad) { err.textContent = bad === 'name' ? 'Please add your name.' : 'Please add a valid email address so we can reply.'; err.hidden = false; form.elements[bad].setAttribute('aria-invalid', 'true'); form.elements[bad].focus(); return; }
    err.hidden = true;
    const sysName = d.system ? `${packages[d.system].name} (${packages[d.system].sub})` : 'Not sure yet';
    const body = `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nBand: ${d.band}\nPerformers: ${d.size}\nTiming: ${d.timing}\nInterested in: ${sysName}\nSMS consent: ${d.sms === 'yes' ? 'YES, opted in to texts on ' + new Date().toISOString() : 'No'}\n\nCurrent gear:\n${d.gear}\n\nNotes:\n${d.message}\n\n${summaryText(a)}`;
    const crmDesc = [['Rig', sysName], ['Performers', d.size], ['SMS consent', d.sms === 'yes' ? 'Yes, opted in ' + new Date().toISOString() : 'No'], ['Current gear', d.gear], ['Notes', d.message]]
      .filter(([, v]) => v && String(v).trim()).map(([k, v]) => `${k}: ${String(v).trim().replace(/\s*\n\s*/g, '; ')}`)
      .concat(['Source: ' + leadSource.ch + (leadSource.detail ? ' (' + leadSource.detail + ')' : '') + ', landed on ' + leadSource.land + ' ' + leadSource.at, 'Page: ' + location.href]).join('\n');
    const btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const words = properName(d.name).split(' '), last = words.length > 1 ? words[words.length - 1] : words[0], first = words.length > 1 ? words.slice(0, -1).join(' ') : '';
      const fd = new FormData();
      [['xnQsjsdp', ZOHO.xnQsjsdp], ['zc_gad', ''], ['xmIwtLD', ZOHO.xmIwtLD], ['actionType', ZOHO.actionType], ['returnURL', 'null'], ['aG9uZXlwb3Q', ''],
        ['Company', (d.band || d.name).trim().slice(0, 200)], ['First Name', first.slice(0, 40)], ['Last Name', last.slice(0, 80)], ['Email', d.email.trim().slice(0, 100)], ['Phone', usPhone(d.phone || '').slice(0, 30)],
        ['LEADCF1', ZOHO.product[d.system] || '-None-'], ['LEADCF3', ZOHO.when[d.timing] || '-None-'], ['Lead Source', ZOHO.source[leadSource.ch] || leadSource.ch],
        ['Description', crmDesc.slice(0, 32000)]].forEach(([k, v]) => fd.append(k, v));
      const res = await fetch(ZOHO.url, { method: 'POST', body: fd, cache: 'no-cache' });
      const out = (res.headers.get('Content-Type') || '').includes('application/json') ? await res.json() : null;
      if (!res.ok || (out && out.actionsubmit === 'error_msg')) throw new Error('zoho');
      try { sessionStorage.setItem('br_first', words[0]); } catch {}
      location.href = '/thanks/';
    } catch {
      location.href = 'mailto:sales@bandrigs.com?subject=' + encodeURIComponent('Rig request — ' + (d.band || d.name)) + '&body=' + encodeURIComponent(body);
      btn.disabled = false; btn.innerHTML = 'Send my details ' + arrow;
    }
  });
}

// Thanks page: greet by first name when we have it
const thanksH = document.querySelector('[data-thanks]');
if (thanksH) { let n = ''; try { n = sessionStorage.getItem('br_first') || ''; } catch {} if (n) thanksH.textContent = `Thanks, ${n}. We’ve got it.`; }
