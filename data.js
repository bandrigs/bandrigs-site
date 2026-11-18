// Shared by build.mjs (static pages) and app.js (rig finder). Prices set by Ken, 2026-11-17.
export const order = ['compact', 'band', 'complete', 'upgrade', 'custom'];

export const packages = {
  compact: {
    name: 'Solo artist rig', for: 'Solo artists', price: '$5,000', amount: 5000,
    headline: 'Your whole show in one small rack.',
    summary: 'A digital mixer, a stage box and wireless in-ears in one rack, so a solo artist can run their own sound and hear exactly what they want.',
    meta: 'Solo artist rig from $5,000: Behringer WING Rack, Midas DL8, Shure PSM 300 in-ears and Furman power in one rack, built by BandRigs.',
    includes: ['Planning call and a written system design', 'Your mixer, stage box and wireless in-ears racked together', 'Wi-Fi router so you can mix from a tablet or phone', 'Wired, labeled and tested, with saved starting mixes', 'One-page setup guide'],
    fit: ['You perform solo, with tracks or live', 'You want to run your own sound from the stage', 'You want something you can set up alone in minutes'],
    rig: ['furman', 'wing', 'router', 'psm300', 'dl8'],
    upgrades: ['playaudio', 'flightcase', 'macmini', 'namepanel'],
    illustration: 'solo-rack.svg',
    gear: ['wing', 'psm300'],
  },
  band: {
    name: 'Band monitoring', for: 'Duos and bands up to 8', price: '$7,500', amount: 7500,
    headline: 'Every player gets their own mix.',
    summary: 'One rack that gives each performer their own in-ear mix, wired or wireless, from rehearsal to show.',
    meta: 'In-ear monitor rigs for bands, from $7,500. A personal mix for every player, wired or wireless, built by BandRigs.',
    includes: ['Mix plan: who hears what, and how it connects', 'Personal in-ear mixes for each performer', 'Wired and wireless positions where they fit', 'Racked, labeled and tested, with saved starting mixes', 'Setup guide and a walkthrough with your band'],
    fit: ['Your band uses wedges and nobody can hear', 'Each player wants a different mix', 'You want load-in to be the same every night'],
    gear: ['psm300', 'dl16', 'dn4816'],
  },
  complete: {
    name: 'Complete live rig', for: 'Bands that run their own sound', price: '$10,000', amount: 10000,
    headline: 'Mixing and in-ears in one road case.',
    summary: 'Your front-of-house mix, every in-ear mix and your stage connections, built into one rack around a digital mixer.',
    meta: 'Complete live mixing and in-ear rigs for bands, from $10,000. WING Rack, stage box and in-ears in one road case, built by BandRigs.',
    includes: ['Full plan: inputs, outputs, in-ear mixes and venue hand-off', 'Rack layout, routing, power and cabling', 'Digital mixer, stage box and in-ear systems, configured', 'Bench-tested as a complete system before delivery', 'Labels, setup guide and an operating walkthrough'],
    fit: ['You run your own sound at most gigs', 'You want one case instead of a pile of gear', 'You want the same show at every venue'],
    gear: ['wing', 's16', 'dn4816', 'psm300'],
  },
  upgrade: {
    name: 'Upgrade your rig', for: 'Bands with gear already', price: '', amount: 0,
    headline: 'Keep what works. Fix what doesn’t.',
    summary: 'We start with the gear you already own, find what’s missing and add only that.',
    meta: 'Upgrade your existing band rig: BandRigs reviews your mixer, stage boxes and in-ears and adds only what’s missing.',
    includes: ['Review of your mixer, stage boxes and in-ear gear', 'Check of connections, mix buses and outputs', 'A clear keep, replace or add list', 'Updated routing, labels and setup guide'],
    fit: ['You own a digital mixer already', 'Your rig works but setup is messy', 'You’re adding players or going wireless'],
    gear: ['s16', 'dl16', 'dn4888', 'dn4816'],
  },
  custom: {
    name: 'Custom rig', for: 'Churches, productions, 16+ mixes', price: '', amount: 0,
    headline: 'Bigger shows, planned properly.',
    summary: 'For large lineups, worship teams and touring productions that need more mixes or more routing.',
    meta: 'Custom live sound and in-ear monitor systems for churches, productions and large lineups, designed and built by BandRigs.',
    includes: ['Planning sessions with your team', 'Mix count, routing and expansion plan', 'Design compared against your budget', 'Build, test, labels and training'],
    fit: ['You need more than 16 in-ear mixes', 'Several people run the system', 'You need it to grow over time'],
    gear: ['wing', 's32', 'dn4888', 'dn4816'],
  },
};

// price: typical US retail per piece (Sweetwater / BSW, checked 2026-11-18), shown for reference.
// remote: source of the product shot; deploy fetches it, trims the white background and serves it at /assets/<image>.
// art: drawn illustration for pieces without a fixed model.
export const gear = {
  wing: { name: 'Behringer WING Rack', tag: 'Digital mixer', image: 'wing-front.webp', h: 498, price: '$1,799', desc: 'Runs the show mix and every in-ear mix from one rack unit.' },
  psm300: { name: 'Shure PSM 300', tag: 'Wireless in-ears', image: 'psm300.webp', h: 1100, price: '$989', desc: 'Stereo wireless in-ear system with earphones. One transmitter per mix.' },
  s16: { name: 'Behringer S16', tag: 'Stage box', image: 's16.webp', h: 293, desc: '16 inputs on stage, one network cable back to the rack.' },
  s32: { name: 'Behringer S32', tag: 'Stage box', image: 's32.webp', h: 393, desc: '32 inputs for bigger input lists.' },
  dl16: { name: 'Midas DL16', tag: 'Stage box', image: 'dl16.webp', h: 301, desc: '16 Midas preamps and 8 outputs on stage.' },
  dn4816: { name: 'Midas DN4816-O', tag: 'In-ear outputs', image: 'dn4816-o.webp', h: 152, desc: '16 outputs to feed up to 8 stereo in-ear mixes.' },
  dn4888: { name: 'Midas DN4888', tag: 'Line I/O', image: 'dn4888.webp', h: 152, desc: '8 line inputs and outputs for playback and routing.' },
  dl8: { name: 'Midas DL8', tag: 'Stage box', image: 'gear/dl8.webp', remote: '83fd35bf58WAqvZDD1AdhA67KVJ0lLDeJrTMsl6L.jpg', price: '$669', desc: '8 Midas preamps and 8 outputs, powered over one network cable.' },
  furman: { name: 'Furman M-8x2', tag: 'Power conditioner', image: 'gear/furman.webp', remote: 'e35e203ac4e1ouMewDfKcYrVJlDMCHM5pi3GFBmz.jpg', price: '$169.95', desc: 'Clean, protected power for everything in the rack.' },
  router: { name: 'Half-rack Wi-Fi router', tag: 'Wireless control', art: 'router', price: '', desc: 'Mix from a tablet or phone anywhere on stage.' },
  playaudio: { name: 'iConnectivity PlayAUDIO1U', tag: 'Playback interface', image: 'gear/playaudio1u.webp', remote: '2071dd5519iCVL96z2VUmmOMTstGpMQtwCXDZwQh.jpg', price: '$1,199.99', desc: 'Runs tracks from two computers and switches to the backup instantly.' },
  flightcase: { name: 'Flight case', tag: 'Road case', art: 'case', price: '', desc: 'Shock-mounted case sized to your rack, built for the road.' },
  macmini: { name: 'Apple Mac mini', tag: 'Tracks computers', image: 'gear/macmini.webp', remote: 'c978fcff4bu0nnFXeON3dl0JSb1O5k9ktj4r3Wiq.png', price: '$899 each', desc: 'Two computers running your tracks, one as a live backup.' },
  namepanel: { name: 'Backlit name panel', tag: 'Custom 1U panel', art: 'name', price: '', desc: 'One rack space with your artist name cut out and backlit in blue.' },
};

// Rig finder: answers -> package key
export function recommend(a) {
  if (a.goal === 'upgrade') return 'upgrade';
  if (a.who === 'solo') return 'compact'; // Ken's solo rig already includes the mixer
  if (a.people > 16 || a.who === 'production') return 'custom';
  if (a.goal === 'everything') return 'complete';
  return a.people <= 1 ? 'compact' : 'band';
}
