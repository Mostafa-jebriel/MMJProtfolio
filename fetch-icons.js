// Downloads each app's icon from Google Play into ./icons/
// Usage (Node 18+):  node fetch-icons.js
const fs = require('fs');

const APPS = [
  ['Ticketore', 'com.ticketore.eg'],
  ['Save Plus', 'com.teleoceans.saveplus'],
  ['Cura24h', 'com.cura.cura24h'],
  ['Cura24h Seller', 'com.cara.cura24h_seller'],
  ['Business Connect', 'com.pingosys.mmj.pingosys'],
  ['Operations & Follow-up Platform', 'com.pingsys.mmj.pavepixel'],
  ['Tajeer Rent a Car', 'com.mmj.tajeercarrent'],
  ['Elnaggar Clinic', 'com.mmj.einaggarclinic'],
  ['Urban Landscape Platform', 'com.mmj.pingsys.urban_scene'],
  ['ISCO', 'com.mmj.iscoksa'],
  ['My Ploto', 'net.myploto.myploto'],
  ['Alarm Medicine', 'com.mmj.alarm_medicine'],
  ['YalaZeen', 'com.mmj.pingsys.yalazeen'],
];

// same naming rule the portfolio page uses
const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-');

(async () => {
  fs.mkdirSync('icons', { recursive: true });
  for (const [name, id] of APPS) {
    try {
      const page = await (await fetch(`https://play.google.com/store/apps/details?id=${id}&hl=en`)).text();
      const m =
        page.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/) ||
        page.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/);
      if (!m) throw new Error('icon url not found');
      const url = m[1].replace(/=.*$/, '') + '=s256';
      const img = Buffer.from(await (await fetch(url)).arrayBuffer());
      fs.writeFileSync(`icons/${slug(name)}.png`, img);
      console.log('OK  ', name);
    } catch (e) {
      console.log('FAIL', name, '-', e.message);
    }
  }
})();
