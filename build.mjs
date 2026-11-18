// Builds the static BandRigs site: node build.mjs
// Every route gets real HTML (for people and for search engines); app.js only adds the rig finder and the form.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { packages, order, gear } from './data.js';

const SITE = 'https://bandrigs.com';
const PHONE = '858-232-3544', TEL = '+18582323544', EMAIL = 'sales@bandrigs.com';
const arrow = '<span aria-hidden="true" class="arr"><svg class="tri" viewBox="0 0 10 12" width="9" height="11" aria-hidden="true"><path d="M0 0 10 6 0 12Z" fill="currentColor"/></svg></span>';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const org = {
  '@context': 'https://schema.org', '@type': 'Organization', '@id': SITE + '/#org', name: 'BandRigs', url: SITE + '/',
  logo: SITE + '/assets/logo.svg', image: SITE + '/assets/og.jpg', email: EMAIL, telephone: TEL,
  description: 'BandRigs designs and builds custom live mixing and in-ear monitor rack systems for bands anywhere in the US.', areaServed: { '@type': 'Country', name: 'United States' },
  sameAs: ['https://www.youtube.com/channel/UCKjgT1H8lktykWGHgZ9NeRg', 'https://www.instagram.com/bandrigs/', 'https://www.tiktok.com/@bandrigschannel'],
};

function layout({ path, title, description, body, schema = [], image = '/assets/og.jpg', scripts = true }) {
  const url = SITE + path;
  const nav = [['/systems/', 'Rigs & pricing'], ['/#how', 'How it works']];
  const ld = [org, ...schema].map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}"><meta name="theme-color" content="#0d0e10">
<meta property="og:type" content="website"><meta property="og:site_name" content="BandRigs"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE + image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/styles.css">${scripts ? '<script type="module" src="/app.js"></script>' : ''}${ld}
</head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap head-row">
<a class="logo" href="/" aria-label="BandRigs home"><svg class="logo-mark" viewBox="0 0 100 100" width="34" height="34" aria-hidden="true"><g fill="#8ec5ff"><rect x="6" y="12" width="88" height="20" rx="2"/><g fill="#0d0e10"><circle cx="11" cy="22" r="2.2"/><circle cx="89" cy="22" r="2.2"/><rect x="17" y="21.25" width="66" height="1.5" opacity=".35"/></g><rect x="6" y="40" width="88" height="20" rx="2"/><g fill="#0d0e10"><circle cx="11" cy="50" r="2.2"/><circle cx="89" cy="50" r="2.2"/><rect x="17" y="49.25" width="66" height="1.5" opacity=".35"/></g><rect x="6" y="68" width="88" height="20" rx="2"/><g fill="#0d0e10"><circle cx="11" cy="78" r="2.2"/><circle cx="89" cy="78" r="2.2"/><rect x="17" y="77.25" width="66" height="1.5" opacity=".35"/></g></g></svg><span class="logo-text">Band<span>Rigs</span></span></a>
<nav class="nav" id="nav" aria-label="Main">${nav.map(([h, t]) => `<a href="${h}"${path === h ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
<a class="btn btn-primary btn-sm head-cta" href="/plan/">Plan my rig</a>
<button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav" aria-label="Menu"><span></span><span></span></button>
</div></header>
<main id="main">${body}</main>
<footer class="site-footer"><div class="wrap foot-grid">
<div><a class="logo" href="/" aria-label="BandRigs home"><svg class="logo-mark" viewBox="0 0 100 100" width="34" height="34" aria-hidden="true"><g fill="#8ec5ff"><rect x="6" y="12" width="88" height="20" rx="2"/><g fill="#0d0e10"><circle cx="11" cy="22" r="2.2"/><circle cx="89" cy="22" r="2.2"/><rect x="17" y="21.25" width="66" height="1.5" opacity=".35"/></g><rect x="6" y="40" width="88" height="20" rx="2"/><g fill="#0d0e10"><circle cx="11" cy="50" r="2.2"/><circle cx="89" cy="50" r="2.2"/><rect x="17" y="49.25" width="66" height="1.5" opacity=".35"/></g><rect x="6" y="68" width="88" height="20" rx="2"/><g fill="#0d0e10"><circle cx="11" cy="78" r="2.2"/><circle cx="89" cy="78" r="2.2"/><rect x="17" y="77.25" width="66" height="1.5" opacity=".35"/></g></g></svg><span class="logo-text">Band<span>Rigs</span></span></a><p class="muted">Custom live mixing and in-ear monitor rigs, designed and built for your band.</p></div>
<div><p class="label">Talk to us</p><p><a href="tel:${TEL}">${PHONE}</a><br><a href="mailto:${EMAIL}">${EMAIL}</a></p></div>
<div><p class="label">Rigs</p><p>${order.map(k => `<a href="/systems/${k}/">${packages[k].name}</a>`).join('<br>')}</p></div>
<div><p class="label">Follow the builds</p><p class="socials">
<a href="https://www.youtube.com/channel/UCKjgT1H8lktykWGHgZ9NeRg" rel="noopener" target="_blank">YouTube</a><br>
<a href="https://www.instagram.com/bandrigs/" rel="noopener" target="_blank">Instagram</a><br>
<a href="https://www.tiktok.com/@bandrigschannel" rel="noopener" target="_blank">TikTok</a></p></div>
</div><div class="wrap foot-base"><span>© 2026 BandRigs</span><span>Behringer, Midas and Shure are trademarks of their owners. BandRigs is an independent builder.</span></div></footer>
</body></html>`;
}

const priceLine = p => p.price ? `<span class="price"><span class="label">Starting at</span> ${p.price}</span>` : `<span class="price"><span class="label">Price</span> Custom quote</span>`;
const gearRow = keys => `<ul class="gear">${keys.map(k => { const g = gear[k]; return `<li><div class="gear-img"><img src="/assets/${g.image}" alt="${esc(g.name)}" loading="lazy" width="1100" height="${g.h}"></div><p class="label">${g.tag}</p><p class="gear-name">${g.name}</p><p class="small muted">${g.desc}</p></li>`; }).join('')}</ul>`;

const steps = [
  ['Tell us about your band', 'Answer four quick questions or give us a call. Who plays, who needs in-ears and what gear you already have.'],
  ['We design it with you', 'You get a signal flow, an equipment list and a fixed quote before anything is ordered. We keep the gear you own when it still makes sense.'],
  ['We build and test it', 'Everything is racked, wired, labeled and configured, then tested as a whole system on our bench.'],
  ['You plug in and play', 'We walk you through it and hand over a setup guide, so load-in is the same every night.'],
];
const faqs = [
  ['Do I need to know what gear I want?', 'No. Tell us who plays and what bugs you about your current setup. Picking the gear is our job.'],
  ['Can I keep the equipment I already own?', 'Yes. We look at your mixer, stage boxes and in-ear gear first and only replace what doesn’t fit the plan.'],
  ['Wired or wireless in-ears?', 'Either, or a mix. Drummers and keys players are often fine wired. Singers and anyone who moves around usually go wireless.'],
  ['What is a personal mix?', 'It’s what one performer hears in their in-ears. Each person who wants their own balance of vocals and instruments needs their own mix.'],
  ['What happens after I send my details?', `We reply within one business day to set up a planning call. Prefer to talk now? Call ${PHONE}.`],
];
const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
const crumbs = list => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: list.map(([n, p], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE + p })) });

const pages = [];
const page = (path, opts) => pages.push({ path, html: layout({ path, ...opts }) });

// Home
page('/', {
  title: 'Custom In-Ear Monitor & Live Mixing Rigs for Bands | BandRigs',
  description: 'BandRigs designs and builds custom in-ear monitor and live mixing racks for bands. Answer 4 questions to see which rig fits your band. Rigs from $5,000.',
  schema: [faqSchema, { '@context': 'https://schema.org', '@type': 'Service', serviceType: 'Custom live sound and in-ear monitor rack design and build', provider: { '@id': SITE + '/#org' },
    offers: order.filter(k => packages[k].price).map(k => ({ '@type': 'Offer', name: packages[k].name, url: `${SITE}/systems/${k}/`, priceSpecification: { '@type': 'PriceSpecification', minPrice: packages[k].amount, priceCurrency: 'USD' } })) }],
  body: `
<section class="hero hero-stage">
<picture class="hero-bg"><source media="(max-width:720px)" srcset="/assets/hero-rack-m.webp"><img src="/assets/hero-rack.webp" alt="BandRigs rack with a WING Rack mixer, Shure PSM 300 transmitters and stage boxes in a road case on a lit stage" width="1672" height="941" fetchpriority="high"></picture>
<div class="wrap hero-inner"><div class="hero-copy">
<p class="label hero-eyebrow">Your next stage starts here</p>
<h1>Your sound.<br>Your stage.<br>Your BandRig.</h1>
<p class="lead">Custom in-ear monitor and live mixing rigs, built around how your band plays. Answer four quick questions to find your starting point.</p>
<div class="actions"><a class="btn btn-primary" href="#finder">Find my rig ${arrow}</a><a class="btn btn-secondary" href="/systems/">See rigs &amp; pricing</a></div>
<p class="hero-tag"><strong>Less setup. More show.</strong><br><span class="muted">Gear and build from $5,000 · Bands anywhere in the US</span></p>
</div></div>
<p class="hero-note">BandRigs concept visualization</p>
</section>

<section class="section finder-section" id="finder" aria-labelledby="finder-title"><div class="wrap finder-grid">
<div class="finder-intro"><p class="label">Rig finder</p><h2 id="finder-title">Which rig fits your band?</h2><p class="muted">Four taps, no sign-up. You’ll see a starting price and what we’d build.</p></div>
<div class="finder" data-finder><noscript><p>The rig finder needs JavaScript. You can still <a href="/plan/">send us your details</a> or call <a href="tel:${TEL}">${PHONE}</a>.</p></noscript></div>
</div></section>

<section class="section" id="how" aria-labelledby="how-title"><div class="wrap">
<div class="section-head"><p class="label">How it works</p><h2 id="how-title">From first call to first show.</h2></div>
<ol class="steps">${steps.map(([t, d], i) => `<li><span class="step-n">0${i + 1}</span><h3>${t}</h3><p class="muted">${d}</p></li>`).join('')}</ol>
</div></section>

<section class="section" aria-labelledby="rigs-title"><div class="wrap">
<div class="section-head split"><div><p class="label">Rigs &amp; pricing</p><h2 id="rigs-title">Start with a size. We tailor the rest.</h2></div><p class="muted">Prices include the gear and the build. Final price depends on how many mixes you need, how much is wireless and what gear you keep.</p></div>
<div class="rig-table" role="list">${order.map(k => { const p = packages[k]; return `<a class="rig-row" role="listitem" href="/systems/${k}/"><span class="rig-name">${p.name}</span><span class="rig-for muted">${p.for}</span>${priceLine(p)}<span class="rig-go" aria-hidden="true"><svg class="tri" viewBox="0 0 10 12" width="9" height="11" aria-hidden="true"><path d="M0 0 10 6 0 12Z" fill="currentColor"/></svg></span></a>`; }).join('')}</div>
</div></section>

<section class="section work" aria-labelledby="work-title"><div class="wrap work-grid">
<figure class="gear-img work-gear"><img src="/assets/wing-front.webp" alt="Behringer WING Rack digital mixer" loading="lazy" width="1100" height="498"></figure>
<div><p class="label">How we build</p><h2 id="work-title">Mixing and in-ears in one road case.</h2>
<ul class="ticks"><li>Mixer, stage box and in-ear transmitters racked together</li><li>Every cable and connection labeled for fast load-in</li><li>Mixes, scenes and wireless frequencies set up before delivery</li><li>Tested as one system, with a setup guide for the band</li></ul>
<a class="quiet" href="/systems/complete/">See the Complete live rig ${arrow}</a></div>
</div></section>

<section class="section" aria-labelledby="faq-title"><div class="wrap faq-grid">
<div><p class="label">Questions</p><h2 id="faq-title">Good to know</h2></div>
<div class="faq">${faqs.map(([q, a]) => `<details><summary>${q}</summary><p class="muted">${a}</p></details>`).join('')}</div>
</div></section>
${ctaBand()}`,
});

function ctaBand() {
  return `<section class="cta-band"><div class="wrap cta-row"><div><h2>Ready to plan your rig?</h2><p class="muted">Tell us about your band. We reply within one business day.</p></div><div class="actions"><a class="btn btn-primary" href="/plan/">Plan my rig ${arrow}</a><a class="btn btn-secondary" href="tel:${TEL}">Call ${PHONE}</a></div></div></section>`;
}

// Systems overview
page('/systems/', {
  title: 'In-Ear Monitor Rigs & Pricing for Bands | BandRigs',
  description: 'Compare BandRigs packages: compact monitoring from $5,000, band in-ear monitoring from $7,500, complete live mixing rigs from $10,000, plus upgrades and custom builds.',
  schema: [crumbs([['Home', '/'], ['Rigs & pricing', '/systems/']])],
  body: `<section class="page-head"><div class="wrap"><p class="label">Rigs &amp; pricing</p><h1>Pick a starting point.</h1><p class="lead">Every rig is designed around your lineup. Prices include the gear and the build, and we work with bands anywhere in the US.</p><a class="quiet" href="/#finder">Not sure? Use the rig finder ${arrow}</a></div></section>
<section class="section tight"><div class="wrap pkg-list">${order.map(k => { const p = packages[k]; return `<article class="pkg"><div class="pkg-main"><p class="label">${p.for}</p><h2><a href="/systems/${k}/">${p.name}</a></h2><p class="muted">${p.summary}</p>${priceLine(p)}</div><ul class="ticks">${p.includes.slice(0, 3).map(i => `<li>${i}</li>`).join('')}</ul><a class="btn btn-secondary" href="/systems/${k}/">Details ${arrow}</a></article>`; }).join('')}</div></section>${ctaBand()}`,
});

// Package pages
for (const k of order) {
  const p = packages[k];
  page(`/systems/${k}/`, {
    title: `${p.name}${p.price ? ` from ${p.price}` : ''} | BandRigs`,
    description: p.meta,
    schema: [crumbs([['Home', '/'], ['Rigs & pricing', '/systems/'], [p.name, `/systems/${k}/`]]), { '@context': 'https://schema.org', '@type': 'Service', name: p.name, description: p.summary, provider: { '@id': SITE + '/#org' }, ...(p.amount ? { offers: { '@type': 'Offer', priceSpecification: { '@type': 'PriceSpecification', minPrice: p.amount, priceCurrency: 'USD' } } } : {}) }],
    body: `<section class="page-head pkg-head"><div class="wrap pkg-head-grid"><div>
<nav class="crumbs" aria-label="Breadcrumb"><a href="/systems/">Rigs &amp; pricing</a> / <span>${p.name}</span></nav>
<p class="label">${p.for}</p><h1>${p.headline}</h1><p class="lead">${p.summary}</p>${priceLine(p)}
<div class="actions"><a class="btn btn-primary" href="/plan/?system=${k}">Plan this rig ${arrow}</a><a class="btn btn-secondary" href="tel:${TEL}">Call ${PHONE}</a></div></div>
<figure class="pkg-photo"><div class="gear-img"><img src="/assets/${gear[p.gear[0]].image}" alt="${esc(gear[p.gear[0]].name)}" width="1100" height="${gear[p.gear[0]].h}"></div><figcaption class="label">Typical gear · ${gear[p.gear[0]].name}</figcaption></figure></div></section>
<section class="section tight"><div class="wrap two-col"><div><h2>What’s included</h2><ul class="ticks">${p.includes.map(i => `<li>${i}</li>`).join('')}</ul></div>
<div><h2>A good fit if…</h2><ul class="ticks">${p.fit.map(i => `<li>${i}</li>`).join('')}</ul></div></div></section>
<section class="section tight"><div class="wrap"><div class="section-head"><h2>Gear we often start with</h2><p class="muted">Examples, not a fixed list. Your mix count, inputs and existing gear decide the final setup.</p></div>${gearRow(p.gear)}</div></section>
${ctaBand()}`,
  });
}

// Plan page (form markup is static; app.js sends it to Bigin)
const sizeOpts = ['Solo artist', 'Duo', '3–4 piece', '5–6 piece', '7 or more', 'Church or production team'];
const timingOpts = ['Within a month', '1–3 months', '3–6 months', 'Just exploring'];
page('/plan/', {
  title: 'Plan Your Rig: Free Consultation | BandRigs',
  description: 'Tell BandRigs about your band, your shows and your current gear. We reply within one business day with next steps for your in-ear or live mixing rig.',
  schema: [crumbs([['Home', '/'], ['Plan my rig', '/plan/']])],
  body: `<section class="page-head"><div class="wrap plan-grid"><div class="plan-intro"><p class="label">Plan my rig</p><h1>Tell us about your band.</h1><p class="lead">Two minutes now saves a lot of back-and-forth. We reply within one business day.</p>
<dl class="specs compact"><div><dt>Phone</dt><dd><a href="tel:${TEL}">${PHONE}</a></dd></div><div><dt>Email</dt><dd><a href="mailto:${EMAIL}">${EMAIL}</a></dd></div></dl>
<div class="finder-summary" data-summary hidden></div></div>
<form class="form" id="plan-form" novalidate>
<div class="form-grid">
<label class="field"><span>Your name <i aria-hidden="true">*</i></span><input name="name" autocomplete="name" required aria-required="true"></label>
<label class="field"><span>Email <i aria-hidden="true">*</i></span><input name="email" type="email" autocomplete="email" required aria-required="true"></label>
<label class="field"><span>Phone</span><input name="phone" type="tel" autocomplete="tel"></label>
<label class="field"><span>Band or act name</span><input name="band" autocomplete="organization"></label>
<label class="field"><span>How many performers?</span><select name="size"><option value="">Choose one</option>${sizeOpts.map(o => `<option>${o}</option>`).join('')}</select></label>
<label class="field"><span>When do you need it?</span><select name="timing"><option value="">Choose one</option>${timingOpts.map(o => `<option>${o}</option>`).join('')}</select></label>
</div>
<label class="field"><span>Which rig are you interested in?</span><select name="system"><option value="">Not sure yet</option>${order.map(k => `<option value="${k}">${packages[k].name}</option>`).join('')}</select></label>
<label class="field"><span>Gear you already have</span><textarea name="gear" rows="3" placeholder="Mixer, in-ear systems, stage boxes, anything you want to keep"></textarea></label>
<label class="field"><span>Anything else?</span><textarea name="message" rows="3" placeholder="Typical venues, what you want to fix, budget range"></textarea></label>
<p class="error" id="plan-error" role="alert" hidden></p>
<button class="btn btn-primary" type="submit">Send my details ${arrow}</button>
<p class="small muted">We only use this to reply to you. No newsletter.</p>
</form></div></section>`,
});

// 404
pages.push({ path: '/404.html', html: layout({ path: '/404.html', title: 'Page not found | BandRigs', description: 'This page doesn’t exist.', body: `<section class="page-head"><div class="wrap"><p class="label">404</p><h1>That page isn’t here.</h1><p class="lead">Try the rig finder or see our rigs and pricing.</p><div class="actions"><a class="btn btn-primary" href="/#finder">Find my rig ${arrow}</a><a class="btn btn-secondary" href="/systems/">Rigs &amp; pricing</a></div></div></section>` }) });

for (const { path, html } of pages) {
  const file = path.endsWith('.html') ? '.' + path : '.' + path + 'index.html';
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
const today = new Date().toISOString().slice(0, 10);
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p => !p.path.endsWith('.html')).map(p => `<url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('built', pages.length, 'pages');
