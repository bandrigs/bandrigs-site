// Builds the static BandRigs site: node build.mjs
// Every route gets real HTML (for people and for search engines); app.js only adds the rig finder and the form.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';
import { packages, order, gear } from './data.js';

const SOCIAL = [
  ['YouTube', 'https://www.youtube.com/@BandRigsChannel/videos', '<path fill="currentColor" d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.75 15.02V8.98L15.5 12z"/>'],
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
  sameAs: ['https://www.youtube.com/@BandRigsChannel', 'https://www.instagram.com/bandrigs/', 'https://www.tiktok.com/@bandrigschannel'],
};

// Google Analytics 4 (GA4) + Google tag. Loads only on the live domain so preview links don't count as visits.
// The /thanks/ page records a generate_lead event, which Google Ads imports as the lead conversion.
const GA_ID = 'G-QB3NVGBJ0Y';
// Meta (Facebook/Instagram) pixel. Same rule: live domain only. /thanks/ records a Lead.
const META_PIXEL = '1512121330810481';
const metaPixel = path => !META_PIXEL ? '' : `<script>(function(){var h=location.hostname;if(h!=='bandrigs.com'&&h!=='www.bandrigs.com')return;!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL}');fbq('track','PageView');${path === '/thanks/' ? "fbq('track','Lead');" : ''}})();</script>`;
const gtag = path => `<script>(function(){var h=location.hostname;if(h!=='bandrigs.com'&&h!=='www.bandrigs.com')return;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${GA_ID}');${path === '/thanks/' ? "gtag('event','generate_lead',{form:'rig_plan'});" : ''}})();</script>`;

function layout({ path, title, description, body, schema = [], image = '/assets/og.jpg', scripts = true, noindex = false }) {
  const url = SITE + path;
  const nav = [['/systems/', 'Rigs & pricing'], ['/#how', 'How it works'], ['/#faq', 'FAQ']];
  const ld = [org, ...schema].map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
${gtag(path)}${metaPixel(path)}
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">${noindex ? '<meta name="robots" content="noindex">' : ''}
<link rel="canonical" href="${url}"><meta name="theme-color" content="#0d0e10">
<meta property="og:type" content="website"><meta property="og:site_name" content="BandRigs"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE + image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/styles.css?v=${CSS_V}">${scripts ? `<script type="module" src="/app.js?v=${APP_V}"></script>` : ''}${ld}
</head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap head-row">
<a class="logo" href="/" aria-label="BandRigs home"><svg class="logo-mark" viewBox="0 0 100 100" width="34" height="34" aria-hidden="true"><g fill="none" stroke="#8ec5ff" stroke-width="5" stroke-linecap="round"><rect x="8.5" y="4.5" width="83" height="76" rx="12"/><path d="M8.5 30.5h83M8.5 55.5h83M17 81v8M83 81v8"/></g><g fill="#8ec5ff"><circle cx="20" cy="17.5" r="3.3"/><circle cx="80" cy="17.5" r="3.3"/><circle cx="20" cy="43" r="3.3"/><circle cx="80" cy="43" r="3.3"/><circle cx="20" cy="68" r="3.3"/><circle cx="80" cy="68" r="3.3"/><circle cx="17" cy="92.5" r="4.5"/><circle cx="83" cy="92.5" r="4.5"/></g></svg><span class="logo-text">Band<span>Rigs</span></span></a>
${socials('head-social')}
<nav class="nav" id="nav" aria-label="Main">${nav.map(([h, t]) => `<a href="${h}"${path === h ? ' aria-current="page"' : ''}>${t}</a>`).join('')}${socials('nav-social')}</nav>
<a class="btn btn-primary btn-sm head-cta" href="/#finder">Plan my rig</a>
<button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav" aria-label="Menu"><span></span><span></span></button>
</div></header>
<main id="main">${body}</main>
<footer class="site-footer"><div class="wrap foot-grid">
<div><a class="logo" href="/" aria-label="BandRigs home"><svg class="logo-mark" viewBox="0 0 100 100" width="34" height="34" aria-hidden="true"><g fill="none" stroke="#8ec5ff" stroke-width="5" stroke-linecap="round"><rect x="8.5" y="4.5" width="83" height="76" rx="12"/><path d="M8.5 30.5h83M8.5 55.5h83M17 81v8M83 81v8"/></g><g fill="#8ec5ff"><circle cx="20" cy="17.5" r="3.3"/><circle cx="80" cy="17.5" r="3.3"/><circle cx="20" cy="43" r="3.3"/><circle cx="80" cy="43" r="3.3"/><circle cx="20" cy="68" r="3.3"/><circle cx="80" cy="68" r="3.3"/><circle cx="17" cy="92.5" r="4.5"/><circle cx="83" cy="92.5" r="4.5"/></g></svg><span class="logo-text">Band<span>Rigs</span></span></a><p class="muted">Custom live mixing and in-ear monitor rigs, designed and built for your band.</p></div>
<div><p class="label">Talk to us</p><p><a href="tel:${TEL}">${PHONE}</a><br><a href="mailto:${EMAIL}">${EMAIL}</a></p></div>
<div><p class="label">Rigs</p><p>${order.map(k => `<a href="/systems/${k}/">${packages[k].name}</a>`).join('<br>')}</p></div>
<div><p class="label">Follow the builds</p><p class="socials">
<a href="https://www.youtube.com/@BandRigsChannel/videos" rel="noopener" target="_blank">YouTube</a><br>
<a href="https://www.instagram.com/bandrigs/" rel="noopener" target="_blank">Instagram</a><br>
<a href="https://www.tiktok.com/@bandrigschannel" rel="noopener" target="_blank">TikTok</a></p></div>
</div><div class="wrap foot-base"><span>© 2026 BandRigs · <a href="/terms/">Terms</a> · <a href="/privacy/">Privacy</a></span><span>Behringer, Midas, Shure and iConnectivity are trademarks of their owners. BandRigs is an independent builder.</span></div></footer>
</body></html>`;
}

const fullName = p => `${p.name}: ${p.sub}`; // titles, schema, form options
const rigSub = (p, tag = 'span') => `<${tag} class="rig-sub">${esc(p.sub)}</${tag}>`;
const priceLine = p => p.price ? `<span class="price"><span class="label">Starting at</span> ${p.price}<span class="price-note">Gear and build included, plus shipping</span></span>` : `<span class="price"><span class="label">Price</span> Custom quote</span>`;
const servicesBlock = (tag = 'h2') => `<div class="services"><div class="section-head"><${tag}>Other services</${tag}></div><div class="rig-table" role="list"><a class="rig-row" role="listitem" href="/plan/"><span class="rig-name">Service &amp; support plan</span><span class="rig-for muted">Remote support, firmware updates and mix changes for any rig</span><span class="price"><span class="label">Price</span> $75/mo<span class="price-note">or $50/mo billed annually</span></span><span class="rig-go" aria-hidden="true"><svg class="tri" viewBox="0 0 10 12" width="9" height="11" aria-hidden="true"><path d="M0 0 10 6 0 12Z" fill="currentColor"/></svg></span></a><a class="rig-row" role="listitem" href="tel:${TEL}"><span class="rig-name">Playback tracks built in Ableton</span><span class="rig-for muted">Your stems, click and cues, set up as a show-ready Ableton session</span><span class="price"><span class="label">Price</span> Call for pricing</span><span class="rig-go" aria-hidden="true"><svg class="tri" viewBox="0 0 10 12" width="9" height="11" aria-hidden="true"><path d="M0 0 10 6 0 12Z" fill="currentColor"/></svg></span></a></div></div>`;
const EXTRAS = 'FOH splitting to the house system, antenna distribution and custom or upgraded earphones';
const extrasNote = k => ['compact', 'band'].includes(k)
  ? `<p class="small muted extras">Not included in this rig: ${k === 'band' ? 'FOH splitting to the house system and custom or upgraded earphones' : EXTRAS}.${k === 'band' ? ' The RF Venue antenna pack is available as an upgrade below.' : ''} They are available on <a href="/systems/complete/">${packages.complete.name}</a> and <a href="/systems/custom/">${packages.custom.name}</a> rigs. Shipping and the support plan are extra.</p>`
  : ['complete', 'custom'].includes(k) ? `<p class="small muted extras">Available with this rig and quoted for your show: ${EXTRAS}. Shipping and the support plan are extra.</p>` : '';
const gearRow = keys => `<ul class="gear">${keys.map(k => { const g = gear[k]; return `<li><div class="gear-img"><img src="/assets/${g.image}" alt="${esc(g.name)}" loading="lazy" width="1100" height="${g.h}"></div><p class="label">${g.tag}</p><p class="gear-name">${g.name}</p><p class="small muted">${g.desc}</p></li>`; }).join('')}</ul>`;


const ART = {
  tracks: '<svg viewBox="0 0 240 120" width="240" height="120" aria-hidden="true"><g fill="none" stroke-linecap="round" stroke-width="3"><path stroke="#8ec5ff" d="M36 44h14M58 34v20M66 28v32M74 38v12M82 30v28M90 40v8M98 26v36M106 36v16M114 42v4"/><path stroke="#a4a8ae" d="M36 80h14M58 74v12M66 70v20M74 76v8M82 72v16M90 78v4M98 68v24M106 74v12M114 79v2"/></g><g fill="#23272c" stroke="#3a4048" stroke-width="2"><rect x="132" y="24" width="72" height="30" rx="3"/><rect x="132" y="66" width="72" height="30" rx="3"/></g><g fill="#8ec5ff"><circle cx="146" cy="39" r="4"/><rect x="156" y="36" width="38" height="6" rx="2" opacity=".5"/></g><g fill="#a4a8ae"><path d="M142 74l10 7-10 7z"/><rect x="156" y="78" width="38" height="6" rx="2" opacity=".5"/></g></svg>',
  support: '<svg viewBox="0 0 240 120" width="240" height="120" aria-hidden="true"><g fill="none" stroke="#8ec5ff" stroke-width="3" stroke-linecap="round"><path d="M88 70V58a32 32 0 0 1 64 0v12"/><rect x="80" y="66" width="16" height="28" rx="5"/><rect x="144" y="66" width="16" height="28" rx="5"/><path d="M152 94c0 10-10 14-24 14"/></g><circle cx="124" cy="108" r="4" fill="#8ec5ff"/></svg>',
  router: '<svg viewBox="0 0 240 120" width="240" height="120" aria-hidden="true"><g fill="none" stroke="#a4a8ae" stroke-width="2"><path d="M70 52 62 14M170 52 178 14"/><rect x="30" y="52" width="180" height="44" rx="4" fill="#23272c"/></g><g fill="#8ec5ff"><circle cx="52" cy="74" r="3"/><circle cx="66" cy="74" r="3"/><circle cx="80" cy="74" r="3" opacity=".4"/></g><g fill="#3a4048"><rect x="120" y="66" width="12" height="16" rx="1"/><rect x="138" y="66" width="12" height="16" rx="1"/><rect x="156" y="66" width="12" height="16" rx="1"/><rect x="174" y="66" width="12" height="16" rx="1"/></g></svg>',
  case: '<svg viewBox="0 0 240 150" width="240" height="150" aria-hidden="true"><rect x="30" y="20" width="180" height="110" rx="6" fill="#23272c" stroke="#a4a8ae" stroke-width="2"/><g fill="none" stroke="#a4a8ae" stroke-width="2"><path d="M30 40h180M30 110h180"/><rect x="95" y="8" width="50" height="12" rx="3"/></g><g fill="#a4a8ae"><rect x="26" y="16" width="16" height="16" rx="2"/><rect x="198" y="16" width="16" height="16" rx="2"/><rect x="26" y="118" width="16" height="16" rx="2"/><rect x="198" y="118" width="16" height="16" rx="2"/><rect x="70" y="68" width="14" height="22" rx="2"/><rect x="156" y="68" width="14" height="22" rx="2"/></g></svg>',
  name: '<svg viewBox="0 0 260 90" width="260" height="90" aria-hidden="true"><defs><filter id="glow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect x="6" y="22" width="248" height="46" rx="3" fill="#111316" stroke="#3a4048" stroke-width="2"/><circle cx="18" cy="45" r="4" fill="#0d0e10" stroke="#3a4048"/><circle cx="242" cy="45" r="4" fill="#0d0e10" stroke="#3a4048"/><text x="130" y="54" text-anchor="middle" font-family="Barlow Condensed, sans-serif" font-weight="600" font-size="26" letter-spacing="6" fill="#8ec5ff" filter="url(#glow)">BANDRIGS</text></svg>',
};
const pieceRow = keys => `<ul class="gear pieces">${keys.map(k => { const g = gear[k]; const pic = g.art ? ART[g.art] : `<img src="/assets/${g.image}" alt="${esc(g.name)}" loading="lazy">`; return `<li><div class="gear-img${g.fill ? ' fill' : ''}">${pic}</div><p class="label">${g.tag}</p><p class="gear-name">${g.name}</p><p class="piece-price">${g.price || 'Priced with your build'}</p><p class="small muted">${g.desc}</p></li>`; }).join('')}</ul>`;

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
    offers: order.filter(k => packages[k].price).map(k => ({ '@type': 'Offer', name: fullName(packages[k]), url: `${SITE}/systems/${k}/`, priceSpecification: { '@type': 'PriceSpecification', minPrice: packages[k].amount, priceCurrency: 'USD' } })) }],
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
<div class="rig-table" role="list">${order.map(k => { const p = packages[k]; return `<a class="rig-row" role="listitem" href="/systems/${k}/"><span class="rig-name">${p.name}${rigSub(p)}</span><span class="rig-for muted">${p.for}</span>${priceLine(p)}<span class="rig-go" aria-hidden="true"><svg class="tri" viewBox="0 0 10 12" width="9" height="11" aria-hidden="true"><path d="M0 0 10 6 0 12Z" fill="currentColor"/></svg></span></a>`; }).join('')}</div>
<div class="rig-shots"><a class="rig-shot" href="/systems/compact/"><img src="/assets/solo-live.webp" alt="Solo acoustic artist performing with in-ear monitors and a BandRigs rolling rack with laptop playback beside him" loading="lazy" width="1100" height="619"><span class="label">${packages.compact.name} · ${esc(packages.compact.sub)}</span></a><a class="rig-shot" href="/systems/band/"><img src="/assets/band-full.webp" alt="Five-piece band performing live with wireless in-ear monitors and a BandRigs rack on stage" loading="lazy" width="1100" height="619"><span class="label">${packages.band.name} · ${esc(packages.band.sub)}</span></a></div>
${servicesBlock('h3')}
</div></section>

<section class="section work" aria-labelledby="work-title"><div class="wrap work-grid">
<figure class="gear-img work-gear"><img src="/assets/wing-front.webp" alt="Behringer WING Rack digital mixer" loading="lazy" width="1100" height="498"></figure>
<div><h2 id="work-title">Mixing and in-ears in one road case.</h2>
<ul class="ticks"><li>Mixer, stage box and in-ear transmitters racked together</li><li>Every cable and connection labeled for fast load-in</li><li>Mixes, scenes and wireless frequencies set up before delivery</li><li>Tested as one system, with a setup guide for the band</li></ul>
<a class="quiet" href="/systems/complete/">See ${packages.complete.name}, our ${packages.complete.sub.toLowerCase()} ${arrow}</a></div>
</div></section>

<section class="section" id="faq" aria-labelledby="faq-title"><div class="wrap faq-grid">
<div><h2 id="faq-title">In-ear monitor rig FAQ</h2></div>
<div class="faq">${faqs.map(([q, a]) => `<details><summary>${q}</summary><p class="muted">${a}</p></details>`).join('')}</div>
</div></section>
${ctaBand()}`,
});

function ctaBand() {
  return `<section class="cta-band"><div class="wrap cta-row"><div><h2>Ready to plan your rig?</h2><p class="muted">Tell us about your band. We reply within one business day.</p></div><div class="actions"><a class="btn btn-primary" href="/#finder">Plan my rig ${arrow}</a><a class="btn btn-secondary" href="tel:${TEL}">Call ${PHONE}</a></div></div></section>`;
}

// Systems overview
page('/systems/', {
  title: 'In-Ear Monitor Rigs & Pricing for Bands | BandRigs',
  description: 'Compare BandRigs rigs: The Troubadour solo and duo rig from $4,995, The CenterStage full band rig from $9,995, The Headliner complete live rig from $10,995, plus The Encore upgrades and The Signature custom builds.',
  schema: [crumbs([['Home', '/'], ['Rigs & pricing', '/systems/']])],
  body: `<section class="page-head"><div class="wrap"><h1>Pick a starting point.</h1><p class="lead">Every rig is designed around your lineup. Prices include the gear and the build. Shipping the finished rig to you is extra. We work with artists and bands anywhere in the US. You can also buy the gear yourself, have it drop shipped to us, and we build it at our <span class="nowrap">$125/hr</span> service rate, plus shipping back to you.</p><a class="quiet" href="/#finder">Not sure? Use the rig finder ${arrow}</a></div></section>
<section class="section tight"><div class="wrap pkg-list">${order.map(k => { const p = packages[k]; return `<article class="pkg"><div class="pkg-main"><h2><a href="/systems/${k}/">${p.name}</a></h2>${rigSub(p, 'p')}<p class="label">${p.for}</p><p class="muted">${p.summary}</p>${priceLine(p)}</div><ul class="ticks">${p.includes.slice(0, 3).map(i => `<li>${i}</li>`).join('')}</ul><a class="btn btn-secondary" href="/systems/${k}/">Details ${arrow}</a></article>`; }).join('')}</div></section><section class="section tight"><div class="wrap">${servicesBlock()}</div></section>${ctaBand()}`,
});

// Package pages
for (const k of order) {
  const p = packages[k];
  page(`/systems/${k}/`, {
    title: `${fullName(p)}${p.price ? ` from ${p.price}` : ''} | BandRigs`,
    description: p.meta,
    schema: [crumbs([['Home', '/'], ['Rigs & pricing', '/systems/'], [p.name, `/systems/${k}/`]]), { '@context': 'https://schema.org', '@type': 'Service', name: fullName(p), description: p.summary, provider: { '@id': SITE + '/#org' }, ...(p.amount ? { offers: { '@type': 'Offer', priceSpecification: { '@type': 'PriceSpecification', minPrice: p.amount, priceCurrency: 'USD' } } } : {}) }],
    body: `<section class="page-head pkg-head"><div class="wrap pkg-head-grid"><div>
<nav class="crumbs" aria-label="Breadcrumb"><a href="/systems/">Rigs &amp; pricing</a> / <span>${p.name}</span></nav>
<h1 class="pkg-title">${p.name}</h1>${rigSub(p, 'p')}<p class="pkg-tagline">${p.headline}</p><p class="label">${p.for}</p><p class="lead">${p.summary}</p>${priceLine(p)}
<div class="actions"><a class="btn btn-primary" href="/plan/?system=${k}">Plan this rig ${arrow}</a><a class="btn btn-secondary" href="tel:${TEL}">Call ${PHONE}</a></div></div>
${p.photos ? `<figure class="pkg-photo"><img src="/assets/${p.photos.front[0]}" alt="Mockup of ${esc(p.name)} with all upgrades in a rolling rack case, front view" width="${p.photos.front[1]}" height="${p.photos.front[2]}"><figcaption class="label">Mockup · Shown with all upgrades</figcaption></figure>` : `<figure class="pkg-photo"><div class="gear-img"><img src="/assets/${gear[p.gear[0]].image}" alt="${esc(gear[p.gear[0]].name)}" width="1100" height="${gear[p.gear[0]].h}"></div><figcaption class="label">Typical gear · ${gear[p.gear[0]].name}</figcaption></figure>`}</div></section>
<section class="section tight"><div class="wrap two-col"><div><h2>What’s included</h2><ul class="ticks">${p.includes.map(i => `<li>${i}</li>`).join('')}</ul>${extrasNote(k)}</div>
<div><h2>A good fit if…</h2><ul class="ticks">${p.fit.map(i => `<li>${i}</li>`).join('')}</ul></div></div></section>
${p.rig ? `<section class="section tight"><div class="wrap"><div class="section-head"><h2>The basic rig</h2><p class="muted">What goes in the rack. Prices are typical US retail for each piece, for reference. Your rig price covers the gear and the build.</p></div>${pieceRow(p.rig)}</div></section>` : ''}
${p.rig ? '' : `<section class="section tight"><div class="wrap"><div class="section-head"><h2>Gear we often start with</h2><p class="muted">Examples, not a fixed list. Your mix count, inputs and existing gear decide the final setup.</p></div>${gearRow(p.gear)}</div></section>`}
${p.upgrades ? `<section class="section tight"><div class="wrap"><div class="section-head"><h2>Popular upgrades</h2><p class="muted">Add any of these to your rig.</p></div>${pieceRow(p.upgrades)}${p.photos ? `<figure class="wide-shot mock-one"><img src="/assets/${p.photos.angle[0]}" alt="Mockup of ${esc(p.name)} in an open flight case on wheels" loading="lazy" width="${p.photos.angle[1]}" height="${p.photos.angle[2]}"></figure><p class="label mock-cap">Mockup · ${p.name} with all upgrades: PlayAUDIO1U playback, two Mac minis, the backlit name panel and the rolling flight case</p>` : ''}</div></section>` : ''}
${ctaBand()}`,
  });
}

// Plan page (form markup is static; app.js sends it to Zoho CRM)
const sizeOpts = ['Solo artist', 'Duo', '3–4 piece', '5–6 piece', '7 or more', 'Church or production team'];
const timingOpts = ['Within a month', '1–3 months', '3–6 months', 'Just exploring'];
page('/plan/', {
  title: 'Plan Your Rig: Free Consultation | BandRigs',
  description: 'Tell BandRigs about your band, your shows and your current gear. We reply within one business day with next steps for your in-ear or live mixing rig.',
  schema: [crumbs([['Home', '/'], ['Plan my rig', '/plan/']])],
  body: `<section class="page-head plan-head"><div class="wrap plan-grid"><div class="plan-intro"><h1>Tell us about your band.</h1><p class="lead">Two minutes now saves a lot of back-and-forth.<br>We reply within one business day.</p>
<dl class="specs compact"><div><dt>Phone</dt><dd><a href="tel:${TEL}">${PHONE}</a></dd></div><div><dt>Email</dt><dd><a href="mailto:${EMAIL}">${EMAIL}</a></dd></div></dl>
<div class="finder-summary" data-summary hidden></div>
<p class="change-rig"><a href="/#finder-restart">Need to change your rig selection?</a></p></div>
<form class="form" id="plan-form" novalidate>
<div class="form-grid">
<label class="field"><span>Your name <i aria-hidden="true">*</i></span><input name="name" autocomplete="name" required aria-required="true"></label>
<label class="field"><span>Email <i aria-hidden="true">*</i></span><input name="email" type="email" autocomplete="email" required aria-required="true"></label>
<label class="field"><span>Phone</span><input name="phone" type="tel" autocomplete="tel"></label>
<label class="field"><span>Band or act name</span><input name="band" autocomplete="organization"></label>
<label class="field"><span>How many performers?</span><select name="size"><option value="">Choose one</option>${sizeOpts.map(o => `<option>${o}</option>`).join('')}</select></label>
<label class="field"><span>When do you need it?</span><select name="timing"><option value="">Choose one</option>${timingOpts.map(o => `<option>${o}</option>`).join('')}</select></label>
</div>
<label class="field"><span>Which rig are you interested in?</span><select name="system"><option value="">Not sure yet</option>${order.map(k => `<option value="${k}">${esc(fullName(packages[k]))}</option>`).join('')}</select></label>
<div class="form-grid">
<label class="field"><span>Gear you already have</span><textarea name="gear" rows="2" placeholder="Mixer, in-ear systems, stage boxes, anything you want to keep"></textarea></label>
<label class="field"><span>Anything else?</span><textarea name="message" rows="2" placeholder="Typical venues, what you want to fix, budget range"></textarea></label>
</div>
<label class="consent"><input type="checkbox" name="sms" value="yes"><span>Yes, BandRigs may text me about my inquiry, quote, build and support at the phone number above. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is optional and not required to buy. See our <a href="/privacy/">Privacy Policy</a> and <a href="/terms/">Terms</a>.</span></label>
<p class="error" id="plan-error" role="alert" hidden></p>
<div class="form-submit"><button class="btn btn-primary" type="submit">Send my details ${arrow}</button>
<p class="small muted">We only use this to reply to you. No newsletter.</p></div>
</form></div></section>`,
});

// 404
const legal = (h1, updated, sections) => `<section class="page-head"><div class="wrap"><h1>${h1}</h1><p class="small muted">Last updated ${updated}</p></div></section>
<section class="section tight"><div class="wrap legal">${sections.map(([h, body]) => `<h2>${h}</h2>${body}`).join('\n')}</div></section>`;
const UPDATED = 'November 18, 2026';

page('/terms/', {
  title: 'Terms of Service | BandRigs',
  description: 'BandRigs terms of service: quotes, payment schedule, gear, builds, shipping, warranty, cancellations and the service and support plan.',
  schema: [crumbs([['Home', '/'], ['Terms of Service', '/terms/']])],
  body: legal('Terms of Service', UPDATED, [
    ['Who we are', `<p>BandRigs designs, builds and supports custom live mixing and in-ear monitor rigs for artists and bands in the United States. These terms apply to every quote, build, service and subscription we provide. By approving a quote or paying a deposit, you agree to them.</p>`],
    ['Quotes and system design', `<p>Before anything is ordered, we send you a written design with an equipment list, signal flow and a fixed quote. Starting prices on this site are guides. Your final price depends on the number of mixes, how much is wireless and what gear you already own. A quote is valid for 14 days, because gear prices and stock change often.</p>`],
    ['Payment schedule', `<table class="pay"><thead><tr><th>Service</th><th>To start</th><th>Before delivery</th></tr></thead><tbody>
<tr><td>Rig build (gear and build included)</td><td>75% deposit when you approve the quote. We order gear only after it clears.</td><td>25% balance after the bench test, before the rig ships. We send photos or video of the finished rig first.</td></tr>
<tr><td>Build with gear you buy yourself</td><td>50% of the estimated hours at $125/hr when you approve the plan.</td><td>Remaining hours, plus return shipping, before the rig ships back.</td></tr>
<tr><td>Playback tracks in Ableton</td><td>50% when we start.</td><td>50% on delivery of the finished session.</td></tr>
<tr><td>Service &amp; support plan</td><td colspan="2">$75 a month billed monthly, or $50 a month billed once a year in advance.</td></tr>
</tbody></table>
<p>Shipping, insurance and any sales tax are added to the final invoice. Invoices are due when issued. A rig ships only after it is paid in full.</p>`],
    ['Gear you supply', `<p>If you buy your own gear, have it drop shipped to us. You are responsible for buying the right items on the equipment list and for any manufacturer warranty claims. We inspect everything when it arrives and tell you right away if something is damaged, missing or wrong. Extra time caused by wrong or faulty parts is billed at $125/hr.</p>`],
    ['Changes to a build', `<p>If you change the design after gear is ordered, we send an updated quote. Extra gear and time are added to your balance. Items already opened or configured may not be returnable.</p>`],
    ['Cancellations and refunds', `<p>If you cancel before we order gear, we refund your deposit in full. After gear is ordered, we refund your deposit minus any supplier restocking fees, return shipping and build time already completed. Custom parts, such as a backlit name panel, are not refundable once made. The monthly support plan can be cancelled at any time and stops at the end of the paid month. The annual plan is not refundable, and your support continues to the end of the year you paid for.</p>`],
    ['Shipping and delivery', `<p>Finished rigs ship insured to the address you give us. Check the rig when it arrives and tell us within 3 days about any shipping damage, so we can file a claim with the carrier. Delivery dates are estimates, because they depend on gear availability and carriers.</p>`],
    ['Warranty', `<p>All gear carries the manufacturer’s own warranty, and we help you use it. We stand behind our workmanship, including wiring, connectors, labeling and configuration, for 90 days after delivery. If something we built fails in that time, we fix it at no charge for labor. This does not cover damage from drops, liquids, misuse, unapproved changes or normal wear.</p>`],
    ['Service & support plan', `<p>The plan covers remote help with your rig, firmware updates and mix or scene changes, during normal business hours. It does not cover replacement gear, in-person visits or shipping, which we quote separately.</p>`],
    ['Text message terms', `<p>BandRigs sends text messages about your inquiry, quote, build, delivery and support to customers who agree to receive them. Message frequency varies. Message and data rates may apply. Reply STOP to cancel at any time; you will get one message confirming you have opted out. Reply HELP, email <a href="mailto:${EMAIL}">${EMAIL}</a> or call <a href="tel:${TEL}">${PHONE}</a> for help. Carriers are not liable for delayed or undelivered messages. Consent to receive texts is not a condition of buying anything. See our <a href="/privacy/">Privacy Policy</a> for how we handle your number.</p>`],
    ['Your responsibilities', `<p>You are responsible for safe use of the rig, for setting safe in-ear listening levels and for following venue power and safety rules. In-ear monitors can be very loud, so protect your hearing.</p>`],
    ['Limitation of liability', `<p>To the extent the law allows, our total liability for any claim is limited to the amount you paid us for the build or service involved. We are not liable for lost bookings, lost income or other indirect losses, for example if gear fails during a show.</p>`],
    ['Trademarks', `<p>Behringer, Midas, Shure, iConnectivity, Apple, Ableton and Gator are trademarks of their owners. BandRigs is an independent builder and is not affiliated with them.</p>`],
    ['Changes and contact', `<p>We may update these terms. The version in place when you approve a quote applies to that order. Questions? Email <a href="mailto:${EMAIL}">${EMAIL}</a> or call <a href="tel:${TEL}">${PHONE}</a>.</p>`],
  ]),
});

page('/privacy/', {
  title: 'Privacy Policy | BandRigs',
  description: 'How BandRigs collects, uses and protects the details you send through the rig finder, the plan my rig form, email and phone.',
  schema: [crumbs([['Home', '/'], ['Privacy Policy', '/privacy/']])],
  body: legal('Privacy Policy', UPDATED, [
    ['The short version', `<p>We collect only what you send us so we can reply and plan your rig. We do not sell your information, we do not use advertising trackers on this site, and there is no newsletter.</p>`],
    ['What we collect', `<ul><li><strong>Details you send us:</strong> your name, email, phone, band or act name, band size, timing, the rig you’re interested in, the gear you own and any message, through the Plan my rig form, email or phone.</li><li><strong>Rig finder answers:</strong> your answers are kept in your own browser for the current visit so the form can include them. They are only sent to us if you submit the form.</li><li><strong>Basic technical data:</strong> like any website, our host receives your IP address and browser details when pages load, for security and to keep the site running.</li></ul>`],
    ['How we use it', `<p>We use your details to reply to you, plan and quote your rig, deliver and support it, send invoices and keep business records. We contact you only about your inquiry or order.</p>`],
    ['Who we share it with', `<p>We use a small number of service providers to run the business. Each handles your data only to provide its service to us:</p><ul><li><strong>Zoho CRM</strong> stores form submissions and customer records.</li><li><strong>Google Workspace</strong> handles our email.</li><li><strong>Cloudflare</strong> hosts this website.</li><li><strong>Google Fonts</strong> serves the site’s fonts, so Google receives your IP address when pages load.</li><li><strong>Our SMS provider</strong> delivers text messages you have agreed to receive.</li><li><strong>Shipping carriers</strong> receive your name, address and phone to deliver your rig.</li></ul><p>We do not sell, rent or share your personal information with third parties for their marketing. We may also share information if the law requires it.</p>`],
    ['Text messages (SMS)', `<p>If you give us your mobile number and agree to receive texts, we use it only to message you about your inquiry, quote, build, delivery and support. Message frequency varies. Message and data rates may apply. Reply STOP to opt out at any time, or HELP for help.</p><p><strong>No mobile information will be shared with third parties or affiliates for marketing or promotional purposes.</strong> Text messaging opt-in data and consent are never shared with any third parties. Our messaging provider processes your number only to deliver our messages to you.</p>`],
    ['Cookies', `<p>This site does not use advertising or analytics cookies. The rig finder uses your browser’s session storage, which clears when you close the tab.</p>`],
    ['How long we keep it', `<p>We keep inquiry details for as long as they are useful to follow up, and customer and order records for as long as tax and business rules require.</p>`],
    ['Your choices', `<p>You can ask us to show you, correct or delete the personal information we hold about you. Email <a href="mailto:${EMAIL}">${EMAIL}</a> and we will reply within 30 days. Depending on where you live, such as California, you may have additional rights under state law, and we honor them.</p>`],
    ['Security and children', `<p>We use reputable providers and limit access to your details. No method is perfect, but we take reasonable steps to protect your information. This site is not meant for children under 13, and we do not knowingly collect their information.</p>`],
    ['Changes and contact', `<p>If we change this policy, we will update the date at the top. Questions? Email <a href="mailto:${EMAIL}">${EMAIL}</a> or call <a href="tel:${TEL}">${PHONE}</a>.</p>`],
  ]),
});

// Confirmation page after the Plan my rig form sends (not indexed, not in the sitemap)
page('/thanks/', { title: 'Thanks, we got it | BandRigs', description: 'Your rig details were sent to BandRigs.', noindex: true,
  body: `<section class="page-head thanks"><div class="wrap"><div class="form sent"><p class="label ok">Sent</p><h1 data-thanks>Thanks. We’ve got it.</h1><p class="lead">We’ll reply within one business day.</p><p class="muted">Show coming up fast? Call <a href="tel:${TEL}" style="white-space:nowrap">${PHONE}</a>.</p><div class="actions"><a class="btn btn-primary" href="/systems/">Browse rigs &amp; pricing ${arrow}</a><a class="btn btn-secondary" href="/">Back to home</a></div></div></div></section>` });

pages.push({ path: '/404.html', html: layout({ path: '/404.html', title: 'Page not found | BandRigs', description: 'This page doesn’t exist.', body: `<section class="page-head"><div class="wrap"><p class="label">404</p><h1>That page isn’t here.</h1><p class="lead">Try the rig finder or see our rigs and pricing.</p><div class="actions"><a class="btn btn-primary" href="/#finder">Find my rig ${arrow}</a><a class="btn btn-secondary" href="/systems/">Rigs &amp; pricing</a></div></div></section>` }) });

for (const { path, html } of pages) {
  const file = path.endsWith('.html') ? '.' + path : '.' + path + 'index.html';
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
const today = new Date().toISOString().slice(0, 10);
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p => !p.path.endsWith('.html') && p.path !== '/thanks/').map(p => `<url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('built', pages.length, 'pages');
