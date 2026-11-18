// Builds the static BandRigs site: node build.mjs
// Every route gets real HTML (for people and for search engines); app.js only adds the rig finder and the form.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';
import { packages, order, gear } from './data.js';

const SOCIAL = [
  ['YouTube', 'https://www.youtube.com/channel/UCKjgT1H8lktykWGHgZ9NeRg', '<path fill="currentColor" d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.75 15.02V8.98L15.5 12z"/>'],
  ['Instagram', 'https://www.instagram.com/bandrigs/', '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.6" cy="6.4" r="1.3" fill="currentColor"/>'],
  ['TikTok', 'https://www.tiktok.com/@bandrigschannel', '<path fill="currentColor" d="M16.6 2h-3.4v13.1a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V8.8a6.4 6.4 0 1 0 5.4 6.3V8.6a8 8 0 0 0 4.6 1.5V6.7a4.6 4.6 0 0 1-4.6-4.7z"/>'],
];
const socials = cls => `<div class="${cls}">${SOCIAL.map(([n, u, p]) => `<a href="${u}" rel="noopener" target="_blank" aria-label="BandRigs on ${n}"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">${p}</svg></a>`).join('')}</div>`;
const SITE = 'https://bandrigs.com';
// Cache-busting: browsers keep CSS/JS for hours, so each asset URL carries a hash of its content.
const ver = (...files) => createHash('sha256').update(files.map(f => readFileSync(f)).join('')).digest('hex').slice(0, 10);
const DATA_V = ver('data.js');
{ const src = readFileSync('app.js', 'utf8'); const out = src.replace(/from '\/data\.js(\?v=[0-9a-f]+)?'/, `from '/data.js?v=${DATA_V}'`); if (out !== src) writeFileSync('app.js', out); }
const CSS_V = ver('styles.css'), APP_V = ver('app.js');
const PHONE = '858-232-3544', TEL = '+18582323544', EMAIL = 'sales@bandrigs.com';
const arrow = '<span aria-hidden="true" class="arr"><svg class="tri" viewBox="0 0 10 12" width="9" height="11" aria-hidden="true"><path d="M0 0 10 6 0 12Z" fill="currentColor"/></svg></span>';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const org = {
  '@context': 'https://schema.org', '@type': 'Organization', '@id': SITE + '/#org', name: 'BandRigs', url: SITE + '/',
  logo: SITE + '/assets/logo.svg', image: SITE + '/assets/og.jpg', email: EMAIL, telephone: TEL,
  description: 'BandRigs designs and builds custom live mixing and in-ear monitor rack systems for artists and bands anywhere in the US.', areaServed: { '@type': 'Country', name: 'United States' },
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
<link rel="stylesheet" href="/styles.css?v=${CSS_V}">${scripts ? `<script type="module" src="/app.js?v=${APP_V}"></script>` : ''}${ld}
</head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap head-row">
<a class="logo" href="/" aria-label="BandRigs home"><svg class="logo-mark" viewBox="0 0 100 100" width="34" height="34" aria-hidden="true"><g fill="#8ec5ff"><rect x="6" y="12" width="88" height="20" rx="2"/><g fill="#0d0e10"><circle cx="11" cy="22" r="2.2"/><circle cx="89" cy="22" r="2.2"/><rect x="17" y="21.25" width="66" height="1.5" opacity=".35"/></g><rect x="6" y="40" width="88" height="20" rx="2"/><g fill="#0d0e10"><circle cx="11" cy="50" r="2.2"/><circle cx="89" cy="50" r="2.2"/><rect x="17" y="49.25" width="66" height="1.5" opacity=".35"/></g><rect x="6" y="68" width="88" height="20" rx="2"/><g fill="#0d0e10"><circle cx="11" cy="78" r="2.2"/><circle cx="89" cy="78" r="2.2"/><rect x="17" y="77.25" width="66" height="1.5" opacity=".35"/></g></g></svg><span class="logo-text">Band<span>Rigs</span></span></a>
${socials('head-social')}
<nav class="nav" id="nav" aria-label="Main">${nav.map(([h, t]) => `<a href="${h}"${path === h ? ' aria-current="page"' : ''}>${t}</a>`).join('')}${socials('nav-social')}</nav>
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
</div><div class="wrap foot-base"><span>© 2026 BandRigs</span><span>Behringer, Midas, Shure and iConnectivity are trademarks of their owners. BandRigs is an independent builder.</span></div></footer>
</body></html>`;
}

const priceLine = p => p.price ? `<span class="price"><span class="label">Starting at</span> ${p.price}<span class="price-note">Gear and build included, plus shipping</span></span>` : `<span class="price"><span class="label">Price</span> Custom quote</span>`;
const servicesBlock = (tag = 'h2') => `<div class="services"><div class="section-head"><${tag}>Other services</${tag}></div><div class="rig-table" role="list"><a class="rig-row" role="listitem" href="/plan/"><span class="rig-name">Service &amp; support plan</span><span class="rig-for muted">Remote support, firmware updates and mix changes for any rig</span><span class="price"><span class="label">Price</span> $75/mo<span class="price-note">or $50/mo billed annually</span></span><span class="rig-go" aria-hidden="true"><svg class="tri" viewBox="0 0 10 12" width="9" height="11" aria-hidden="true"><path d="M0 0 10 6 0 12Z" fill="currentColor"/></svg></span></a><a class="rig-row" role="listitem" href="tel:${TEL}"><span class="rig-name">Playback tracks built in Ableton</span><span class="rig-for muted">Your stems, click and cues, set up as a show-ready Ableton session</span><span class="price"><span class="label">Price</span> Call for pricing</span><span class="rig-go" aria-hidden="true"><svg class="tri" viewBox="0 0 10 12" width="9" height="11" aria-hidden="true"><path d="M0 0 10 6 0 12Z" fill="currentColor"/></svg></span></a></div></div>`;
const EXTRAS = 'FOH splitting to the house system, antenna distribution and custom or upgraded earphones';
const extrasNote = k => ['compact', 'band'].includes(k)
  ? `<p class="small muted extras">Not included in this rig: ${EXTRAS}. They are available on our <a href="/systems/complete/">Complete live</a> and <a href="/systems/custom/">Custom</a> rigs. Shipping and the support plan are extra.</p>`
  : ['complete', 'custom'].includes(k) ? `<p class="small muted extras">Available with this rig and quoted for your show: ${EXTRAS}. Shipping and the support plan are extra.</p>` : '';
const gearRow = keys => `<ul class="gear">${keys.map(k => { const g = gear[k]; return `<li><div class="gear-img"><img src="/assets/${g.image}" alt="${esc(g.name)}" loading="lazy" width="1100" height="${g.h}"></div><p class="label">${g.tag}</p><p class="gear-name">${g.name}</p><p class="small muted">${g.desc}</p></li>`; }).join('')}</ul>`;


const ART = {
  support: '<svg viewBox="0 0 240 120" width="240" height="120" aria-hidden="true"><g fill="none" stroke="#8ec5ff" stroke-width="3" stroke-linecap="round"><path d="M88 70V58a32 32 0 0 1 64 0v12"/><rect x="80" y="66" width="16" height="28" rx="5"/><rect x="144" y="66" width="16" height="28" rx="5"/><path d="M152 94c0 10-10 14-24 14"/></g><circle cx="124" cy="108" r="4" fill="#8ec5ff"/></svg>',
  router: '<svg viewBox="0 0 240 120" width="240" height="120" aria-hidden="true"><g fill="none" stroke="#a4a8ae" stroke-width="2"><path d="M70 52 62 14M170 52 178 14"/><rect x="30" y="52" width="180" height="44" rx="4" fill="#23272c"/></g><g fill="#8ec5ff"><circle cx="52" cy="74" r="3"/><circle cx="66" cy="74" r="3"/><circle cx="80" cy="74" r="3" opacity=".4"/></g><g fill="#3a4048"><rect x="120" y="66" width="12" height="16" rx="1"/><rect x="138" y="66" width="12" height="16" rx="1"/><rect x="156" y="66" width="12" height="16" rx="1"/><rect x="174" y="66" width="12" height="16" rx="1"/></g></svg>',
  case: '<svg viewBox="0 0 240 150" width="240" height="150" aria-hidden="true"><rect x="30" y="20" width="180" height="110" rx="6" fill="#23272c" stroke="#a4a8ae" stroke-width="2"/><g fill="none" stroke="#a4a8ae" stroke-width="2"><path d="M30 40h180M30 110h180"/><rect x="95" y="8" width="50" height="12" rx="3"/></g><g fill="#a4a8ae"><rect x="26" y="16" width="16" height="16" rx="2"/><rect x="198" y="16" width="16" height="16" rx="2"/><rect x="26" y="118" width="16" height="16" rx="2"/><rect x="198" y="118" width="16" height="16" rx="2"/><rect x="70" y="68" width="14" height="22" rx="2"/><rect x="156" y="68" width="14" height="22" rx="2"/></g></svg>',
  name: '<svg viewBox="0 0 260 90" width="260" height="90" aria-hidden="true"><defs><filter id="glow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect x="6" y="22" width="248" height="46" rx="3" fill="#111316" stroke="#3a4048" stroke-width="2"/><circle cx="18" cy="45" r="4" fill="#0d0e10" stroke="#3a4048"/><circle cx="242" cy="45" r="4" fill="#0d0e10" stroke="#3a4048"/><text x="130" y="54" text-anchor="middle" font-family="Barlow Condensed, sans-serif" font-weight="600" font-size="26" letter-spacing="6" fill="#8ec5ff" filter="url(#glow)">BANDRIGS</text></svg>',
};
const pieceRow = keys => `<ul class="gear pieces">${keys.map(k => { const g = gear[k]; const pic = g.art ? ART[g.art] : `<img src="/assets/${g.image}" alt="${esc(g.name)}" loading="lazy">`; return `<li><div class="gear-img">${pic}</div><p class="label">${g.tag}</p><p class="gear-name">${g.name}</p><p class="piece-price">${g.price || 'Priced with your build'}</p><p class="small muted">${g.desc}</p></li>`; }).join('')}</ul>`;

const steps = [
  ['Answer four questions', 'Right below this, tap through four quick questions about your lineup. You see a starting price and the rig we’d build in under a minute.'],
  ['Send us your details', 'One short form, or call <span class="nowrap">858-232-3544</span>. We reply within one business day to set up a free call about your show.'],
  ['Approve your design', 'You get a signal flow, an equipment list and a fixed quote before anything is ordered. We keep the gear you own when it still makes sense.'],
  ['We build it, you play', 'We rack, wire, label and test the whole system, then walk you through it with a setup guide so load-in is the same every night.'],
];
const faqs = [
  ['Do I need to know what gear I want?', 'No. Tell us who is on stage, what you play, the rooms you usually work and what frustrates you about your current setup. Picking the mixer, stage box, in-ear systems and rack is our job. You get a written design with an equipment list and signal flow before anything is ordered, so you can see exactly what you are paying for.'],
  ['What does the price include?', 'Every starting price includes the gear and the build: racking, wiring, labeling, configuring your mixes and testing the whole system on our bench. Shipping the finished rig to you is extra. Your final price depends on how many personal mixes you need, how many players go wireless and what gear you already own.'],
  ['Can I keep the equipment I already own?', 'Yes. We look at your mixer, stage boxes, in-ear systems and cables first and only replace what does not fit the plan. Keeping gear that still works lowers your price, and we will tell you honestly when something is worth replacing.'],
  ['Can I buy the gear myself?', 'Yes. We send you the equipment list, you buy it from any dealer and have it drop shipped to us. We build, configure and test the rig at our service rate of $125 an hour, plus shipping the finished rig back to you.'],
  ['Wired or wireless in-ears?', 'Either, or a mix. Drummers and keyboard players stay in one spot, so wired in-ears are simple and cost less. Singers, guitarists and anyone who moves around usually go wireless with a system like the Shure PSM 300. We plan the mix of wired and wireless around how your band actually performs.'],
  ['What is a personal mix?', 'It is what one performer hears in their in-ears. The drummer might want lots of bass and click, the singer mostly vocals and keys. Each person who wants their own balance needs their own mix, and the number of mixes is one of the biggest things that sets the size of your rig. Each player adjusts their own mix from their own iPad or phone over the rig’s Wi-Fi, without waiting on a sound engineer, and the mixes are saved in the mixer so they sound the same every night.'],
  ['How much time will this save at load-in?', 'A lot. The rack arrives prewired and labeled, so instead of running cables and stands for every wedge and channel you connect power, the stage box and a few lines. Because your monitor mixes are already dialed in, sound check becomes a quick line check and a clean feed to the house engineer.'],
  ['Can you run our backing tracks and click?', 'Yes. Playback with click and cues can run from the same rack, from a Mac mini or a playback interface like the iConnectivity PlayAUDIO1U. The PlayAUDIO1U adds redundancy: two Mac minis run the same show in sync, and if the main one stops, it switches to the backup automatically so the tracks, click and cues keep playing and the audience never knows. We can also build your playback tracks in Ableton, with your stems, click and cues set up as a show-ready session. Call for pricing on track building.'],
  ['What if something goes wrong after I get it?', 'We walk you through the rig and hand over a setup guide when it is done. For ongoing help, our service and support plan adds to any rig. It is $75 a month, or $50 a month when you pay for a year up front, and covers remote support, firmware updates and mix changes when you need them.'],
  ['Do you work with bands outside your area?', 'Yes. We design and build rigs for artists and bands anywhere in the US. Planning happens on calls, and the finished rig ships to you ready to plug in.'],
  ['What happens after I send my details?', `We reply within one business day to set up a planning call about your band and your show. Prefer to talk now? Call ${PHONE}.`],
];
const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
const crumbs = list => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: list.map(([n, p], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE + p })) });

const pages = [];
const page = (path, opts) => pages.push({ path, html: layout({ path, ...opts }) });

// Home
page('/', {
  title: 'Custom In-Ear Monitor & Live Mixing Rigs for Artists | BandRigs',
  description: 'Custom in-ear monitor and live mixing rigs for artists and bands, designed and built by BandRigs. Answer 4 questions to find your rig. Rigs from $4,995.',
  schema: [faqSchema, { '@context': 'https://schema.org', '@type': 'Service', serviceType: 'Custom live sound and in-ear monitor rack design and build', provider: { '@id': SITE + '/#org' },
    offers: order.filter(k => packages[k].price).map(k => ({ '@type': 'Offer', name: packages[k].name, url: `${SITE}/systems/${k}/`, priceSpecification: { '@type': 'PriceSpecification', minPrice: packages[k].amount, priceCurrency: 'USD' } })) }],
  body: `
<section class="hero hero-stage">
<picture class="hero-bg"><source media="(max-width:720px)" srcset="/assets/hero-rack-m.webp"><img src="/assets/hero-rack.webp" alt="BandRigs rack with a WING Rack mixer, Shure PSM 300 transmitters and stage boxes in a road case on a lit stage" width="1672" height="941" fetchpriority="high"></picture>
<div class="wrap hero-inner"><div class="hero-copy">

<h1>Your sound.<br>Your stage.<br>Your BandRig.</h1>
<p class="lead">Custom in-ear monitor and live mixing rigs, built around how your band plays. Answer four quick questions to find your starting point.</p>
<div class="actions"><a class="btn btn-primary" href="#finder">Find my rig ${arrow}</a><a class="btn btn-secondary" href="/systems/">See rigs &amp; pricing</a></div>
<p class="hero-tag"><strong>Less setup. More show.</strong><br><span class="muted">Gear and build from $4,995 · Artists &amp; Bands anywhere in the US</span></p>
</div></div>

</section>

<section class="section why" id="why" aria-labelledby="why-title"><div class="wrap why-grid">
<div><h2 id="why-title">Why BandRigs exists</h2><p class="lead why-lead">BandRigs builds complete sound and in-ear systems for working bands that want a consistent show without becoming audio engineers.</p><p class="why-cred">Our team has over 40 years of performing experience. We know firsthand what artists go through: rushed load-ins, monitor mixes you can’t hear, and a different room every night.</p><p class="muted">For solo artists, duos, tribute and cover bands, worship teams and touring acts anywhere in the US.</p></div>
<div class="why-body">
<p>You got into music to play, not to spend an hour running cables and chasing feedback. Most bands sound great in rehearsal, then fight every room they walk into: a new stage, a new house engineer, monitor wedges that squeal, and a mix nobody on stage can really hear. Our custom in-ear monitor (IEM) and live mixing rigs let you spend more time in the music and less time setting up gear.</p>
<p>Everything lives in one rolling rack, wired, labeled and tested before it ships. Your monitor mixes are saved on a digital mixer like the Behringer WING, the players who move get wireless in-ear monitors, and playback with click and cues runs from the same rack. Roll it in, plug in power and a couple of cables, and you are line checked and ready to play.</p>
<p><strong class="hl">Why this gear?</strong> We build around Behringer, Midas and Shure because it is solid on the road, sounds great and gives working bands pro-level features at a price that fits a real budget. It is the gear we would put on our own stage, and it is easy to service and replace anywhere in the country.</p>
<ul class="why-points">
<li><h3>Faster setup</h3><p class="muted">The rack arrives prewired. Load-in drops from a pile of cables and stands to a few connections.</p></li>
<li><h3>The same mix every night</h3><p class="muted">Your in-ear mixes are saved in the rig, so every show sounds like your best rehearsal.</p></li>
<li><h3>Shorter sound checks</h3><p class="muted">Monitors are already dialed in. Check a few lines, hand the engineer a clean feed and play.</p></li>
</ul>
</div></div>
<div class="wrap"><figure class="wide-shot why-shot"><picture><source media="(max-width:720px)" srcset="/assets/band-live-m.webp"><img src="/assets/band-live.webp" alt="Band playing a live club show with in-ear monitors, with a BandRigs rolling rack and laptop for playback on stage beside the drum riser" loading="lazy" width="1672" height="941"></picture></figure></div>
</section>

<section class="section" id="how" aria-labelledby="how-title"><div class="wrap">
<div class="section-head"><h2 id="how-title">Your next steps</h2><p class="muted">Getting your rig takes four steps. The first one takes about a minute.</p></div>
<ol class="steps">${steps.map(([t, d], i) => `<li><span class="step-n">0${i + 1}</span><h3>${t}</h3><p class="muted">${d}</p></li>`).join('')}</ol>
<p class="how-next"><a class="btn btn-primary" href="#finder">Start step 1 ${arrow}</a></p>
</div></section>

<section class="section finder-section" id="finder" aria-labelledby="finder-title"><div class="wrap finder-grid">
<div class="finder-intro"><h2 id="finder-title">Start here: which rig fits your band?</h2><p class="muted">Four taps, no sign-up. You’ll see a starting price and what we’d build.</p></div>
<div class="finder" data-finder><noscript><p>The rig finder needs JavaScript. You can still <a href="/plan/">send us your details</a> or call <a href="tel:${TEL}">${PHONE}</a>.</p></noscript></div>
</div></section>



<section class="section" aria-labelledby="rigs-title"><div class="wrap">
<div class="section-head split"><div><h2 id="rigs-title">In-ear monitor rigs, sized to your band.</h2></div><p class="muted"><strong class="hl">Every price includes the gear and the build. Shipping the rig to you is extra.</strong> Final price depends on how many mixes you need, how much is wireless and what gear you keep. Prefer to buy the gear yourself? Have it drop shipped to us and we build it at our <span class="nowrap">$125/hr</span> service rate, plus shipping back to you.</p></div>
<div class="rig-table" role="list">${order.map(k => { const p = packages[k]; return `<a class="rig-row" role="listitem" href="/systems/${k}/"><span class="rig-name">${p.name}</span><span class="rig-for muted">${p.for}</span>${priceLine(p)}<span class="rig-go" aria-hidden="true"><svg class="tri" viewBox="0 0 10 12" width="9" height="11" aria-hidden="true"><path d="M0 0 10 6 0 12Z" fill="currentColor"/></svg></span></a>`; }).join('')}</div>
${servicesBlock('h3')}
</div></section>

<section class="section work" aria-labelledby="work-title"><div class="wrap work-grid">
<figure class="gear-img work-gear"><img src="/assets/wing-front.webp" alt="Behringer WING Rack digital mixer" loading="lazy" width="1100" height="498"></figure>
<div><h2 id="work-title">Mixing and in-ears in one road case.</h2>
<ul class="ticks"><li>Mixer, stage box and in-ear transmitters racked together</li><li>Every cable and connection labeled for fast load-in</li><li>Mixes, scenes and wireless frequencies set up before delivery</li><li>Tested as one system, with a setup guide for the band</li></ul>
<a class="quiet" href="/systems/complete/">See the Complete live rig ${arrow}</a></div>
</div></section>

<section class="section" aria-labelledby="faq-title"><div class="wrap faq-grid">
<div><h2 id="faq-title">In-ear monitor rig FAQ</h2></div>
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
  description: 'Compare BandRigs packages: solo and duo rigs from $4,995, band rigs from $9,995, complete live mixing rigs from $10,995, plus upgrades and custom builds.',
  schema: [crumbs([['Home', '/'], ['Rigs & pricing', '/systems/']])],
  body: `<section class="page-head"><div class="wrap"><h1>Pick a starting point.</h1><p class="lead">Every rig is designed around your lineup. Prices include the gear and the build. Shipping the finished rig to you is extra. We work with artists and bands anywhere in the US. You can also buy the gear yourself, have it drop shipped to us, and we build it at our <span class="nowrap">$125/hr</span> service rate, plus shipping back to you.</p><a class="quiet" href="/#finder">Not sure? Use the rig finder ${arrow}</a></div></section>
<section class="section tight"><div class="wrap pkg-list">${order.map(k => { const p = packages[k]; return `<article class="pkg"><div class="pkg-main"><p class="label">${p.for}</p><h2><a href="/systems/${k}/">${p.name}</a></h2><p class="muted">${p.summary}</p>${priceLine(p)}</div><ul class="ticks">${p.includes.slice(0, 3).map(i => `<li>${i}</li>`).join('')}</ul><a class="btn btn-secondary" href="/systems/${k}/">Details ${arrow}</a></article>`; }).join('')}</div></section><section class="section tight"><div class="wrap">${servicesBlock()}</div></section>${ctaBand()}`,
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
${p.photos ? `<figure class="pkg-photo"><img src="/assets/${p.photos.front[0]}" alt="Mockup of the ${esc(p.name)} with all upgrades in a rolling rack case, front view" width="${p.photos.front[1]}" height="${p.photos.front[2]}"><figcaption class="label">Mockup · Shown with all upgrades</figcaption></figure>` : `<figure class="pkg-photo"><div class="gear-img"><img src="/assets/${gear[p.gear[0]].image}" alt="${esc(gear[p.gear[0]].name)}" width="1100" height="${gear[p.gear[0]].h}"></div><figcaption class="label">Typical gear · ${gear[p.gear[0]].name}</figcaption></figure>`}</div></section>
<section class="section tight"><div class="wrap two-col"><div><h2>What’s included</h2><ul class="ticks">${p.includes.map(i => `<li>${i}</li>`).join('')}</ul>${extrasNote(k)}</div>
<div><h2>A good fit if…</h2><ul class="ticks">${p.fit.map(i => `<li>${i}</li>`).join('')}</ul></div></div></section>
${p.rig ? `<section class="section tight"><div class="wrap"><div class="section-head"><h2>The basic rig</h2><p class="muted">What goes in the rack. Prices are typical US retail for each piece, for reference. Your rig price covers the gear and the build.</p></div>${pieceRow(p.rig)}</div></section>` : ''}
${p.rig ? '' : `<section class="section tight"><div class="wrap"><div class="section-head"><h2>Gear we often start with</h2><p class="muted">Examples, not a fixed list. Your mix count, inputs and existing gear decide the final setup.</p></div>${gearRow(p.gear)}</div></section>`}
${p.upgrades ? `<section class="section tight"><div class="wrap"><div class="section-head"><h2>Popular upgrades</h2><p class="muted">Add any of these to your rig.</p></div>${pieceRow(p.upgrades)}${p.photos ? `<figure class="wide-shot mock-one"><img src="/assets/${p.photos.angle[0]}" alt="Mockup of the ${esc(p.name)} in an open flight case on wheels" loading="lazy" width="${p.photos.angle[1]}" height="${p.photos.angle[2]}"></figure><p class="label mock-cap">Mockup · The solo / duo artist rig with all upgrades: PlayAUDIO1U playback, two Mac minis, the backlit name panel and the rolling flight case</p>` : ''}</div></section>` : ''}
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
  body: `<section class="page-head"><div class="wrap plan-grid"><div class="plan-intro"><h1>Tell us about your band.</h1><p class="lead">Two minutes now saves a lot of back-and-forth.<br>We reply within one business day.</p>
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
