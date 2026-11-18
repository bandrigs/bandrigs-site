import { packages, gear, recommend } from '/data.js?v=78a6018d32';

const KEY = 'bandrigs-finder';
const arrow = '<span aria-hidden="true" class="arr"><svg class="tri" viewBox="0 0 10 12" width="9" height="11" aria-hidden="true"><path d="M0 0 10 6 0 12Z" fill="currentColor"/></svg></span>';
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const load = () => { try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch { return {}; } };
if (location.hash === '#finder-restart') { try { sessionStorage.removeItem(KEY); } catch {} history.replaceState(null, '', location.pathname + '#finder'); requestAnimationFrame(() => document.getElementById('finder')?.scrollIntoView()); }
const save = a => { try { sessionStorage.setItem(KEY, JSON.stringify(a)); } catch {} };

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
  return `Rig finder answers\nWho's playing: ${label(WHO, a.who)}\nPeople who want their own in-ear mix: ${a.people}\nWhat the rig should do: ${label(GOAL, a.goal)}\nWho moves around: ${label(MOVE, a.move)}\nSuggested rig: ${packages[key].name}`;
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
    return `<div class="result"><p class="label">We’d start with</p><h3 class="r-name" tabindex="-1">${p.name}</h3>
<p class="r-price">${p.price ? `<span class="label">Starting at</span> ${p.price}` : '<span class="label">Price</span> Custom quote after a free gear review'}</p>
<ul class="ticks">${why.map(w => `<li>${esc(w)}</li>`).join('')}</ul>
<p class="small muted">Typical gear: ${p.gear.map(g => gear[g].name).join(', ')}.</p>
${key === 'band' && a.goal === 'everything' ? `<p class="small muted">Running the main speakers too? The <a href="/systems/complete/">Complete live rig</a> adds front-of-house mixing and splitting from ${packages.complete.price}.</p>` : ''}
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

// ---------- Plan form -> Zoho Bigin ----------
const BIGIN = { url: 'https://bigin.zoho.com/crm/WebForm', xnQsjsdp: 'd68340578f7881c10dec46f976d39b23ed98b6232a5f388a2ec97fe3867af67a', xmIwtLD: 'e55c369a528333424588d79b900f1b5a9cb9b2ac4f5ffec3513d7905e31b838b005b196cee560c63223098ddf2c07ed2', actionType: 'UG90ZW50aWFscw==' };
const form = document.querySelector('#plan-form');
if (form) {
  const a = load();
  const params = new URLSearchParams(location.search);
  const sys = packages[params.get('system')] ? params.get('system') : (a.done ? recommend({ ...a, goal: a.goal === 'unsure' ? 'monitoring' : a.goal }) : '');
  if (sys) form.elements.system.value = sys;
  if (a.done) {
    const map = { solo: 'Solo artist', duo: 'Duo', band: a.people <= 4 ? '3–4 piece' : '5–6 piece', big: '7 or more', production: 'Church or production team' };
    if (map[a.who]) form.elements.size.value = map[a.who];
    const box = document.querySelector('[data-summary]');
    box.hidden = false;
    box.innerHTML = `<p class="label">From the rig finder</p><p class="small">${esc(label(WHO, a.who))} · ${a.people} in-ear ${a.people === 1 ? 'mix' : 'mixes'} · ${esc(label(GOAL, a.goal))} · ${esc(label(MOVE, a.move))}</p><p class="small muted">We’ll include these answers with your details.</p>`;
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const err = document.querySelector('#plan-error');
    const bad = !d.name.trim() ? 'name' : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email.trim()) ? 'email' : '';
    form.querySelectorAll('[aria-invalid]').forEach(x => x.removeAttribute('aria-invalid'));
    if (bad) { err.textContent = bad === 'name' ? 'Please add your name.' : 'Please add a valid email address so we can reply.'; err.hidden = false; form.elements[bad].setAttribute('aria-invalid', 'true'); form.elements[bad].focus(); return; }
    err.hidden = true;
    const sysName = d.system ? packages[d.system].name : 'Not sure yet';
    const body = `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nBand: ${d.band}\nPerformers: ${d.size}\nTiming: ${d.timing}\nInterested in: ${sysName}\nSMS consent: ${d.sms === 'yes' ? 'YES, opted in to texts on ' + new Date().toISOString() : 'No'}\n\nCurrent gear:\n${d.gear}\n\nNotes:\n${d.message}\n\n${summaryText(a)}`;
    const btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const words = d.name.trim().split(/\s+/), last = words.length > 1 ? words[words.length - 1] : words[0], first = words.length > 1 ? words.slice(0, -1).join(' ') : '';
      const close = new Date(Date.now() + 60 * 864e5), mdy = `${String(close.getMonth() + 1).padStart(2, '0')}/${String(close.getDate()).padStart(2, '0')}/${close.getFullYear()}`;
      const fd = new FormData();
      [['xnQsjsdp', BIGIN.xnQsjsdp], ['zc_gad', ''], ['xmIwtLD', BIGIN.xmIwtLD], ['actionType', BIGIN.actionType], ['returnURL', 'null'], ['rmsg', 'true'],
        ['Potential Name', `${d.band || d.name} — ${sysName}`.slice(0, 120)], ['Contacts.First Name', first], ['Contacts.Last Name', last], ['Contacts.Email', d.email.trim()], ['Contacts.Phone', d.phone || ''],
        ['Description', (body + '\n\nPage: ' + location.href).slice(0, 30000)], ['Closing Date', mdy], ['Pipeline', 'Sales Pipeline Standard'], ['Stage', 'New lead']].forEach(([k, v]) => fd.append(k, v));
      await fetch(BIGIN.url, { method: 'POST', mode: 'no-cors', body: fd });
      const wrap = form.parentElement;
      form.outerHTML = `<div class="form sent" tabindex="-1"><p class="label ok">Sent</p><h2>Thanks, ${esc(words[0])}. We’ve got it.</h2><p class="muted">We’ll reply within one business day.<br>Show coming up fast? Call <a href="tel:+18582323544" style="white-space:nowrap">858-232-3544</a>.</p><a class="btn btn-secondary" href="/systems/">Browse rigs &amp; pricing</a></div>`;
      wrap.querySelector('.sent').focus();
    } catch {
      location.href = 'mailto:sales@bandrigs.com?subject=' + encodeURIComponent('Rig request — ' + (d.band || d.name)) + '&body=' + encodeURIComponent(body);
      btn.disabled = false; btn.innerHTML = 'Send my details ' + arrow;
    }
  });
}
