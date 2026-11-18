// Shared by build.mjs (static pages) and app.js (rig finder). Prices set by Ken, 2026-11-17.
export const order = ['compact', 'band', 'complete', 'upgrade', 'custom'];

export const packages = {
  compact: {
    name: 'Solo / Duo artist rig', for: 'Solo performers and duos', price: '$5,000', amount: 5000,
    headline: 'Your whole show in one small rack.',
    summary: 'Built for a solo performer or duo. Mix your vocals, instruments and backing tracks from the stage, hear your own in-ear mix, and set up the whole rig without a crew. Duos add a second PSM 300.',
    meta: 'Solo and duo rig from $5,000: Behringer WING Rack, Midas DL8, Shure PSM 300 in-ears and Furman power in one rolling rack, built by BandRigs for solo performers and duos.',
    includes: ['Planning call and a written system design', 'Your mixer, stage box and wireless in-ears racked together', 'Wi-Fi router so you can mix from a tablet or phone', 'Wired, labeled and tested, with saved starting mixes', 'One-page setup guide'],
    fit: ['You perform solo or as a duo, with tracks or live', 'You want to run your own sound from the stage', 'You want something you can set up without a crew in minutes', 'You need an A/B splitter snake option for FOH'],
    rig: ['rack', 'furman', 'wing', 'router', 'psm300', 'dl8'],
    upgrades: ['playaudio', 'flightcase', 'macmini', 'namepanel', 'support'],
    photos: { front: ['solo-rig-front.webp', 1254, 1254], angle: ['solo-rig-angle.webp', 1536, 1024] },
    gear: ['wing', 'psm300'],
  },
  band: {
    name: 'Band rig', for: 'Bands of 3 to 6', price: '$11,500', amount: 11500,
    headline: 'Every player hears their own mix.',
    summary: 'Built for bands of 3 to 6. Four players get their own wireless in-ear mix (add two more for a six-piece), the whole band plugs into one stage box, and you run it all from a tablet. One rolling rack, the same setup every night.',
    meta: 'Band in-ear rig from $11,500 for bands of 3 to 6: Behringer WING Rack, Midas DL16 stage box, four Shure PSM 300 wireless in-ears and Furman power in one rolling rack, built by BandRigs.',
    includes: ['Mix plan: who hears what, and how it connects', 'Your mixer, stage box and wireless in-ears racked together', 'Four wireless in-ear systems, one mix per player', 'Wi-Fi router so each player can adjust their mix from a phone', 'Wired, labeled and tested, with saved starting mixes', 'Setup guide and a walkthrough with your band'],
    fit: ['Your band has 3 to 6 players', 'Your band uses wedges and nobody can hear', 'Each player wants a different mix', 'You want load-in to be the same every night', 'You need an A/B splitter snake option for FOH'],
    rig: ['rack12', 'furman', 'wing', 'router', 'dl16', 'psm300band'],
    upgrades: ['psm300extra', 'playaudio', 'macmini', 'namepanel', 'support'],
    gear: ['wing', 'dl16', 'psm300'],
  },
  complete: {
    name: 'Complete live rig', for: 'Bands that run their own sound', price: '$12,500', amount: 12500,
    headline: 'Mixing and in-ears in one road case.',
    summary: 'Your front-of-house mix, every in-ear mix and your stage connections, built into one rack around a digital mixer.',
    meta: 'Complete live mixing and in-ear rigs for bands, from $12,500. WING Rack, stage box and in-ears in one road case, built by BandRigs.',
    includes: ['Full plan: inputs, outputs, in-ear mixes and venue hand-off', 'Rack layout, routing, power and cabling', 'Digital mixer, stage box and in-ear systems, configured', 'Bench-tested as a complete system before delivery', 'Labels, setup guide and an operating walkthrough'],
    fit: ['You run your own sound at most gigs', 'You want one case instead of a pile of gear', 'You want the same show at every venue'],
    upgrades: ['support'],
    gear: ['wing', 's16', 'dn4816', 'psm300'],
  },
  upgrade: {
    name: 'Upgrade your rig', for: 'Bands with gear already', price: '', amount: 0,
    headline: 'Keep what works. Fix what doesn’t.',
    summary: 'We start with the gear you already own, find what’s missing and add only that.',
    meta: 'Upgrade your existing band rig: BandRigs reviews your mixer, stage boxes and in-ears and adds only what’s missing.',
    includes: ['Review of your mixer, stage boxes and in-ear gear', 'Check of connections, mix buses and outputs', 'A clear keep, replace or add list', 'Updated routing, labels and setup guide'],
    fit: ['You own a digital mixer already', 'Your rig works but setup is messy', 'You’re adding players or going wireless'],
    upgrades: ['support'],
    gear: ['s16', 'dl16', 'dn4888', 'dn4816'],
  },
  custom: {
    name: 'Custom rig', for: 'Churches, productions, 16+ mixes', price: '', amount: 0,
    headline: 'Bigger shows, planned properly.',
    summary: 'For large lineups, worship teams and touring productions that need more mixes or more routing.',
    meta: 'Custom live sound and in-ear monitor systems for churches, productions and large lineups, designed and built by BandRigs.',
    includes: ['Planning sessions with your team', 'Mix count, routing and expansion plan', 'Design compared against your budget', 'Build, test, labels and training'],
    fit: ['You need more than 16 in-ear mixes', 'Several people run the system', 'You need it to grow over time'],
    upgrades: ['support'],
    gear: ['wing', 's32', 'dn4888', 'dn4816'],
  },
};

// price: typical US retail per piece (Sweetwater, BSW, Markertek, Musician's Friend, Multilink; checked 2026-11-18). Product photos supplied by Ken.
// art: drawn illustration for pieces without a fixed model.
export const gear = {
  wing: { name: 'Behringer WING Rack', tag: 'Digital mixer', image: 'gear/wing-rack.webp', h: 477, price: '$1,799', desc: 'Runs the show mix and every in-ear mix from one rack unit.' },
  psm300: { name: 'Shure PSM 300', tag: 'Wireless in-ears', image: 'gear/psm300-p3t.webp', h: 491, price: '$989', desc: 'Stereo wireless in-ear system with earphones. One transmitter per mix.' },
  s16: { name: 'Behringer S16', tag: 'Stage box', image: 's16.webp', h: 293, desc: '16 inputs on stage, one network cable back to the rack.' },
  s32: { name: 'Behringer S32', tag: 'Stage box', image: 's32.webp', h: 393, desc: '32 inputs for bigger input lists.' },
  dl16: { name: 'Midas DL16', tag: 'Stage box', image: 'dl16.webp', h: 301, price: '$729', desc: '16 Midas preamps and 8 outputs on stage, over one network cable.' },
  dn4816: { name: 'Midas DN4816-O', tag: 'In-ear outputs', image: 'dn4816-o.webp', h: 152, desc: '16 outputs to feed up to 8 stereo in-ear mixes.' },
  dn4888: { name: 'Midas DN4888', tag: 'Line I/O', image: 'dn4888.webp', h: 152, desc: '8 line inputs and outputs for playback and routing.' },
  dl8: { name: 'Midas DL8', tag: 'Stage box', image: 'gear/dl8.webp', h: 365, price: '$669', desc: '8 Midas preamps and 8 outputs, powered over one network cable.' },
  furman: { name: 'Furman PL-8C', tag: 'Power conditioner', image: 'gear/furman.webp', h: 339, price: '$327.95', desc: 'Clean, protected power for everything in the rack, with pull-out rack lights.' },
  router: { name: 'MikroTik L009 Wi-Fi router', tag: 'Wireless control', image: 'gear/router.webp', h: 935, price: '$109', desc: 'Mix from a tablet or phone anywhere on stage.' },
  playaudio: { name: 'iConnectivity PlayAUDIO1U', tag: 'Playback interface', image: 'gear/playaudio1u.webp', h: 184, price: '$1,199.99', desc: 'Runs tracks from two computers and switches to the backup instantly.' },
  flightcase: { name: 'Gator G-Tour 8U shock rack case', tag: 'Rolling flight case', image: 'gear/flightcase-8u.webp', h: 1137, price: '$999.99', desc: 'Swap the rolling rack for a shock-mounted ATA case with locking lids. Price is for the 8-space size, from Sweetwater.' },
  support: { name: 'Service & support plan', tag: 'Monthly subscription', art: 'support', price: '$49/mo', desc: 'Ongoing help with your rig: remote support, firmware updates and mix changes when you need them.' },
  rack12: { name: 'Gator G-Tour 12U rolling rack', tag: 'Rolling rack', image: 'gear/rollingrack-8u.webp', h: 1100, price: '$699.99', desc: '12-space ATA road case on casters, room for the whole band rig. Price from Markertek.' },
  psm300band: { name: 'Shure PSM 300 × 4', tag: 'Wireless in-ears', image: 'gear/psm300-p3t.webp', h: 491, price: '$3,956 ($989 each)', desc: 'Four stereo wireless in-ear systems, one per player. They mount two per rack space.' },
  psm300extra: { name: 'Extra Shure PSM 300', tag: 'More wireless mixes', image: 'gear/psm300-p3t.webp', h: 491, price: '$989 each', desc: 'Add wireless in-ears for players five and six. The rack has room for both.' },
  rack: { name: 'Gator GRR-8L rolling rack', tag: 'Rolling rack', image: 'gear/rollingrack-8u.webp', h: 1100, price: '$489.99', desc: '8-space rack on casters with front and rear rails and locking covers. Price from Sweetwater.' },
  macmini: { name: 'Apple Mac mini', tag: 'Tracks computers', image: 'gear/macmini.webp', h: 358, price: '$899 each', desc: 'Two computers running your tracks, one as a live backup.' },
  namepanel: { name: 'Backlit name panel', tag: 'Custom 1U panel', art: 'name', price: '$199', desc: 'One rack space with your artist name cut out and backlit in blue.' },
};

// Rig finder: answers -> package key
export function recommend(a) {
  if (a.goal === 'upgrade') return 'upgrade';
  if (a.who === 'solo' || a.who === 'duo') return 'compact'; // the solo/duo rig already includes the mixer
  if (a.who === 'production' || (a.people > 6 && a.goal !== 'everything')) return 'custom';
  if (a.goal === 'everything') return 'complete';
  return a.people <= 2 ? 'compact' : 'band';
}
